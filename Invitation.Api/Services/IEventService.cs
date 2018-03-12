using Invitation.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IEventService
    {
        Task<bool> AnyAsync();
        
        Task<Event> GetEventAsync(string userId, string id);

        Task<List<Event>> GetEventsAsync(string userId);

        Task<List<Event>> GetEveryonesEventsAsync();

        Task<Event> CreateEventAsync(string userId, AddEvent addEvent);
    }
}