using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.JobComments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHubJob : Hub
    {
        private readonly IMediator _mediator;
        public ChatHubJob(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendCommentJob(Create.Command command)
        {
            string username = GetuserNameJob();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.JobId.ToString()).SendAsync("ReceiveJobComment", comment);
        }

        private string GetuserNameJob()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroupJob(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetuserNameJob();

            await Clients.Group(groupName).SendAsync("SendJob", $"{username} has joined the group");
        }

        public async Task RemoveFromGroupJob(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetuserNameJob();

            await Clients.Group(groupName).SendAsync("SendJob", $"{username} has left the group");
        }
    }
}