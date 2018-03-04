using Invitation.Api.Models;
using System.Collections.Generic;

namespace Invitation.Api.Services
{
    public interface IEventService
    {
        bool Any();
        
        List<Event> GetEvents();

        Event GetEvent(string id);

        Message GetMessage(string id);

        PersonStatus GetPersonStatus(string id);

        Event CreateEvent(AddEvent addEvent);

        Message AddMessage(string eventId, AddMessage addMessage);

        PersonStatus AddPersonStatus(string eventId, AddPersonStatus addPersonStatus);
    }
}