using System.Threading.Tasks;
using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IMessageService
    {
        Task<Message> GetMessageAsync(string userId, string eventId, string id);

        Task<Message> AddMessageAsync(string userId, string eventId, AddMessage addMessage);
    }
}