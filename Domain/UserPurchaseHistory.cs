using System;

namespace Domain
{
    public class UserPurchaseHistory
    {
                public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid PurchaseHistoryId { get; set; }
        public virtual PurchaseHistory PurchaseHistory { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}