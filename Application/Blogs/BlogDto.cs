using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.BlogComments;
using Application.Profiles;

namespace Application.Blogs
{
    public class BlogDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string City { get; set; }

        [JsonPropertyName("liked")]
        public ICollection<UserBlogDto> UserBlogs { get; set; }
        public ICollection<BlogCommentsDto> BlogComments { get; set; }
    }
}