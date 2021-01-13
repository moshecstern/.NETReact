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

namespace Application.Jobs
{
    public class Apply
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
                var job = await _context.Jobs.FindAsync(request.Id);
                if (job == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { Job = "Could not find Job" });
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                var applied = await _context.UserJobs
                    .SingleOrDefaultAsync(x => x.JobId == job.Id &&
                    x.AppUserId == user.Id);

                if (applied != null)
                    throw new RestException(HttpStatusCode.BadRequest, new { applied = "Already applied to this job" });

                applied = new UserJob
                {
                    Job = job,
                    AppUser = user,
                    IsHost = false,
                    DateJoined = DateTime.Now
                };

                _context.UserJobs.Add(applied);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}