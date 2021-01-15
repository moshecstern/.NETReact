using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Products
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
                var product = await _context.Products.FindAsync(request.Id);
                if (product == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Product = "Not Found"
                    });
                product.Title = request.Title ?? product.Title;
                product.Category = request.Category ?? product.Category;
                product.Description = request.Description ?? product.Description;
                product.Date = request.Date;
                product.Link = request.Link ?? product.Link;
                product.MadeBy = request.MadeBy ?? product.MadeBy;
                product.Image = request.Image ?? product.Image;
                product.Stock = request.Stock;
                // product.City = request.City ?? product.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }  
    }
}