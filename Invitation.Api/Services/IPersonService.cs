using Invitation.Api.Models;
using System.Collections.Generic;

namespace Invitation.Api.Services
{
    public interface IPersonService
    {
        bool Any();
        
        List<Person> GetPeople();

        Person GetPerson(string id);
    }
}