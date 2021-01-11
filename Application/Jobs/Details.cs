using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Jobs
{
    public class Details
    {
        public class Query : IRequest<JobDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, JobDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                // fix take out '.this'
            }

            public async Task<JobDto> Handle(Query request, CancellationToken
             cancellationToken)
            {
                var job = await _context.Jobs
                .FindAsync(request.Id);

                if (job == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        job = "Not Found"
                    });
                var jobToReturn = _mapper.Map<Job, JobDto>(job);

                return jobToReturn;
            }
        }
    }
}