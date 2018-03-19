using Invitation.Api.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        private const string clientId = "488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com";
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ExternalAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<ExternalAccessTokenAndClaimsIdentity> GetAccessTokenAndClaimsIdentity(string authCode)
        {
            try
            {
                ExternalTokensResponse tokensResponse = await GetExternalTokensAsync(authCode);

                if (tokensResponse == null) return null;

                ExternalClaimsIdentity claimsIdentity = await GetExternalClaimsIdentityAsync(tokensResponse.IdToken);

                if (claimsIdentity == null) return null;

                return new ExternalAccessTokenAndClaimsIdentity
                {
                    AccessToken = tokensResponse.AccessToken,
                    ExternalClaimsIdentity = claimsIdentity
                };
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private async Task<ExternalTokensResponse> GetExternalTokensAsync(string authCode)
        {
            HttpClient client = _httpClientFactory.CreateClient();
            Dictionary<string, string> data = new Dictionary<string, string>
            {
                { "code", authCode },
                { "client_id", clientId },
                { "client_secret", _configuration["GoogleClientSecret"] },
                { "redirect_uri", "postmessage" },
                { "grant_type", "authorization_code" }
            };
            FormUrlEncodedContent content = new FormUrlEncodedContent(data);
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