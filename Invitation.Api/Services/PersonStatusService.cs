using System.Linq;
using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using Invitation.Api.Services;

namespace Invitation.Api.Services
{
    public class PersonStatusService : BaseService, IPersonStatusService
    {
        private readonly ApiContext _apiContext;
        private readonly IPersonService _personService;
        private readonly IEventService _eventService;

        public PersonStatusService(ApiContext apiContext, IPersonService personService, IEventService eventService)
        {
            _apiContext = apiContext;
            _personService = personService;
            _eventService = eventService;
        }

        public PersonStatus GetPersonStatus(string eventId, string id)
        {
            return _eventService.GetEvent(eventId).PersonStatuses?.FirstOrDefault(s => s.Id == id);
        }

        public PersonStatus AddPersonStatus(string eventId, AddPersonStatus addPersonStatus)
        {
            Person person = _personService.GetPerson(addPersonStatus.PersonId).Result;
            if (person == null) return null;

            var @event = _eventService.GetEvent(eventId);
            if (@event == null) return null;

            string personStatusId = GetNextId(@event.PersonStatuses.Select(s => s.Id));
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
    }
}