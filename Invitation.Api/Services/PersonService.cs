using Invitation.Api.DataAccess;
using Invitation.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class PersonService : IPersonService
    {
        private readonly ApiContext _apiContext;

        public PersonService(ApiContext apiContext)
        {
            _apiContext = apiContext;
        }

        public async Task<bool> AnyAsync()
        {
            return await _apiContext.People.AnyAsync();
        }

        public async Task<List<Person>> GetPeopleAsync(string userId)
        {
            return await _apiContext.People.Where(p => p.UserId == userId).ToListAsync();
        }

        public async Task<Person> GetPersonAsync(string userId, string id)
        {
            return (await GetPeopleAsync(userId))?.FirstOrDefault(p => p.Id == id);
        }

        public async Task<List<Person>> GetPeopleAsync(string userId, List<string> ids)
        {
            return (await GetPeopleAsync(userId))?.Where(p => ids.Contains(p.Id)).ToList();
        }

        public async Task UpsertPeopleAsync(string userId, List<Person> newPeople)
        {
            IEnumerable<Person> dedupedNewPeople = newPeople.GroupBy(
                np => CreatePersonId(np.ExternalId, np.Phone), 
                (key, value) => value.FirstOrDefault()
            );

            List<Person> oldPeople = await GetPeopleAsync(userId);
            
            foreach (Person newPerson in dedupedNewPeople)
            {
                Person oldPerson = oldPeople.FirstOrDefault(op => op.Id == CreatePersonId(newPerson.ExternalId, newPerson.Phone));
                if (oldPerson != null)
                {
                    if (oldPerson.FirstName != newPerson.FirstName) oldPerson.FirstName = newPerson.FirstName;
                    if (oldPerson.LastName != newPerson.LastName) oldPerson.LastName = newPerson.LastName;
                    if (oldPerson.PhoneType != newPerson.PhoneType) oldPerson.PhoneType = newPerson.PhoneType;
                    if (oldPerson.Phone != newPerson.Phone) oldPerson.Phone = newPerson.Phone;
                }
                else
                {
                    newPerson.Id = CreatePersonId(newPerson.ExternalId, newPerson.Phone);
                    newPerson.UserId = userId;
                    await _apiContext.People.AddAsync(newPerson);
                }
            }

            await _apiContext.SaveChangesAsync();
        }

        private string CreatePersonId(string externalId, string phone)
        {
            return $"{externalId}_{phone}";
        }
    }
}