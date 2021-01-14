using System;

namespace Domain
{
    public class UserPost
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid PostId { get; set; }
        public virtual Post Post { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }        
    }
}