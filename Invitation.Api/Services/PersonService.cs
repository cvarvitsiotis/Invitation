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

        public bool Any()
        {
            return _apiContext.People.Any();
        }

        public async Task<List<Person>> GetPeopleByUserId(string userId)
        {
            return await _apiContext.People.Where(p => p.UserId == userId).ToListAsync();
        }

        public async Task<Person> GetPerson(string id)
        {
            return (await GetPeopleByUserId(null)).FirstOrDefault(p => p.Id == id);
        }
    }
}