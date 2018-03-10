using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/events/{eventId}/personStatuses")]
    [ApiController]
    public class PersonStatusesController : Controller
    {
        private readonly IEverythingService _everythingService;
        private readonly IPersonStatusService _personStatusService;

        public PersonStatusesController(IEverythingService everythingService, IPersonStatusService personStatusService)
        {
            _everythingService = everythingService;
            _personStatusService = personStatusService;

            _everythingService.CreateEverythingIfIncomplete();
        }

        [HttpGet("{id}", Name = "GetPersonStatus")]
        public IActionResult GetPersonStatus(string eventId, string id)
        {
            PersonStatus personStatus = _personStatusService.GetPersonStatus(eventId, id);

            if (personStatus == null) return NotFound();

            return Ok(personStatus);
        }

        [HttpPost]
        public IActionResult AddPersonStatus(string eventId, [FromBody] AddPersonStatus addPersonStatus)
        {
            if (addPersonStatus == null) return BadRequest();

            PersonStatus personStatus = _personStatusService.AddPersonStatus(eventId, addPersonStatus);

            if (personStatus == null) return BadRequest();

            return CreatedAtRoute("GetPersonStatus", new { id = personStatus.Id }, personStatus);
        }
    }
}
