using Invitation.Api.Models;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IExternalAuthService
    {
        Task<ExternalAccessTokenAndClaimsIdentity> GetAccessTokenAndClaimsIdentity(string authCode);
    }
}