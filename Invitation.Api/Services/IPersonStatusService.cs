using System.Threading.Tasks;
using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IPersonStatusService
    {
        Task<PersonStatus> GetPersonStatusAsync(string userId, string eventId, string id);

        Task<PersonStatus> AddPersonStatusAsync(string userId, string eventId, AddPersonStatus addPersonStatus);
    }
}