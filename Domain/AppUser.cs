using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            Photos = new Collection<Photo>();
        }
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public string LongBio { get; set; }
        public bool isBusiness { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserFollowing> Followings { get; set; }
        public virtual ICollection<UserFollowing> Followers { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        
        public virtual ICollection<UserExperience> UserExperiences { get; set; }

        public virtual ICollection<UserJob> UserJobs { get; set; }
        // public virtual ICollection<JobFollowing> JobFollowings { get; set; }
        // public virtual ICollection<JobFollowing> JobFollowers { get; set; }
        public virtual ICollection<UserBlog> UserBlogs { get; set; }
        // public virtual ICollection<BlogFollowing> BlogFollowings { get; set; }
        // public virtual ICollection<BlogFollowing> BlogFollowers { get; set; }
    }
}