using System;

namespace Application.Profiles
{
    public class UserPostDto
    {
        
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
    }
}