using Invitation.Models;

namespace Invitation.Services
{
    public interface IEverythingService
    {
        Everything GetEverything();
        
        void CreateEverythingIfIncomplete();
    }
}