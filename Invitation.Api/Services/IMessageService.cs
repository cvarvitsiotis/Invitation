using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IMessageService
    {
        Message GetMessage(string eventId, string id);

        Message AddMessage(string eventId, AddMessage addMessage);
    }
}