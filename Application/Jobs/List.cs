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

namespace Application.Jobs
{
    public class List
    {
        public class JobsEnvelope
        {
            public List<JobDto> Jobs { get; set; }
            public int JobCount { get; set; }
        }
        public class Query : IRequest<JobsEnvelope>
        {
            public Query(int? limit, int? offset, bool isApplied, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                Offset = offset;
                IsApplied = isApplied;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsApplied { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, JobsEnvelope>
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

            public async Task<JobsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Jobs
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (request.IsApplied && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserJobs.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.IsApplied)
                {
                    queryable = queryable.Where(x => x.UserJobs.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var jobs = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new JobsEnvelope
                {
                    Jobs = _mapper.Map<List<Job>, List<JobDto>>(jobs),
                    JobCount = queryable.Count()
                };
            }
        }
    }
}