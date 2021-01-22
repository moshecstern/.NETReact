using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.BusinessComments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHubBusiness : Hub
    {
        private readonly IMediator _mediator;
        public ChatHubBusiness(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendCommentBusiness(Create.Command command)
        {
            string username = GetUserNameBusiness();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.BusinessId.ToString()).SendAsync("ReceiveBusinessComment", comment);
        }

        private string GetUserNameBusiness()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroupBusiness(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameBusiness();

            await Clients.Group(groupName).SendAsync("SendBusiness", $"{username} has joined the group");
        }

        public async Task RemoveFromGroupBusiness(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameBusiness();

            await Clients.Group(groupName).SendAsync("SendBusiness", $"{username} has left the group");
        }
    }
}