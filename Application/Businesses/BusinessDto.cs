using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.BusinessComments;

namespace Application.Businesses
{
    public class BusinessDto
    {
         public Guid Id { get; set;}
        public string Title {get; set; }
        public string Description { get; set; }
        public string FeaturedPost { get; set; }
         public string Category { get; set; }
         public string Street { get; set; }
         public string City { get; set; }
         public string State { get; set; }
         public string Website { get; set; }
         public string Image { get; set; }
         public string Hours { get; set; }
         public bool IsService { get; set; }

        [JsonPropertyName("liked")]
        public ICollection<LikedDto> UserBusinesses { get; set; }
        public ICollection<BusinessCommentsDto> BusinessComments { get; set; }        
    }
}