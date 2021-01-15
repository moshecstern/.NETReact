using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Messages
{
    public class Details
    {
        public class Query : IRequest<MessageDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, MessageDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<MessageDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var message = await _context.Messages
                .FindAsync(request.Id);

                if (message == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        message = "Not Found"
                    });
                var messageToReturn = _mapper.Map<Message, MessageDto>(message);

                return messageToReturn;
            }
        }
    }
}