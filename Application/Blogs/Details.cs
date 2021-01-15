using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Blogs
{
    public class Details
    {
        public class Query : IRequest<BlogDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, BlogDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<BlogDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var blog = await _context.Blogs
                .FindAsync(request.Id);

                if (blog == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Blog = "Not Found"
                    });
                var blogToReturn = _mapper.Map<Blog, BlogDto>(blog);

                return blogToReturn;
            }
        }        
    }
}