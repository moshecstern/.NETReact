using System;
using System.Collections.Generic;

namespace Domain
{
    public class Experience
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string Main { get; set; }
        public string Main2 { get; set; }
        public string City { get; set; }
        public string Image { get; set; }
        public string skills { get; set; }
        public string Link1 { get; set; }
        public string Link1Name { get; set; }
        public string Link2 { get; set; }
        public string Link2Name { get; set; }
        // public string Image { get; set; }
        public DateTime DateStarted { get; set; }
        public DateTime DateEnded { get; set; }
        public virtual ICollection<UserExperience> UserExperience {get; set;}
        // public virtual ICollection<Comment> Comments {get; set;}
    }
}