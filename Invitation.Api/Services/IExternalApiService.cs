using System.Collections.Generic;
using System.Threading.Tasks;
using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IExternalApiService
    {
        Task<List<Person>> GetPeopleAsync(string accessToken);
    }
}