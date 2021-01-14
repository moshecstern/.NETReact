using System;

namespace Domain
{
    public class UserMessage
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid MessageId { get; set; }
        public virtual Message Message { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}