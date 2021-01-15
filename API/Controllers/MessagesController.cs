using System;
using System.Threading.Tasks;
using Application.Messages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseController
    {
       [HttpGet]
        public async Task<ActionResult<List.MessagesEnvelope>> List(int? limit,
                  int? offset, bool messages, bool isHost, DateTime? startDate)
        {
            return await Mediator.Send(new List.Query(limit,
                offset, messages, isHost, startDate));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<MessageDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsMessageHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsMessageHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/sendmessage")]
        public async Task<ActionResult<Unit>> SendMessage(Guid id)
        {
            return await Mediator.Send(new SendMessage.Command { Id = id });
        }

        [HttpDelete("{id}/unsendmessage")]
        public async Task<ActionResult<Unit>> UnsendMessage(Guid id)
        {
            return await Mediator.Send(new UnsendMessage.Command { Id = id });
        } 
    }
}