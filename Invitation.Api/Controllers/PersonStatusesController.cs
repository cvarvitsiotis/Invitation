using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/personStatuses")]
    public class PersonStatusesController : Controller
    {
        private readonly IEverythingService _everythingService;
        private readonly IPersonStatusService _personStatusService;

        public PersonStatusesController(IEverythingService everythingService, IPersonStatusService personStatusService)
        {
            _everythingService = everythingService;
            _personStatusService = personStatusService;

            _everythingService.CreateEverythingIfIncompleteAsync();
        }

        [HttpGet("{id}", Name = "GetPersonStatus")]
        public async Task<IActionResult> GetPersonStatus(string eventId, string id)
        {
            PersonStatus personStatus = await _personStatusService.GetPersonStatusAsync(User.Identity.Name, eventId, id);

            if (personStatus == null) return NotFound();

            return Ok(personStatus);
        }

        [HttpPost]
        public async Task<IActionResult> AddPersonStatus(string eventId, [FromBody] AddPersonStatus addPersonStatus)
        {
            if (addPersonStatus == null) return BadRequest();

            PersonStatus personStatus = await _personStatusService.AddPersonStatusAsync(User.Identity.Name, eventId, addPersonStatus);

            if (personStatus == null) return BadRequest();

            return CreatedAtRoute("GetPersonStatus", new { id = personStatus.Id }, personStatus);
        }
    }
}
