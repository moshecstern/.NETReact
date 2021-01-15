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

namespace Application.ProductComments
{
    public class Create
    {
        public class Command : IRequest<ProductCommentsDto>
        {
            public string Body { get; set; }
            public Guid ProductId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, ProductCommentsDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<ProductCommentsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = await _context.Products.FindAsync(request.ProductId);

                if (product == null)
                    throw new RestException(HttpStatusCode.NotFound, new {Product = "Not found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new ProductComment
                {
                    Author = user,
                    Product = product,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };
                // job.Comments.Add(jobcomment);
                product.ProductComments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<ProductCommentsDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}