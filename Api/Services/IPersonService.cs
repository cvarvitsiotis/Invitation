using System.Collections.Generic;
using Invitation.Models;

namespace Invitation.Services
{
    public interface IPersonService
    {
        bool Any();
        
        List<Person> GetPeople();

        Person GetPerson(string id);
    }
}