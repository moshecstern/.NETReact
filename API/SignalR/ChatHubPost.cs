using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.PostComments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHubPost : Hub
    {
        private readonly IMediator _mediator;
        public ChatHubPost(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendCommentPost(Create.Command command)
        {
            string username = GetUserNamePost();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.PostId.ToString()).SendAsync("ReceivePostComment", comment);
        }

        private string GetUserNamePost()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroupPost(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNamePost();

            await Clients.Group(groupName).SendAsync("SendPost", $"{username} has joined the group");
        }

        public async Task RemoveFromGroupPost(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNamePost();

            await Clients.Group(groupName).SendAsync("SendPost", $"{username} has left the group");
        }
    }
}