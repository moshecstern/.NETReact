using System;
using System.Collections.Generic;

namespace Application.Carts
{
    public class CartDto
    {
        public Guid Id { get; set;}
        public string Title {get; set; }
        public string Description { get; set; }
         public string Category { get; set; }
         public string Link { get; set; }
         public string Image { get; set; }
         public string MadeBy {get; set; }
         public int Stock {get; set; } 
        //  public ICollection<LikedDto> UserBlogs { get; set; }       
    }
}