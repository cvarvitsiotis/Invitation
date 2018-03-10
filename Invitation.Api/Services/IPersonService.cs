using Invitation.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IPersonService
    {
        bool Any();
        
        Task<List<Person>> GetPeopleByUserId(string userId);

        Task<Person> GetPerson(string id);
    }
}