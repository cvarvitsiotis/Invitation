using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<PersonStatus> GetPersonStatusAsync(string userId, string eventId, string id)
        {
            return (await _eventService.GetEventAsync(userId, eventId))?.PersonStatuses?.FirstOrDefault(s => s.Id == id);
        }

        public async Task<List<PersonStatusMessage>> GetPeopleToSendMessageToAsync(string userId, string eventId)
        {
            IEnumerable<PersonStatus> personStatuses = (await _eventService.GetEventAsync(userId, eventId))?.PersonStatuses?.Where(s => s.Status != Status.No);
            
            List<Task<PersonStatusMessage>> personStatusMessagesTasks = personStatuses.Select(async personStatus =>
                new PersonStatusMessage
                {
                    PersonStatus = personStatus,
                    Person = await _personService.GetPersonAsync(userId, personStatus.PersonId)
                }
            ).ToList();

            return (await Task.WhenAll(personStatusMessagesTasks)).ToList();
        }

        public async Task<PersonStatus> AddPersonStatusAsync(string userId, string eventId, AddPersonStatus addPersonStatus)
        {
            Person person = await _personService.GetPersonAsync(userId, addPersonStatus.PersonId);
            if (person == null) return null;

            var @event = await _eventService.GetEventAsync(userId, eventId);
            if (@event == null) return null;

            string personStatusId = GetNextId((await _eventService.GetEveryonesEventsAsync()).SelectMany(e => e.PersonStatuses).Select(s => s.Id));
            PersonStatus personStatus = new PersonStatus
            {
                Id = personStatusId,
                PersonId = addPersonStatus.PersonId,
                Status = addPersonStatus.Status
            };

            @event.PersonStatuses.Add(personStatus);
            await _apiContext.SaveChangesAsync();
            return personStatus;
        }

        public async Task UpdatePersonStatusToNoResponseAsync(string userId, string eventId)
        {
            (await _eventService.GetEventAsync(userId, eventId))?.PersonStatuses?.ToList().ForEach(personStatus =>
            {
                if (personStatus.Status == Status.NotPrompted) personStatus.Status = Status.NoResponse;
            });

            await _apiContext.SaveChangesAsync();
        }

        public async Task UpdatePersonStatusFromMessageResponseAsync(string personStatusId, string statusAbbreviation, string phone)
        {
            PersonStatus personStatus = (await _eventService.GetEveryonesEventsAsync()).SelectMany(e => e.PersonStatuses).FirstOrDefault(s => s.Id == personStatusId);
            
            Person person = await _personService.GetPersonAsync(personStatus.PersonId);

            if (person.Phone != phone) return;

            personStatus.Status = Status.GetStatusFromAbbreviation(statusAbbreviation);
            
            await _apiContext.SaveChangesAsync();
        }
    }
}