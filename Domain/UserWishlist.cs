using System;

namespace Domain
{
    public class UserWishlist
    {
                public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid WishlistId { get; set; }
        public virtual Wishlist Wishlist { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}