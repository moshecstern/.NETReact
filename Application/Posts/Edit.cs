using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class Edit
    {
       public class Command : IRequest
        {
        public Guid Id { get; set;}
        public string Title {get; set; }
        public string Main2 { get; set; }
        public string Main { get; set; }
        public string Description { get; set; }
         public string Category { get; set; }
         public string Link { get; set; }
         public string Image { get; set; }
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
                var post = await _context.Posts.FindAsync(request.Id);
                if (post == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Post = "Not Found"
                    });
                post.Title = request.Title ?? post.Title;
                post.Category = request.Category ?? post.Category;
                post.Description = request.Description ?? post.Description;
                post.Date = request.Date;
                post.Main = request.Main ?? post.Main;
                post.Main2 = request.Main2 ?? post.Main2;
                // post.City = request.City ?? post.City;
                post.Link = request.Link ?? post.Link;
                post.Image = request.Image ?? post.Image;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        } 
    }
}