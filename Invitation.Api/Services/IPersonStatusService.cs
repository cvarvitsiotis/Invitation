using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IPersonStatusService
    {
        PersonStatus GetPersonStatus(string eventId, string id);

        PersonStatus AddPersonStatus(string eventId, AddPersonStatus addPersonStatus);
    }
}