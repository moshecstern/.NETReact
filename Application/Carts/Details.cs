using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Carts
{
    public class Details
    {
        public class Query : IRequest<CartDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, CartDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<CartDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var cart = await _context.Carts
                .FindAsync(request.Id);

                if (cart == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Cart = "Not Found"
                    });
                var cartToReturn = _mapper.Map<Cart, CartDto>(cart);

                return cartToReturn;
            }
        }        
    }
}