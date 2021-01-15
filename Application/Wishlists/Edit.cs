using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Wishlists
{
    public class Edit
    {
      public class Command : IRequest
        {
         public Guid Id { get; set;}
        public string Title {get; set; }
        public string Description { get; set; }
         public string Category { get; set; }
         public string Link { get; set; }
         public string Image { get; set; }
         public string MadeBy {get; set; }
         public int Stock {get; set; }
        public DateTime Date { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.Stock).NotEmpty();
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
                var wishlist = await _context.Wishlists.FindAsync(request.Id);
                if (wishlist == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Wishlists = "Not Found"
                    });
                wishlist.Title = request.Title ?? wishlist.Title;
                wishlist.Category = request.Category ?? wishlist.Category;
                wishlist.Description = request.Description ?? wishlist.Description;
                wishlist.Date = request.Date;
                wishlist.Link = request.Link ?? wishlist.Link;
                wishlist.MadeBy = request.MadeBy ?? wishlist.MadeBy;
                wishlist.Image = request.Image ?? wishlist.Image;
                wishlist.Stock = request.Stock;
                // wishlist.City = request.City ?? wishlist.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }    
    }
}