using System.Linq;
using System.Threading.Tasks;
using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Invitation.Api.Services
{
    public class GoogleApiAccessTokenService : IGoogleApiAccessTokenService
    {
        private readonly ApiContext _apiContext;

        public GoogleApiAccessTokenService(ApiContext apiContext)
        {
            _apiContext = apiContext;            
        }

        public async Task<GoogleApiAccessToken> GetAccessTokenAsync(string userId)
        {
            return await _apiContext.GoogleApiAccessTokens.Where(t => t.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task SaveAccessTokenAsync(string userId, string accessToken)
        {
            GoogleApiAccessToken oldGoogleApiAccessToken = await GetAccessTokenAsync(userId);

            if (oldGoogleApiAccessToken != null)
            {
                if (oldGoogleApiAccessToken.AccessToken != accessToken) oldGoogleApiAccessToken.AccessToken = accessToken;
            }
            else
            {
                GoogleApiAccessToken newGoogleApiAccessToken = new GoogleApiAccessToken
                {
                    UserId = userId,
                    AccessToken = accessToken
                };
                await _apiContext.GoogleApiAccessTokens.AddAsync(newGoogleApiAccessToken);
            }

            await _apiContext.SaveChangesAsync();
        }
    }
}