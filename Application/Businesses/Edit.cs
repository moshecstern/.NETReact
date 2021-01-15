using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Businesses
{
    public class Edit
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
        public DateTime? Date { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                // RuleFor(x => x.City).NotEmpty();
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
                var business = await _context.Businesses.FindAsync(request.Id);
                if (business == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Business = "Not Found"
                    });
                business.Title = request.Title ?? business.Title;
                business.Category = request.Category ?? business.Category;
                business.Description = request.Description ?? business.Description;
                business.Date = request.Date ?? business.Date;
                business.FeaturedPost = request.FeaturedPost ?? business.FeaturedPost;
                business.Street = request.Street ?? business.Street;
                business.State = request.State ?? business.State;
                business.Website = request.Website ?? business.Website;
                business.Image = request.Image ?? business.Image;
                business.Hours = request.Hours ?? business.Hours;
                business.IsService = request.IsService;

                // business.City = request.City ?? business.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }  
    }
}