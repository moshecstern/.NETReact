using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.ProductComments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHubProduct : Hub
    {
        private readonly IMediator _mediator;
        public ChatHubProduct(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendCommentProduct(Create.Command command)
        {
            string username = GetUserNameProduct();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.ProductId.ToString()).SendAsync("ReceiveProductComment", comment);
        }

        private string GetUserNameProduct()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroupProduct(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameProduct();

            await Clients.Group(groupName).SendAsync("SendProduct", $"{username} has joined the group");
        }

        public async Task RemoveFromGroupProduct(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameProduct();

            await Clients.Group(groupName).SendAsync("SendProduct", $"{username} has left the group");
        }
    }
}