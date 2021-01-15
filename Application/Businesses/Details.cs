using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Businesses
{
    public class Details
    {
     public class Query : IRequest<BusinessDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, BusinessDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<BusinessDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var business = await _context.Businesses
                .FindAsync(request.Id);

                if (business == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Business = "Not Found"
                    });
                var businessToReturn = _mapper.Map<Business, BusinessDto>(business);

                return businessToReturn;
            }
        }           
    }
}