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

namespace Application.Experiences
{
    public class List
    {
        public class ExperiencesEnvelope
        {
            public List<ExperienceDto> Experiences { get; set; }
            public int ExperienceCount { get; set; }
        }
        public class Query : IRequest<ExperiencesEnvelope>
        {
            public Query(int? limit, int? offset, bool isHost, DateTime? startDate)
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

        public class Handler : IRequestHandler<Query, ExperiencesEnvelope>
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

            public async Task<ExperiencesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Experiences
                    .Where(x => x.Date >= request.StartDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (!request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserExperiences.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserExperiences.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var experiences = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new ExperiencesEnvelope
                {
                    Experiences = _mapper.Map<List<Experience>, List<ExperienceDto>>(experiences),
                    ExperienceCount = queryable.Count()
                };
            }
        }
    }
}