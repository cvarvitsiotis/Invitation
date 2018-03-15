namespace Invitation.Api.Models
{
    public class ExternalAccessTokenAndClaimsIdentity
    {
        public string AccessToken { get; set; }

        public ExternalClaimsIdentity ExternalClaimsIdentity { get; set; }
    }
}