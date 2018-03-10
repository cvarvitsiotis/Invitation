using Invitation.Api.Models;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IEverythingService
    {
        Task<Everything> GetEverything(string userId);
        
        void CreateEverythingIfIncomplete();
    }
}