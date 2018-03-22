using System.Threading.Tasks;
using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IGoogleApiAccessTokenService
    {
        Task<GoogleApiAccessToken> GetAccessTokenAsync(string userId);

        Task SaveAccessTokenAsync(string userId, string accessToken);
    }
}