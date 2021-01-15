using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.PurchaseHistories
{
    public class Details
    {
        public class Query : IRequest<PurchaseHistoryDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, PurchaseHistoryDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<PurchaseHistoryDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var purchasehistory = await _context.PurchaseHistories
                .FindAsync(request.Id);

                if (purchasehistory == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        PurchaseHistory = "Not Found"
                    });
                var purchasehistoryToReturn = _mapper.Map<PurchaseHistory, PurchaseHistoryDto>(purchasehistory);

                return purchasehistoryToReturn;
            }
        }     
    }
}