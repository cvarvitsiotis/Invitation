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

        public async Task<ExternalClaimsIdentity> GetExternalClaimsIdentityAsync(string accessToken)
        {
            try
            {
                HttpClient client = _httpClientFactory.CreateClient();
                string uri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={accessToken}";
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
    }
}