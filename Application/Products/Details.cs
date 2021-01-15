using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Products
{
    public class Details
    {
         public class Query : IRequest<ProductDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ProductDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<ProductDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var product = await _context.Products
                .FindAsync(request.Id);

                if (product == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Product = "Not Found"
                    });
                var productToReturn = _mapper.Map<Product, ProductDto>(product);

                return productToReturn;
            }
        }        
    }
}