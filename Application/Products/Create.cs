using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products
{
    public class Create
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
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.MadeBy).NotEmpty();
                RuleFor(x => x.Stock).NotEmpty();
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
                var product = new Product
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    Image = request.Image ?? "",
                    Stock = request.Stock,
                    Link = request.Link ?? "",
                    MadeBy = request.MadeBy
                    
                    // City = request.City,
                };
                _context.Products.Add(product);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());

                var applicant = new UserProduct
                {
                    AppUser = user,
                    Product = product,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserProducts.Add(applicant);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }   
    }
}