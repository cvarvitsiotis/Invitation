using System.Linq;
using System.Threading.Tasks;
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

        public async Task<PersonStatus> GetPersonStatusAsync(string userId, string eventId, string id)
        {
            return (await _eventService.GetEventAsync(userId, eventId))?.PersonStatuses?.FirstOrDefault(s => s.Id == id);
        }

        public async Task<PersonStatus> AddPersonStatusAsync(string userId, string eventId, AddPersonStatus addPersonStatus)
        {
            Person person = await _personService.GetPersonAsync(userId, addPersonStatus.PersonId);
            if (person == null) return null;

            var @event = await _eventService.GetEventAsync(userId, eventId);
            if (@event == null) return null;

            string personStatusId = GetNextId(@event.PersonStatuses.Select(s => s.Id));
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
    }
}