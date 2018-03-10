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

        public bool Any()
        {
            return _apiContext.Events.Any();
        }

        public Event GetEvent(string id)
        {
            return _apiContext.Events.Where(e => e.Id == id).Include(e => e.Messages).Include(e => e.PersonStatuses).FirstOrDefault();
        }

        public async Task<List<Event>> GetEventsByUserId(string userId)
        {
            return await _apiContext.Events.Where(e => e.UserId == userId).Include(e => e.Messages).Include(e => e.PersonStatuses).ToListAsync();
        }

        public Event CreateEvent(AddEvent addEvent)
        {
            string eventId = GetNextId(_apiContext.Events.Select(e => e.Id));
            Event @event = new Event
            {
                Id = eventId,
                UserId = addEvent.UserId,
                Description = addEvent.Description,
                Date = addEvent.Date
            };
            
            _apiContext.Events.Add(@event);
            _apiContext.SaveChanges();
            return GetEvent(eventId);
        }
    }
}