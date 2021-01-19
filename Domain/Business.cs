using System;
using System.Collections.Generic;
namespace Domain
{
    public class Business
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
        public DateTime Date { get; set; }
        public virtual ICollection<UserBusiness> UserBusinesses {get; set;}
        public virtual ICollection<BusinessComment> BusinessComments {get; set;}        
          
    }
}