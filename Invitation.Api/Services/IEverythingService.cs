using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IEverythingService
    {
        Everything GetEverything();
        
        void CreateEverythingIfIncomplete();
    }
}