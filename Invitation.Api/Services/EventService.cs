using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class EventService : BaseService, IEventService
    {
        private readonly ApiContext _apiContext;
        private readonly IPersonService _personService;

        public EventService(ApiContext apiContext, IPersonService personService)
        {
            _apiContext = apiContext;
            _personService = personService;
        }

        public async Task<bool> AnyAsync()
        {
            return await _apiContext.Events.AnyAsync();
        }

        public async Task<Event> GetEventAsync(string userId, string id)
        {
            return await _apiContext.Events.Where(e => e.UserId == userId && e.Id == id).Include(e => e.Messages).Include(e => e.PersonStatuses).FirstOrDefaultAsync();
        }

        public async Task<List<Event>> GetEventsAsync(string userId)
        {
            return await _apiContext.Events.Where(e => e.UserId == userId).Include(e => e.Messages).Include(e => e.PersonStatuses).ToListAsync();
        }

        public async Task<Event> CreateEventAsync(string userId, AddEvent addEvent)
        {
            string eventId = GetNextId(_apiContext.Events.Select(e => e.Id));
            Event @event = new Event
            {
                Id = eventId,
                UserId = userId,
                Description = addEvent.Description,
                Date = addEvent.Date
            };
            
            await _apiContext.Events.AddAsync(@event);
            await _apiContext.SaveChangesAsync();
            return await GetEventAsync(userId, eventId);
        }
    }
}