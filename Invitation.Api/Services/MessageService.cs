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

            await _personStatusService.UpdatePersonStatusToNoResponseAsync(userId, eventId);

            return message;
        }

        public async Task<Message> GetMessageAsync(string userId, string eventId, string id)
        {
            return (await _eventService.GetEventAsync(userId, eventId))?.Messages?.FirstOrDefault(m => m.Id == id);
        }

        private async Task SendExternalMessageAsync(string userId, string eventId, string message)
        {
            try
            {
                List<PersonStatusMessage> personStatusMessages = await _personStatusService.GetPeopleToSendMessageToAsync(userId, eventId);
                bool isFirstMessage = (await _eventService.GetEventAsync(userId, eventId)).Messages.Count() == 1;
                personStatusMessages.ForEach(personStatusMessage => personStatusMessage.Message = GetMessagePossiblyWithRsvpInstruction(message, personStatusMessage.PersonStatus.Id, isFirstMessage));
                await _externalMessageService.SendAsync(personStatusMessages);
            }
            catch (Exception)
            {
            }
        }

        private string GetMessagePossiblyWithRsvpInstruction(string message, string personStatusId, bool isFirstMessage)
        {
            message = message?.Trim();

            if (isFirstMessage)
            {
                if (!(new char[] { '.', '!', '?' }).Contains(message.Last())) message += '.';
                return $"{message} Reply to RSVP: {Status.GetAbbreviationFromStatus(Status.Yes)}{personStatusId} for Yes, {Status.GetAbbreviationFromStatus(Status.No)}{personStatusId} for No, {Status.GetAbbreviationFromStatus(Status.Maybe)}{personStatusId} for Maybe.";
            }

            return message;
        }
    }
}