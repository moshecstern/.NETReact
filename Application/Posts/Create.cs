using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class Create
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
                var post = new Post
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    Main = request.Main ?? "",
                    Main2 = request.Main2 ?? "",
                    Link = request.Link ?? "",
                    Image = request.Image ?? ""

                    // edit only add ones needed to create!
                };
                _context.Posts.Add(post);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());

                var publisher = new UserPost
                {
                    AppUser = user,
                    Post = post,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserPosts.Add(publisher);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }  
    }
}