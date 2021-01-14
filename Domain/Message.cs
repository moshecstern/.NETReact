using System;
using System.Collections.Generic;

namespace Domain
{
    public class Message
    {
        public Guid Id { get; set;}
        public string Title {get; set; }
        public string Description { get; set; }
         public string Category { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<UserMessage> UserMessages {get; set;}
        public virtual ICollection<MessageComment> MessageComments {get; set;}        
    }
}