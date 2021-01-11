using System;

namespace Domain
{
    public class BlogComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Blog Blog { get; set; }
        public DateTime CreatedAt { get; set; }        
           
    }
}