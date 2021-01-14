using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.JobComments
{
    public class Create
    {
        public class Command : IRequest<JobCommentDto>
        {
            public string Body { get; set; }
            public Guid JobId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, JobCommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<JobCommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var job = await _context.Jobs.FindAsync(request.JobId);

                if (job == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Job = "Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new JobComment
                {
                    Author = user,
                    Job = job,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                // job.Comments.Add(jobcomment);
                job.JobComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<JobCommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}