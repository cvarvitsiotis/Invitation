using Invitation.Api.DataAccess;
using Invitation.Api.Models;

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

        public Everything GetEverything()
        {
            CreateEverythingIfIncomplete();

            return new Everything
            {
                Events = _eventService.GetEvents(),
                People = _personService.GetPeople()
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