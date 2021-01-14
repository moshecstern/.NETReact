using System;

namespace Domain
{
    public class BusinessComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Business Business { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}