using System.Collections.Generic;
using System.Threading.Tasks;
using Invitation.Api.Models;

namespace Invitation.Api.Services
{
    public interface IExternalMessageService
    {
        Task SendAsync(List<Person> people, string message);
    }
}