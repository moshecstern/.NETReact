using System;
using System.Threading.Tasks;
using Application.Jobs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class JobsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List.JobsEnvelope>> List(int? limit,
            int? offset, bool isApplied, bool isHost, DateTime? startDate)
        {
            return await Mediator.Send(new List.Query(limit,
                offset, isApplied, isHost, startDate));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<JobDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsJobHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsJobHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/apply")]
        public async Task<ActionResult<Unit>> Apply(Guid id)
        {
            return await Mediator.Send(new Apply.Command { Id = id });
        }

        [HttpDelete("{id}/unapply")]
        public async Task<ActionResult<Unit>> Unapply(Guid id)
        {
            return await Mediator.Send(new Unapply.Command { Id = id });
        }
    }
}