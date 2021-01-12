using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.JobComments;

namespace Application.Jobs
{
    public class JobDto
    {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string Description { get; set; }
            public string City { get; set; }

            [JsonPropertyName("applied")]
            
            public ICollection<AppliedDto> UserJobs { get; set; }
            public ICollection<JobCommentDto> JobComments { get; set; }
    }
}