using Newtonsoft.Json;

namespace Invitation.Api.Models
{
    public class ExternalTokensResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        
        [JsonProperty("id_token")]
        public string IdToken { get; set; }
        
        [JsonProperty("expires_in")]
        public string ExpiresIn { get; set; }
        
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
    }
}