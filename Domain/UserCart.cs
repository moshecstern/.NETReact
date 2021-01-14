using System;

namespace Domain
{
    public class UserCart
    {
         public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid CartId { get; set; }
        public virtual Cart Cart { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }       
    }
}