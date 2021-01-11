using System;

namespace Domain
{
    public class JobComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Job Job { get; set; }
        public DateTime CreatedAt { get; set; } 
    }
}