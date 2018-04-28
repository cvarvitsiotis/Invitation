using Invitation.Api.Filters;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;
using Twilio.TwiML;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/externalMessages")]
    [ValidateExternalRequest]
    public class ExternalMessagescontroller : Controller
    {
        private readonly IPersonStatusService _personStatusService;

        public ExternalMessagescontroller(IPersonStatusService personStatusService)
        {
            _personStatusService = personStatusService;
        }

        [HttpGet]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Index(string from, string body)
        {
            string statusAbbreviation = body.Substring(0, 1);
            string personStatusId = body.Substring(1);
            await _personStatusService.UpdatePersonStatusFromMessageResponseAsync(personStatusId, statusAbbreviation, from);
            
            return Content(new MessagingResponse().ToString(), MediaTypeNames.Text.Xml);
        }
    }
}