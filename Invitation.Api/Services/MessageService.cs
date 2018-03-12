using System.Linq;
using System.Threading.Tasks;
using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using Invitation.Api.Services;

namespace Invitation.Api.Services
{
    public class MessageService : BaseService, IMessageService
    {
        private readonly ApiContext _apiContext;
        private readonly IEventService _eventService;
        
        public MessageService(ApiContext apiContext, IEventService eventService)
        {
            _apiContext = apiContext;
            _eventService = eventService;
        }

        public async Task<Message> AddMessageAsync(string userId, string eventId, AddMessage addMessage)
        {
            var @event = await _eventService.GetEventAsync(userId, eventId);
            if (@event == null) return null;

            string messageId = GetNextId((await _eventService.GetEveryonesEventsAsync()).SelectMany(e => e.Messages).Select(m => m.Id));
            Message message = new Message
            {
                Id = messageId,
                Content = addMessage.Content,
                Date = addMessage.Date
            };

            @event.Messages.Add(message);
            await _apiContext.SaveChangesAsync();
            return message;
        }

        public async Task<Message> GetMessageAsync(string userId, string eventId, string id)
        {
            return (await _eventService.GetEventAsync(userId, eventId))?.Messages?.FirstOrDefault(m => m.Id == id);
        }
    }
}