using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.ProductComments;

namespace Application.Products
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Link { get; set; }
        public string Image { get; set; }
        public string MadeBy { get; set; }
        public int Stock { get; set; }
        
        [JsonPropertyName("liked")]
        public ICollection<LikedDto> UserProducts { get; set; }
        public ICollection<ProductCommentsDto> ProductComments { get; set; }
    }
}