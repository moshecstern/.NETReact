using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.BlogComments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHubBlog : Hub
    {
        private readonly IMediator _mediator;
        public ChatHubBlog(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendCommentBlog(Create.Command command)
        {
            string username = GetUserNameBlog();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.BlogId.ToString()).SendAsync("ReceiveBlogComment", comment);
        }

        private string GetUserNameBlog()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroupBlog(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameBlog();

            await Clients.Group(groupName).SendAsync("SendBlog", $"{username} has joined the group");
        }

        public async Task RemoveFromGroupBlog(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUserNameBlog();

            await Clients.Group(groupName).SendAsync("SendBlog", $"{username} has left the group");
        }
    }
}