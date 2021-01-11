using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Jobs
{
    public class Unapply
    {
        public class Unattend
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
                    var job = await _context.Jobs.FindAsync(request.Id);

                    if (job == null)
                        throw new RestException(HttpStatusCode.NotFound, new { Job = "Could not find job" });

                    var user = await _context.Users.SingleOrDefaultAsync(x =>
                        x.UserName == _userAccessor.GetCurrentUsername());

                    var applied = await _context.UserJobs
                        .SingleOrDefaultAsync(x => x.JobId == job.Id &&
                            x.AppUserId == user.Id);

                    if (applied == null)
                        return Unit.Value;

                    if (applied.IsHost)
                        throw new RestException(HttpStatusCode.BadRequest, new { applied = "You cannot remove yourself as host" });

                    _context.UserJobs.Remove(applied);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return Unit.Value;

                    throw new Exception("Problem saving changes");
                }

            }
        }
    }
}