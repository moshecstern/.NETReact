using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class SendMessage
    {
        public class Command : IRequest
        {
        public string Email { get; set; }
        public string Message {get; set; }
        public string Title {get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Message).NotEmpty();
            }
        }
  public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IEmailSender _emailSender;
            public Handler(DataContext context, IEmailSender emailSender)
            {
                _emailSender = emailSender;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                // token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                // var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";
                var ClientEmail = "loneveterans@gmail.com";
                var message = "Title: " + request.Title + " Message: "+  request.Message + " sent by:  " + request.Email;

                await _emailSender.SendEmailAsync(ClientEmail, "Lone Veterans Contact Form: ",  message);
    
                return Unit.Value;

            }
        }
    }
}