using System;
using System.Net.Http;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Newtonsoft.Json;

namespace Invitation.Api.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        IHttpClientFactory _httpClientFactory;

        public AuthenticationService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ExternalClaim> Authenticate(string idToken)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                string uri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}";
                string responseBody = await client.GetStringAsync(uri);
                var claim = JsonConvert.DeserializeObject<ExternalClaim>(responseBody);
                const string clientId = "488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com";
                if (claim.Aud != clientId) return null;
                return claim;
            }
            catch (Exception ex)
            {

            }

            return null;
        }
    }
}