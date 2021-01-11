using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query{Username = username});
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username, string predicate) 
        {
            return await Mediator.Send(new ListActivities.Query{Username = username, Predicate = predicate});
        }
        [HttpGet("{username}/jobs")]
        public async Task<ActionResult<List<UserJobDto>>> GetUserJobs(string username, string predicate)
        {
            return await Mediator.Send(new ListJobs.Query{Username = username, Predicate = predicate});
        }
        //   [HttpGet("{username}/experiences")]
        // public async Task<ActionResult<List<UserExperienceDto>>> GetUserExperiences(string username, string predicate)
        // {
        //     return await Mediator.Send(new ListExperience.Query{Username = username, Predicate = predicate});
        // }
        //   [HttpGet("{username}/blogs")]
        // public async Task<ActionResult<List<UserBlogDto>>> GetUserBlogs(string username, string predicate)
        // {
        //     return await Mediator.Send(new ListBlog.Query{Username = username, Predicate = predicate});
        // }
    }
}