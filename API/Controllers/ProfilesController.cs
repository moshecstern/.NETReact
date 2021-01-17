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
          [HttpGet("{username}/experiences")]
        public async Task<ActionResult<List<UserExperienceDto>>> GetUserExperiences(string username, string predicate)
        {
            return await Mediator.Send(new ListExperiences.Query{Username = username, Predicate = predicate});
        }
          [HttpGet("{username}/blogs")]
        public async Task<ActionResult<List<UserBlogDto>>> GetUserBlogs(string username, string predicate)
        {
            return await Mediator.Send(new ListBlogs.Query{Username = username, Predicate = predicate});
        }

                  [HttpGet("{username}/messages")]
        public async Task<ActionResult<List<UserMessageDto>>> GetUserMessages(string username, string predicate)
        {
            return await Mediator.Send(new ListMessages.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/businesses")]
        public async Task<ActionResult<List<UserBusinessDto>>> GetUserBusinesses(string username, string predicate)
        {
            return await Mediator.Send(new ListBusinesses.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/posts")]
        public async Task<ActionResult<List<UserPostDto>>> GetUserPosts(string username, string predicate)
        {
            return await Mediator.Send(new ListPosts.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/products")]
        public async Task<ActionResult<List<UserProductDto>>> GetUserProducts(string username, string predicate)
        {
            return await Mediator.Send(new ListProducts.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/carts")]
        public async Task<ActionResult<List<UserCartDto>>> GetUserCarts(string username, string predicate)
        {
            return await Mediator.Send(new ListCarts.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/wishlists")]
        public async Task<ActionResult<List<UserWishlistDto>>> GetUserWishlists(string username, string predicate)
        {
            return await Mediator.Send(new ListWishlists.Query{Username = username, Predicate = predicate});
        }
                  [HttpGet("{username}/purchasehistories")]
        public async Task<ActionResult<List<UserPurchaseHistoryDto>>> GetUserPurchaseHistories(string username, string predicate)
        {
            return await Mediator.Send(new ListProductHistories.Query{Username = username, Predicate = predicate});
        }
    }
}