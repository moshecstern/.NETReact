using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class List
    {
 public class MessagesEnvelope
        {
            public List<MessageDto> Messages { get; set; }
            public int MessageCount { get; set; }
        }
        public class Query : IRequest<MessagesEnvelope>
        {
            public Query(int? limit, int? offset, bool sendMessage, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                Offset = offset;
                SendMessage = sendMessage;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool SendMessage { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, MessagesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<MessagesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Messages
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (request.SendMessage && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserMessages.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.SendMessage)
                {
                    queryable = queryable.Where(x => x.UserMessages.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var jobs = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new MessagesEnvelope
                {
                    Messages = _mapper.Map<List<Message>, List<MessageDto>>(jobs),
                    MessageCount = queryable.Count()
                };
            }
        }       
    }
}