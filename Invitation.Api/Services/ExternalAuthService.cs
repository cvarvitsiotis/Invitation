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
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ExternalAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<ExternalClaimsIdentity> GetExternalClaimsIdentityAsync(string idToken)
        {
            try
            {
                HttpClient client = _httpClientFactory.CreateClient();
                string uri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}";
                string responseBody = await client.GetStringAsync(uri);
                ExternalClaimsIdentity claimsIdentity = JsonConvert.DeserializeObject<ExternalClaimsIdentity>(responseBody);
                if (claimsIdentity.Aud != _configuration["GoogleClientId"]) return null;
                return claimsIdentity;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<string> ExchangeAuthCodeForAccessTokenAsync(string authCode)
        {
            HttpClient client = _httpClientFactory.CreateClient();
            Dictionary<string, string> data = new Dictionary<string, string>
            {
                { "code", authCode },
                { "client_id", _configuration["GoogleClientId"] },
                { "client_secret", _configuration["GoogleClientSecret"] },
                { "redirect_uri", "postmessage" },
                { "grant_type", "authorization_code" }
            };
            FormUrlEncodedContent content = new FormUrlEncodedContent(data);
            HttpResponseMessage response = await client.PostAsync("https://www.googleapis.com/oauth2/v4/token", content);
            if (!response.IsSuccessStatusCode) return null;
            string responseBody = await response.Content.ReadAsStringAsync();
            ExternalTokensResponse tokensResponse = JsonConvert.DeserializeObject<ExternalTokensResponse>(responseBody);
            return tokensResponse?.AccessToken;
        }
    }
}