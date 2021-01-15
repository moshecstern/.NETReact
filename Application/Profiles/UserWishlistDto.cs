using System;

namespace Application.Profiles
{
    public class UserWishlistDto
    {
        
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
    }
}