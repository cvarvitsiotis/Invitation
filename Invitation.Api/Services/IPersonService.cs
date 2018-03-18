using Invitation.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public interface IPersonService
    {
        Task<bool> AnyAsync();
        
        Task<List<Person>> GetPeopleAsync(string userId);

        Task<Person> GetPersonAsync(string userId, string id);

        Task UpsertPeopleAsync(string userId, List<Person> newPeople);
    }
}