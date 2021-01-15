using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Experiences
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            // public string Description { get; set; }
            public string Category { get; set; }
            public string Main { get; set; }
            public string Main2 { get; set; }
            public DateTime Date { get; set; }
            public DateTime DateEnded { get; set; }
            public DateTime DateStarted { get; set; }
            public string Image { get; set; }
            public string City { get; set; }
            public string Skills { get; set; }
            public string Link1 { get; set; }
            public string Link2 { get; set; }
            public string Link1Name { get; set; }
            public string Link2Name { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.DateEnded).NotEmpty();
                RuleFor(x => x.DateStarted).NotEmpty();
                // RuleFor(x => x.Main).NotEmpty();
                // RuleFor(x => x.Main2).NotEmpty();
                // edit rules for whats required
            }
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
                var experience = new Experience
                {
                    Id = request.Id,
                    Title = request.Title,
                    City = request.City,
                    Category = request.Category,
                    Date = request.Date,
                    DateStarted = request.DateStarted,
                    DateEnded = request.DateEnded,
                    Main = request.Main ?? "",
                    Main2 = request.Main2 ?? "",
                    Link1 = request.Link1 ?? "",
                    Link2 = request.Link2 ?? "",
                    Link1Name = request.Link1Name ?? "",
                    Link2Name = request.Link2Name ?? "",
                    Image = request.Image ?? ""
                    // edit not sure how to make optional here
                };
                _context.Experiences.Add(experience);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());

                var publisher = new UserExperience
                {
                    AppUser = user,
                    Experience = experience,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserExperiences.Add(publisher);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}