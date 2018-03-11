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
    }
}