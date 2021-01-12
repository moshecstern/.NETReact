using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Experiences
{
    public class Delete
    {
   public class Command : IRequest
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request,
                 CancellationToken cancellationToken)
            {
                // handler logic
                var experience = await _context.Experiences.FindAsync(request.Id);
                if (experience == null)
                    throw new RestException(HttpStatusCode.NotFound, new {experience = "Not Found"});
                _context.Remove(experience);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }     
    }
}