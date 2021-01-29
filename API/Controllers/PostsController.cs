using System;
using System.Threading.Tasks;
using Application.Posts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PostsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List.PostsEnvelope>> List(int? limit,
                  int? offset, bool isLiked, bool isHost, DateTime? startDate, string myCat)
        {
            return await Mediator.Send(new List.Query(limit,
                offset, isLiked, isHost, startDate, myCat));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<PostDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsPostHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsPostHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/like")]
        public async Task<ActionResult<Unit>> Like(Guid id)
        {
            return await Mediator.Send(new Like.Command { Id = id });
        }

        [HttpDelete("{id}/unlike")]
        public async Task<ActionResult<Unit>> Unlike(Guid id)
        {
            return await Mediator.Send(new Unlike.Command { Id = id });
        }
    }
}