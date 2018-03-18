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

        public async Task<Everything> GetEverythingAsync(string userId)
        {
            return new Everything
            {
                Events = await _eventService.GetEventsAsync(userId),
                People = await _personService.GetPeopleAsync(userId)
            };
        }

        public async Task CreateEverythingIfIncompleteAsync()
        {
            if (await _eventService.AnyAsync() && await _personService.AnyAsync())
            {
                return;
            }

            _apiContext.Events.RemoveRange(_apiContext.Events);
            _apiContext.People.RemoveRange(_apiContext.People);

            await _apiContext.People.AddRangeAsync(new TestData().GetPeople());
            await _apiContext.Events.AddRangeAsync(new TestData().GetEvents());
            
            await _apiContext.SaveChangesAsync();
        }
    }
}