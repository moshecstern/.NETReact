using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<BlogComment> BlogComments {get; set; }
        public DbSet<JobComment> JobComments {get; set;}
        public DbSet<UserFollowing> Followings { get; set; }
        public DbSet<UserBlog> UserBlogs {get; set; }
        public DbSet<Blog> Blogs {get; set; }
        public DbSet<UserExperience> Experiences {get; set;}
        public DbSet<Job> Jobs {get; set;}
        public DbSet<UserJob> UserJobs {get; set;}




        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );

            builder.Entity<UserActivity>(x => x.HasKey(ua =>
                new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<UserActivity>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserActivity>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // repeat for Jobs, expeirences, blogs
                        builder.Entity<UserJob>(x => x.HasKey(ua =>
                new { ua.AppUserId, ua.JobId }));

            builder.Entity<UserJob>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserJobs)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserJob>()
                .HasOne(a => a.Job)
                .WithMany(u => u.UserJob)
                .HasForeignKey(a => a.JobId);

            builder.Entity<JobFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Applied)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Applicants)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            // Blogs
                        builder.Entity<UserBlog>(x => x.HasKey(ua =>
                new { ua.AppUserId, ua.BlogId }));

            builder.Entity<UserBlog>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserBlogs)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserBlog>()
                .HasOne(a => a.Blog)
                .WithMany(u => u.UserBlog)
                .HasForeignKey(a => a.BlogId);
            builder.Entity<BlogFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.BlogFollowings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                // b.HasOne(o => o.Target)
                //     .WithMany(f => f.BlogFollowers)
                //     .HasForeignKey(o => o.TargetId)
                //     .OnDelete(DeleteBehavior.Restrict);
            });
            // Experiences
                        builder.Entity<UserExperience>(x => x.HasKey(ua =>
                new { ua.AppUserId, ua.ExperienceId }));

            builder.Entity<UserExperience>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserExperiences)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserExperience>()
                .HasOne(a => a.Experience)
                .WithMany(u => u.UserExperience)
                .HasForeignKey(a => a.ExperienceId);


        }
    }
}
