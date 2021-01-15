using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.PurchaseHistories
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
                var purchaseHistory = await _context.PurchaseHistories.FindAsync(request.Id);
                if (purchaseHistory == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        PurchaseHistories = "Not Found"
                    });
                purchaseHistory.Title = request.Title ?? purchaseHistory.Title;
                purchaseHistory.Category = request.Category ?? purchaseHistory.Category;
                purchaseHistory.Description = request.Description ?? purchaseHistory.Description;
                purchaseHistory.Date = request.Date;
                purchaseHistory.Link = request.Link ?? purchaseHistory.Link;
                purchaseHistory.MadeBy = request.MadeBy ?? purchaseHistory.MadeBy;
                purchaseHistory.Image = request.Image ?? purchaseHistory.Image;
                purchaseHistory.Stock = request.Stock;
                // purchaseHistory.City = request.City ?? purchaseHistory.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }  
    }
}