using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListMessages
    {
        public class Query : IRequest<List<UserMessageDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }
        public class Handler : IRequestHandler<Query, List<UserMessageDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserMessageDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserMessages
                    .OrderBy(a => a.Message.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Message.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Message.Date >= DateTime.Now);
                        break;
                }

                var messages = queryable.ToList();
                var messageToReturn = new List<UserMessageDto>();

                foreach (var message in messages)
                {
                    var usermessage = new UserMessageDto
                    {
                        Id = message.Message.Id,
                        Title = message.Message.Title,
                        Category = message.Message.Category,
                        Date = message.Message.Date
                    };

                    messageToReturn.Add(usermessage);
                }

                return messageToReturn;
            }
        }
    }
}