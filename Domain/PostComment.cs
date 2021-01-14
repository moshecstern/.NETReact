using System;

namespace Domain
{
    public class PostComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Post Post { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}