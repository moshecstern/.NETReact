using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Experiences
{
    public class Edit
    {
public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Main { get; set; }
            public string Main2 { get; set; }
            // public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public DateTime? DateStarted { get; set; }
            public DateTime? DateEnded { get; set; }
            public string City { get; set; }
            public string Image { get; set; }
            public string Skills { get; set; }
            // figure out fix how to make array
            public string Link1 { get; set; }
            public string Link1Name { get; set; }
            public string Link2 { get; set; }
            public string Link2Name { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Main).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                // RuleFor(x => x.City).NotEmpty();
                // edit for what is mandatory to fill in
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
                var experience = await _context.Experiences.FindAsync(request.Id);
                if (experience == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        experience = "Not Found"
                    });
                experience.Title = request.Title ?? experience.Title;
                experience.Category = request.Category ?? experience.Category;
                // experience.Description = request.Description ?? experience.Description;
                experience.Date = request.Date ?? experience.Date;
                experience.DateStarted = request.DateStarted ?? experience.DateStarted;
                experience.DateEnded = request.DateEnded ?? experience.DateEnded;
                experience.Main = request.Main ?? experience.Main;
                experience.Main2 = request.Main2 ?? experience.Main2;
                experience.Skills = request.Skills ?? experience.Skills;
                experience.City = request.City ?? experience.City;
                experience.Image = request.Image ?? experience.Image;
                experience.Link1 = request.Link1 ?? experience.Link1;
                experience.Link1Name = request.Link1Name ?? experience.Link1Name;
                experience.Link2 = request.Link2 ?? experience.Link2;
                experience.Link2Name = request.Link2Name ?? experience.Link2Name;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }        
    }
}