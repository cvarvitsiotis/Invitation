using System;
using System.Net.Http;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Invitation.Api.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        IHttpClientFactory _httpClientFactory;

        public ExternalAuthService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ExternalClaimsIdentity> AuthenticateAsync(string idToken)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                string uri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}";
                string responseBody = await client.GetStringAsync(uri);
                var claimsIdentity = JsonConvert.DeserializeObject<ExternalClaimsIdentity>(responseBody);
                const string clientId = "488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com";
                if (claimsIdentity.Aud != clientId) return null;
                return claimsIdentity;
            }
            catch (Exception)
            {
            }
            
            return null;
        }            
    }
}