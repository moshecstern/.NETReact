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
        public DbSet<UserFollowing> Followings { get; set; }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<UserBlog> UserBlogs { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<UserJob> UserJobs { get; set; }
        public DbSet<JobComment> JobComments { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<UserExperience> UserExperiences { get; set; }

        // message
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserMessage> UserMessages { get; set; }
        public DbSet<MessageComment> MessageComments { get; set; }

        // Business 
        public DbSet<Business> Businesses { get; set; }
        public DbSet<UserBusiness> UserBusinesses { get; set; }
        public DbSet<BusinessComment> BusinessComments { get; set; }

        //  Post
        public DbSet<Post> Posts { get; set; }
        public DbSet<UserPost> UserPosts { get; set; }
        public DbSet<PostComment> PostComments { get; set; }

        // Product
        public DbSet<Product> Products { get; set; }
        public DbSet<UserProduct> UserProducts { get; set; }
        public DbSet<ProductComment> ProductComments { get; set; }

        // Cart
        public DbSet<Cart> Carts { get; set; }
        public DbSet<UserCart> UserCarts { get; set; }
        // wishlist
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<UserWishlist> UserWishlists { get; set; }
        // purchasehistory
        public DbSet<PurchaseHistory> PurchaseHistories { get; set; }
        public DbSet<UserPurchaseHistory> UserPurchaseHistories { get; set; }




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
                .WithMany(u => u.UserJobs)
                .HasForeignKey(a => a.JobId);


            // Blogs
            builder.Entity<UserBlog>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.BlogId }));

            builder.Entity<UserBlog>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserBlogs)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserBlog>()
                .HasOne(a => a.Blog)
                .WithMany(u => u.UserBlogs)
                .HasForeignKey(a => a.BlogId);
            // Experiences
            builder.Entity<UserExperience>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.ExperienceId }));

            builder.Entity<UserExperience>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserExperiences)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserExperience>()
                .HasOne(a => a.Experience)
                .WithMany(u => u.UserExperiences)
                .HasForeignKey(a => a.ExperienceId);

            // message
             builder.Entity<UserMessage>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.MessageId }));

            builder.Entity<UserMessage>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserMessages)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserMessage>()
                .HasOne(a => a.Message)
                .WithMany(u => u.UserMessages)
                .HasForeignKey(a => a.MessageId);

                // Business
                 builder.Entity<UserBusiness>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.BusinessId }));

            builder.Entity<UserBusiness>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserBusinesses)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserBusiness>()
                .HasOne(a => a.Business)
                .WithMany(u => u.UserBusinesses)
                .HasForeignKey(a => a.BusinessId);


                // Post
                 builder.Entity<UserPost>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.PostId }));

            builder.Entity<UserPost>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserPosts)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserPost>()
                .HasOne(a => a.Post)
                .WithMany(u => u.UserPosts)
                .HasForeignKey(a => a.PostId);

                // Product
                 builder.Entity<UserProduct>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.ProductId }));

            builder.Entity<UserProduct>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserProducts)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserProduct>()
                .HasOne(a => a.Product)
                .WithMany(u => u.UserProducts)
                .HasForeignKey(a => a.ProductId);


                // Cart
                 builder.Entity<UserCart>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.CartId }));

            builder.Entity<UserCart>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserCarts)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserCart>()
                .HasOne(a => a.Cart)
                .WithMany(u => u.UserCarts)
                .HasForeignKey(a => a.CartId);


                // Wishlist
                 builder.Entity<UserWishlist>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.WishlistId }));

            builder.Entity<UserWishlist>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserWishlists)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserWishlist>()
                .HasOne(a => a.Wishlist)
                .WithMany(u => u.UserWishlists)
                .HasForeignKey(a => a.WishlistId);


                // purchasehistory
                 builder.Entity<UserPurchaseHistory>(x => x.HasKey(ua =>
    new { ua.AppUserId, ua.PurchaseHistoryId }));

            builder.Entity<UserPurchaseHistory>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserPurchaseHistories)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserPurchaseHistory>()
                .HasOne(a => a.PurchaseHistory)
                .WithMany(u => u.UserPurchaseHistories)
                .HasForeignKey(a => a.PurchaseHistoryId);
        }
    }
}
