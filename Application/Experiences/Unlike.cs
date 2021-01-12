using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Experiences
{
    public class Unlike
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var experience = await _context.Experiences.FindAsync(request.Id);

                if (experience == null)
                    throw new RestException(HttpStatusCode.NotFound, new { experience = "Could not find blog" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                var liked = await _context.UserExperiences
                    .SingleOrDefaultAsync(x => x.ExperienceId == experience.Id &&
                        x.AppUserId == user.Id);

                if (liked == null)
                    return Unit.Value;

                if (liked.IsHost)
                    throw new RestException(HttpStatusCode.BadRequest, new { experience = "You cannot remove yourself as host" });

                _context.UserExperiences.Remove(liked);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }       
    }
}