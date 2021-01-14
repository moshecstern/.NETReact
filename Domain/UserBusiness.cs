using System;

namespace Domain
{
    public class UserBusiness
    {
         public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid BusinessId { get; set; }
        public virtual Business Business { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }       
    }
}