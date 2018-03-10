using System.Linq;
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

        public Message AddMessage(string eventId, AddMessage addMessage)
        {
            var @event = _eventService.GetEvent(eventId);
            if (@event == null) return null;

            string messageId = GetNextId(@event.Messages.Select(m => m.Id));
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

        public Message GetMessage(string eventId, string id)
        {
            return _eventService.GetEvent(eventId).Messages?.FirstOrDefault(m => m.Id == id);
        }
    }
}