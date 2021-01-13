using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class BlogIsHostRequirement : IAuthorizationRequirement
    {
        
    }
    public class IsBlogHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public IsBlogHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var blogId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            var blog = _context.Blogs.FindAsync(blogId).Result;

            var host = blog.UserBlogs.FirstOrDefault(x => x.IsHost);

            if (host?.AppUser?.UserName == currentUserName)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}