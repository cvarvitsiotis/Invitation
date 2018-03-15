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

        public async Task<bool> Any()
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

        public async Task UpsertPeopleAsync(string userId, List<Person> newPeople)
        {
            var dedupedNewPeople = newPeople.GroupBy(
                np => CreatePersonId(np.ExternalId, np.Phone), 
                (key, value) => value.FirstOrDefault()
            );

            List<Person> oldPeople = await GetPeopleAsync(userId);

            foreach (Person newPerson in dedupedNewPeople)
            {
                Person oldPerson = oldPeople.FirstOrDefault(op => op.Id == CreatePersonId(newPerson.ExternalId, newPerson.Phone));
                if (oldPerson != null)
                {
                    oldPerson.FirstName = newPerson.FirstName;
                    oldPerson.LastName = newPerson.LastName;
                    oldPerson.Phone = newPerson.Phone;
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