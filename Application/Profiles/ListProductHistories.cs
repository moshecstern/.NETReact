using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Profiles
{
    public class ListProductHistories
    {
       public class Query : IRequest<List<UserPurchaseHistoryDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserPurchaseHistoryDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserPurchaseHistoryDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserPurchaseHistories
                    .OrderBy(a => a.PurchaseHistory.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.PurchaseHistory.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.PurchaseHistory.Date >= DateTime.Now);
                        break;
                }

                var purchaseHistories = queryable.ToList();
                var purchaseHistoriesToReturn = new List<UserPurchaseHistoryDto>();

                foreach (var activity in purchaseHistories)
                {
                    var userPurchaseHistory = new UserPurchaseHistoryDto
                    {
                        Id = activity.PurchaseHistory.Id,
                        Title = activity.PurchaseHistory.Title,
                        Category = activity.PurchaseHistory.Category,
                        Date = activity.PurchaseHistory.Date
                    };

                    purchaseHistoriesToReturn.Add(userPurchaseHistory);
                }

                return purchaseHistoriesToReturn;
            }
        }         
    }
}