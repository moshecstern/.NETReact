using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.MessageComments;

namespace Application.Messages
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }

        [JsonPropertyName("mymessages")]
        public ICollection<MyMessagesDto> UserMessages { get; set; }
        public ICollection<MessageCommentsDto> MessageComments { get; set; }
    }
}