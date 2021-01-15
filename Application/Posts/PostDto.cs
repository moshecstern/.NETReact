using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.PostComments;

namespace Application.Posts
{
    public class PostDto
    {

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Main2 { get; set; }
        public string Main { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Link { get; set; }
        public string Image { get; set; }

        [JsonPropertyName("liked")]
        public ICollection<LikedDto> UserPosts { get; set; }
        public ICollection<PostCommentsDto> PostComments { get; set; }
    }
}