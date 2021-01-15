using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class SendMessage
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Unit> Handle(Command request,
                 CancellationToken cancellationToken)
            {
                // handler logic
                var message = await _context.Messages.FindAsync(request.Id);
                if (message == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { Message = "Could not find Message" });
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                var SendMessage = await _context.UserMessages
                    .SingleOrDefaultAsync(x => x.MessageId == message.Id &&
                    x.AppUserId == user.Id);

                if (SendMessage != null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Message = "Already SendMessage to this message" });

                SendMessage = new UserMessage
                {
                    Message = message,
                    AppUser = user,
                    IsHost = false,
                    DateJoined = DateTime.Now
                };

                _context.UserMessages.Add(SendMessage);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}