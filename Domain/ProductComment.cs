using System;

namespace Domain
{
    public class ProductComment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Product Product { get; set; }
        public DateTime CreatedAt { get; set; }          
    }
}