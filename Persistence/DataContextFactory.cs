using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
 
namespace Persistence
{
  public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
  {
    public DataContext CreateDbContext(string[] args)
    {
      var builder = new ConfigurationBuilder()
         .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false);
      var config = builder.Build();
 
      var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
      optionsBuilder.UseSqlite(config.GetConnectionString("DefaultConnection"));
 
      return new DataContext(optionsBuilder.Options);
    }
  }
}