using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Invitation.Api.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        private const string clientId = "488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com";
        IHttpClientFactory _httpClientFactory;

        public ExternalAuthService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ExternalAccessTokenAndClaimsIdentity> GetAccessTokenAndClaimsIdentity(string authCode)
        {
            try
            {
                ExternalTokensResponse tokensResponse = await GetExternalTokensAsync(authCode);

                if (tokensResponse == null) return null;

                ExternalClaimsIdentity claimsIdentity = await GetExternalClaimsIdentityAsync(tokensResponse.IdToken);

                if (claimsIdentity == null) return null;

                ExternalAccessTokenAndClaimsIdentity accessTokenAndClaimsIdentity = new ExternalAccessTokenAndClaimsIdentity
                {
                    AccessToken = tokensResponse.AccessToken,
                    ExternalClaimsIdentity = claimsIdentity
                };

                return accessTokenAndClaimsIdentity;
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private async Task<ExternalTokensResponse> GetExternalTokensAsync(string authCode)
        {
            HttpClient client = _httpClientFactory.CreateClient();            
            var request = new
            {
                code = authCode,
                client_id = clientId,
                client_secret = "",
                grant_type = "authorization_code"
            };
            string serializedRequest = JsonConvert.SerializeObject(request);            
            StringContent content = new StringContent(serializedRequest, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync("https://www.googleapis.com/oauth2/v4/token", content);            
            if (!response.IsSuccessStatusCode) return null;            
            string responseBody = await response.Content.ReadAsStringAsync();            
            return JsonConvert.DeserializeObject<ExternalTokensResponse>(responseBody);
        }

        private async Task<ExternalClaimsIdentity> GetExternalClaimsIdentityAsync(string idToken)
        {
            HttpClient client = _httpClientFactory.CreateClient();
            string uri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}";
            string responseBody = await client.GetStringAsync(uri);
            ExternalClaimsIdentity claimsIdentity = JsonConvert.DeserializeObject<ExternalClaimsIdentity>(responseBody);
            if (claimsIdentity.Aud != clientId) return null;
            return claimsIdentity;
        }
    }
}