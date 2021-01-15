using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Wishlists
{
    public class Details
    {
        public class Query : IRequest<WishlistDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, WishlistDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<WishlistDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var wishlist = await _context.Wishlists
                .FindAsync(request.Id);

                if (wishlist == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Wishlist = "Not Found"
                    });
                var wishlistToReturn = _mapper.Map<Wishlist, WishlistDto>(wishlist);

                return wishlistToReturn;
            }
        }        
    }
}