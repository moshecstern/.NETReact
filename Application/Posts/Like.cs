using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class Like
    {
       public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                // handler logic
                var posts = await _context.Posts.FindAsync(request.Id);
                if (posts == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { Post = "Could not find Post" });
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                var liked = await _context.UserPosts
                    .SingleOrDefaultAsync(x => x.PostId == posts.Id &&
                    x.AppUserId == user.Id);

                if (liked != null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Post = "Already liked this posts" });

                liked = new UserPost
                {
                    Post = posts,
                    AppUser = user,
                    IsHost = false,
                    DateJoined = DateTime.Now
                };

                _context.UserPosts.Add(liked);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }     
    }
}