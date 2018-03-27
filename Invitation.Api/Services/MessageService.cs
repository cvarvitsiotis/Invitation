using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class MessageService : BaseService, IMessageService
    {
        private readonly ApiContext _apiContext;
        private readonly IEventService _eventService;
        private readonly IPersonStatusService _personStatusService;
        private readonly IExternalMessageService _externalMessageService;

        public MessageService(ApiContext apiContext, IEventService eventService, IPersonStatusService personStatusService, IExternalMessageService externalMessageService)
        {
            _apiContext = apiContext;
            _eventService = eventService;
            _personStatusService = personStatusService;
            _externalMessageService = externalMessageService;
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

            //ConfigureAwait(false) prevents code from continuing on this context after task completes.
            //We want to set (actually, send) and forget.
            await SendExternalMessageAsync(userId, eventId, addMessage.Content).ConfigureAwait(false);

            return message;
        }

        private async Task SendExternalMessageAsync(string userId, string eventId, string message)
        {
            try
            {
                List<Person> people = await _personStatusService.GetPeopleToSendMessageToAsync(userId, eventId);
                await _externalMessageService.SendAsync(people, message);
            }
            catch (Exception)
            {
            }
        }

        public async Task<Message> GetMessageAsync(string userId, string eventId, string id)
        {
            return (await _eventService.GetEventAsync(userId, eventId))?.Messages?.FirstOrDefault(m => m.Id == id);
        }
    }
}