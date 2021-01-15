using System;

namespace Application.ProductComments
{
    public class ProductCommentsDto
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public bool Following {get; set;}
    }
}