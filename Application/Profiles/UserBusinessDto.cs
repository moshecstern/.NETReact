using System;

namespace Application.Profiles
{
    public class UserBusinessDto
    {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
        
    }
}