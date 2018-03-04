using System.Collections.Generic;
using System.Linq;
using Invitation.DataAccess;
using Invitation.Models;
using Microsoft.EntityFrameworkCore;

namespace Invitation.Services
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

        public List<Person> GetPeople()
        {
            return _apiContext.People.ToList();
        }

        public Person GetPerson(string id)
        {
            return GetPeople().FirstOrDefault(p => p.Id == id);
        }
    }
}