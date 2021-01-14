using System;

namespace Domain
{
    public class UserProduct
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid ProductId { get; set; }
        public virtual Product Product { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }        
    }
}