using Invitation.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Invitation.Api.Services
{
    public class ExternalPersonService : IExternalPersonService
    {
        private const string clientId = "488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com";
        IHttpClientFactory _httpClientFactory;

        public ExternalPersonService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<List<Person>> GetPeopleAsync(string accessToken)
        {
            try
            {
                HttpClient client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                string response = await client.GetStringAsync("https://people.googleapis.com/v1/people/me/connections?pageSize=1000&personFields=names,phoneNumbers");
                List<ExternalConnection> connections = JsonConvert.DeserializeObject<List<ExternalConnection>>(response);
                return GetPeopleFromConnections(connections);
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private List<Person> GetPeopleFromConnections(List<ExternalConnection> connections)
        {
            List<Person> people = new List<Person>();

            foreach (ExternalConnection connection in connections)
            {
                string connectionId = connection.ResourceName?.Substring(7);
                if (string.IsNullOrEmpty(connectionId)) continue;

                var names = connection.Names?.Where(n => !string.IsNullOrEmpty(n?.GivenName) || string.IsNullOrEmpty(n?.FamilyName));
                if (!names.Any()) continue;
                ExternalConnectionName primaryName = names.FirstOrDefault(n => (n.Metadata?.Primary).GetValueOrDefault());
                ExternalConnectionName nameToUse = primaryName != null ? primaryName : names.First();

                var phoneNumbers = connection.PhoneNumbers?.Where(p => !string.IsNullOrEmpty(p.CanonicalForm));
                if (!phoneNumbers.Any()) continue;

                foreach (ExternalConnectionPhoneNumber phoneNumber in phoneNumbers)
                {
                    Person person = new Person
                    {
                        ExternalId = connectionId,
                        FirstName = nameToUse.GivenName,
                        LastName = nameToUse.FamilyName,
                        Phone = phoneNumber.CanonicalForm
                    };
                    people.Add(person);
                }
            }
            
            return people;
        }
    }
}