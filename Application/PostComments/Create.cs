using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.PostComments
{
    public class Create
    {
      
public class Command : IRequest<PostCommentsDto>
        {
            public string Body { get; set; }
            public Guid PostId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, PostCommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<PostCommentsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _context.Posts.FindAsync(request.PostId);

                if (post == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Post = "Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new PostComment
                {
                    Author = user,
                    Post = post,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                // job.Comments.Add(jobcomment);
                post.PostComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<PostCommentsDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }  
    }
}