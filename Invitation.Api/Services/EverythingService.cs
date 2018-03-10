using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class EverythingService : IEverythingService
    {
        private readonly ApiContext _apiContext;
        private readonly IEventService _eventService;
        private readonly IPersonService _personService;

        public EverythingService(ApiContext apiContext, IEventService eventService, IPersonService personService)
        {
            _apiContext = apiContext;
            _eventService = eventService;
            _personService = personService;
        }

        public async Task<Everything> GetEverything(string userId)
        {
            CreateEverythingIfIncomplete();

            return new Everything
            {
                Events = await _eventService.GetEventsByUserId(userId),
                People = await _personService.GetPeopleByUserId(userId)
            };
        }

        public void CreateEverythingIfIncomplete()
        {
            if (_eventService.Any() && _personService.Any())
            {
                return;
            }

            _apiContext.Events.RemoveRange(_apiContext.Events);
            _apiContext.People.RemoveRange(_apiContext.People);

            _apiContext.People.AddRange(new TestData().GetPeople());
            _apiContext.Events.AddRange(new TestData().GetEvents());
            
            _apiContext.SaveChanges();
        }
    }
}