using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Carts
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
                var cart = await _context.Carts.FindAsync(request.Id);
                if (cart == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Cart = "Not Found"
                    });
                cart.Title = request.Title ?? cart.Title;
                cart.Category = request.Category ?? cart.Category;
                cart.Description = request.Description ?? cart.Description;
                cart.Date = request.Date;
                cart.Link = request.Link ?? cart.Link;
                cart.MadeBy = request.MadeBy ?? cart.MadeBy;
                cart.Image = request.Image ?? cart.Image;
                cart.Stock = request.Stock;
                // cart.City = request.City ?? cart.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }   
    }
}