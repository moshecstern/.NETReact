using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Jobs
{
    public class Command : IRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime? Date { get; set; }
        public string City { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
        }
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
            var job = await _context.Jobs.FindAsync(request.Id);
            if (job == null)
                throw new RestException(HttpStatusCode.NotFound, new
                {
                    job = "Not Found"
                });
            job.Title = request.Title ?? job.Title;
            job.Category = request.Category ?? job.Category;
            job.Description = request.Description ?? job.Description;
            job.Date = request.Date ?? job.Date;
            job.City = request.City ?? job.City;

            var success = await _context.SaveChangesAsync() > 0;
            if (success) return Unit.Value;
            throw new Exception("Problem saving changes");
        }
    }
}