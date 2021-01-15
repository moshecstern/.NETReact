using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Businesses
{
    public class Create
    {
       public class Command : IRequest
        {
         public Guid Id { get; set;}
        public string Title {get; set; }
        public string Description { get; set; }
        public string FeaturedPost { get; set; }
         public string Category { get; set; }
         public string Street { get; set; }
         public string City { get; set; }
         public string State { get; set; }
         public string Website { get; set; }
         public string Image { get; set; }
         public string Hours { get; set; }
         public bool IsService { get; set; }
        public DateTime Date { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                // RuleFor(x => x.Main).NotEmpty();
                // RuleFor(x => x.Main2).NotEmpty();
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
                var business = new Business
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    FeaturedPost = request.FeaturedPost ?? "",
                    Category = request.Category ?? "",
                    Date = request.Date,
                    Street = request.Street ?? "",
                    State = request.State ?? "",
                    Website = request.Website ?? "",
                    Image = request.Image ?? "",
                    Hours = request.Hours ?? "",
                    IsService = request.IsService,

                    // edit make sure to add all options here
                };
                _context.Businesses.Add(business);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());

                var publisher = new UserBusiness
                {
                    AppUser = user,
                    Business = business,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserBusinesses.Add(publisher);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }          
    }
}