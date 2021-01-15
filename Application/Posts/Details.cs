using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class Details
    {
         public class Query : IRequest<PostDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, PostDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<PostDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var post = await _context.Posts
                .FindAsync(request.Id);

                if (post == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Post = "Not Found"
                    });
                var postToReturn = _mapper.Map<Post, PostDto>(post);

                return postToReturn;
            }
        }        
    }
}