using System;

namespace Domain
{
    public class MessageComment
    {
         public Guid Id { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Message Message { get; set; }
        public DateTime CreatedAt { get; set; }        
    }
}