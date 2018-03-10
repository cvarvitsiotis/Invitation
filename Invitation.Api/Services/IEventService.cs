using Invitation.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IEventService
    {
        bool Any();
        
        Event GetEvent(string id);

        Task<List<Event>> GetEventsByUserId(string userId);

        Event CreateEvent(AddEvent addEvent);
    }
}