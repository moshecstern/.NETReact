using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Jobs
{
    public class FollowingResolver : IValueResolver<UserJob, AppliedDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public bool Resolve(UserJob source, AppliedDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername()).Result;

            if (currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
                return true;

            return false;
        }       
    }
}