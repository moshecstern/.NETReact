using System;
using System.Collections.Generic;

namespace Domain
{
    public class Post
    {
        public Guid Id { get; set;}
        public string Title {get; set; }
        public string Main2 { get; set; }
        public string Main { get; set; }
        public string Description { get; set; }
         public string Category { get; set; }
         public string Link { get; set; }
         public string Image { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<UserPost> UserPosts {get; set;}
        public virtual ICollection<PostComment> PostComments{get; set;}
           
    }
}