using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Twilio.TwiML;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/externalMessages")]
    public class ExternalMessagescontroller : Controller
    {
        private readonly IPersonStatusService _personStatusService;

        public ExternalMessagescontroller(IPersonStatusService personStatusService)
        {
            _personStatusService = personStatusService;
        }

        [HttpPost]
        public async Task<IActionResult> Index(string phone, string status)
        {
            await _personStatusService.UpdatePersonStatusAsync(phone, status);
            
            return Ok();
        }
    }
}