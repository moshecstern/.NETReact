using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com",
                        EmailConfirmed = true
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.Experiences.Any())
            {
                var experiences = new List<Experience>
                {
                    new Experience
                    {
        Title= "Churchland Psychological Center",
        Category= "Experience",
        // DateStarted= "2020-04-01",
        // DateEnded= "2020-07-01",
        City= "Cali",
        Main= "Designed, and maintain website",
        Main2= "Longer Info if i have it",
        Skills="GitHub, JavaScript, React, Node",
        Link2= "https://",
        Link1= "htttps://",
        Image= "https://",
        UserExperiences = new List<UserExperience>
                        {
                            new UserExperience
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    }
        };
                await context.Experiences.AddRangeAsync(experiences);
                await context.SaveChangesAsync();
            }



            if (!context.Jobs.Any())
            {
                var jobs = new List<Job>
                {
                    new Job
                    {
                        Title = "Job number 1",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Sign here for exclusive job offers",
                        Category = "drinks",
                        City = "London",
                        // Venue = "Pub",
                        UserJobs = new List<UserJob>
                        {
                            new UserJob
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            },
                            new UserJob
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            }
                        }
                    },
                    new Job
                    {
                        Title = "Job number 2",
                        Date = DateTime.Now.AddMonths(32),
                        Description = "Sign here for exclusive job offers and more",
                        Category = "drinks",
                        City = "England",
                        // Venue = "Pub",
                        UserJobs = new List<UserJob>
                        {
                            new UserJob
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    },
                        new Job
                    {
                        Title = "Job number 3",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "gggggggg job offers and more",
                        Category = "drinks",
                        City = "Venice",
                        // Venue = "Pub",
                        UserJobs = new List<UserJob>
                        {
                            new UserJob
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            },
                            new UserJob
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            }
                        }
                    }
                };
                await context.Jobs.AddRangeAsync(jobs);
                await context.SaveChangesAsync();
            }

            if (!context.Blogs.Any())
            {
                var blogs = new List<Blog>
                {
                    new Blog
                    {
                        Title = "Blog number 1",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Sign here for exclusive job offers",
                        Category = "drinks",
                        Main= "practicing and trying to get it up and running",
                        Main2="Extra text to put in if needed",
                        UserBlogs = new List<UserBlog>
                        {
                            new UserBlog
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            },
                            new UserBlog
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            }
                        }
                    },
                    new Blog
                    {
                        Title = "Blog number 2",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Sign here for exclusive job offers and more",
                        Category = "drinks",
                        Main= "practicing and trying to get it up and running",
                        Main2="Extra text to put in if needed",
                        // City = "England",
                        // Venue = "Pub",
                        UserBlogs = new List<UserBlog>
                        {
                            new UserBlog
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            },
                            new UserBlog
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            }
                        }
                    },
                        new Blog
                    {
                        Title = "Blog number 3",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "gggggggg job offers and more",
                        Category = "drinks",
                        Main= "practicing and trying to get it up and running",
                        Main2="Extra text to put in if needed",
                        // City = "Venice",
                        // Venue = "Pub",
                        UserBlogs = new List<UserBlog>
                        {
                            new UserBlog
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            },
                            new UserBlog
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            }
                        }
                    }
                };
                await context.Blogs.AddRangeAsync(blogs);
                await context.SaveChangesAsync();
            }


            if (!context.Activities.Any())
            {
                var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Past Activity 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Activity 2 months ago",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Past Activity 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Activity 1 month ago",
                        Category = "culture",
                        City = "Paris",
                        Venue = "The Louvre",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Activity 1 month in future",
                        Category = "music",
                        City = "London",
                        Venue = "Wembly Stadium",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2 months in future",
                        Category = "food",
                        City = "London",
                        Venue = "Jamies Italian",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(3)
                            },
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(3)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4 months in future",
                        Category = "culture",
                        City = "London",
                        Venue = "British Museum",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(4)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Activity 5 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Punch and Judy",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Activity 6 months in future",
                        Category = "music",
                        City = "London",
                        Venue = "O2 Arena",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(6)
                            },
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(6)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Activity 7 months in future",
                        Category = "travel",
                        City = "Berlin",
                        Venue = "All",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(7)
                            },
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(7)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Activity 8 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(8)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(8)
                            },
                        }
                    }
                };

                await context.Activities.AddRangeAsync(activities);
                await context.SaveChangesAsync();
            }
        }
    }
}