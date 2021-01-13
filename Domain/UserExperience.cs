using System;

namespace Domain
{
    public class UserExperience
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid ExperienceId { get; set; }
        public virtual Experience Experience { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}