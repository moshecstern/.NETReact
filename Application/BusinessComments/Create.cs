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

namespace Application.BusinessComments
{
    public class Create
    {
       
public class Command : IRequest<BusinessCommentsDto>
        {
            public string Body { get; set; }
            public Guid BusinessId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, BusinessCommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<BusinessCommentsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var business = await _context.Businesses.FindAsync(request.BusinessId);

                if (business == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Business = "Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new BusinessComment
                {
                    Author = user,
                    Business = business,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                
                business.BusinessComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<BusinessCommentsDto>(comment);

                throw new Exception("Problem saving changes");
            }
        } 
    }
}