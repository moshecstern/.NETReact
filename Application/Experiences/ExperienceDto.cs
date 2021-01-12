using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Experiences
{
    public class ExperienceDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string City{ get; set; }
        public DateTime Date { get; set; }
        public DateTime DateStarted { get; set; }
        public DateTime DateEnded { get; set; }
        public string Description { get; set; }
        public string Main { get; set; }
        public string Main2 { get; set; }
        public string Image { get; set; }
        public string Link1 { get; set; }
        public string Link1Name { get; set; }
        public string Link2 { get; set; }
        public string Link2Name { get; set; }

        [JsonPropertyName("liked")]
        public ICollection<LikedDto> UserExperiences { get; set; }
        // public ICollection<ExperienceCommentsDto> ExpeirenceComments { get; set; }
    }
}