using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Experiences
{
    public class Details
    {
        public class Query : IRequest<ExperienceDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ExperienceDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<ExperienceDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var experience = await _context.Experiences
                .FindAsync(request.Id);

                if (experience == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        experience = "Not Found"
                    });
                var experienceToReturn = _mapper.Map<Experience, ExperienceDto>(experience);

                return experienceToReturn;
            }
        }        
    }
}