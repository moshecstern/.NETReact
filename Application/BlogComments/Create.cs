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

namespace Application.BlogComments
{
    public class Create
    {
public class Command : IRequest<BlogCommentsDto>
        {
            public string Body { get; set; }
            public Guid BlogId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, BlogCommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<BlogCommentsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var blog = await _context.Blogs.FindAsync(request.BlogId);

                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Blog = "Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new BlogComment
                {
                    Author = user,
                    Blog = blog,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                // job.Comments.Add(jobcomment);
                blog.BlogComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<BlogCommentsDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}