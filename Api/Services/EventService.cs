using System.Collections.Generic;
using System.Linq;
using Invitation.DataAccess;
using Invitation.Models;
using Microsoft.EntityFrameworkCore;

namespace Invitation.Services
{
    public class EventService : IEventService
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

        public List<Event> GetEvents()
        {
            return _apiContext.Events.Include(e => e.Messages).Include(e => e.PersonStatuses).ToList();
        }

        public Event GetEvent(string id)
        {
            return GetEvents().FirstOrDefault(t => t.Id == id);
        }

        public Message GetMessage(string id)
        {
            return GetEvents().SelectMany(e => e.Messages).FirstOrDefault(m => m.Id == id);
        }

        public PersonStatus GetPersonStatus(string id)
        {
            return GetEvents().SelectMany(e => e.PersonStatuses).FirstOrDefault(s => s.Id == id);
        }

        public Event CreateEvent(AddEvent addEvent)
        {
            string eventId = GetNextId(_apiContext.Events.Select(e => e.Id));
            Event @event = new Event
            {
                Id = eventId,
                Description = addEvent.Description,
                Date = addEvent.Date
            };
            
            _apiContext.Events.Add(@event);
            _apiContext.SaveChanges();
            return GetEvent(eventId);
        }

        public Message AddMessage(string eventId, AddMessage addMessage)
        {
            var @event = GetEvent(eventId);
            if (@event == null) return null;

            string messageId = GetNextId(GetEvents().SelectMany(e => e.Messages).Select(m => m.Id));
            Message message = new Message
            {
                Id = messageId,
                Content = addMessage.Content,
                Date = addMessage.Date
            };

            @event.Messages.Add(message);
            _apiContext.SaveChanges();
            return message;
        }

        public PersonStatus AddPersonStatus(string eventId, AddPersonStatus addPersonStatus)
        {
            Person person = _personService.GetPerson(addPersonStatus.PersonId);
            if (person == null) return null;

            var @event = GetEvent(eventId);
            if (@event == null) return null;

            string personStatusId = GetNextId(GetEvents().SelectMany(e => e.PersonStatuses).Select(s => s.Id));
            PersonStatus personStatus = new PersonStatus
            {
                Id = personStatusId,
                PersonId = addPersonStatus.PersonId,
                Status = addPersonStatus.Status
            };

            @event.PersonStatuses.Add(personStatus);
            _apiContext.SaveChanges();
            return personStatus;
        }

        private string GetNextId(IEnumerable<string> ids)
        {
            return (ids.Max(i => int.Parse(i)) + 1).ToString();
        }
    }
}