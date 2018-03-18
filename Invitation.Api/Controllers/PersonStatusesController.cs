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
        private readonly IPersonStatusService _personStatusService;

        public PersonStatusesController(IPersonStatusService personStatusService)
        {
            _personStatusService = personStatusService;
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
