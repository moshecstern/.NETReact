using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Carts
{
    public class List
    {
        public class CartsEnvelope
        {
            public List<CartDto> Carts { get; set; }
            public int CartCount { get; set; }
        }
        public class Query : IRequest<CartsEnvelope>
        {
            public Query(int? limit, int? offset, bool isLiked, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                Offset = offset;
                // IsLiked = isLiked;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            // public bool IsLiked { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, CartsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<CartsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Carts
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (!request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserCarts.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserCarts.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var carts = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new CartsEnvelope
                {
                    Carts = _mapper.Map<List<Cart>, List<CartDto>>(carts),
                    CartCount = queryable.Count()
                };
            }
        } 
    }
}