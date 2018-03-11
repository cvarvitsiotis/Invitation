using Invitation.Api.Models;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IAuthService
    {
        Task<ExternalClaimsIdentity> AuthenticateAsync(string idToken);
    }
}