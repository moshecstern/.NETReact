using System;

namespace Domain
{
    public class UserJob
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid JobId { get; set; }
        public virtual Job Job { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}