using Domain;

namespace Application.Interfaces
{
    public interface IJwtGenerator
    {
        // string GetCurrentUsername();
     string CreateToken(AppUser user);
    }
}