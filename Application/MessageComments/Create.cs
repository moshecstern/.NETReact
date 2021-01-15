using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.MessageComments
{
    public class Create
    {
        public class Command : IRequest<MessageCommentsDto>
        {
            public string Body { get; set; }
            public Guid MessageId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, MessageCommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<MessageCommentsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var message = await _context.Messages.FindAsync(request.MessageId);

                if (message == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Message = "Not found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new MessageComment
                {
                    Author = user,
                    Message = message,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                // job.Comments.Add(jobcomment);
                message.MessageComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<MessageCommentsDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}