using Invitation.Api.Models;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IAuthenticationService
    {
        Task<ExternalClaim> Authenticate(string idToken);
    }
}