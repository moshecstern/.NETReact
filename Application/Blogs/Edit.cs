using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Blogs
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Main { get; set; }
            public string Main2 { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            // public string City { get; set; }
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
                var blog = await _context.Blogs.FindAsync(request.Id);
                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Blog = "Not Found"
                    });
                blog.Title = request.Title ?? blog.Title;
                blog.Category = request.Category ?? blog.Category;
                blog.Description = request.Description ?? blog.Description;
                blog.Date = request.Date ?? blog.Date;
                blog.Main = request.Main ?? blog.Main;
                blog.Main2 = request.Main2 ?? blog.Main2;
                // blog.City = request.City ?? blog.City;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}