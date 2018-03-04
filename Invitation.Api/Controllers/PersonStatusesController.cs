using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/events/{eventId}/[controller]")]
    [ApiController]
    public class PersonStatusesController : Controller
    {
        private readonly IEverythingService _everythingService;
        private readonly IEventService _eventService;

        public PersonStatusesController(IEverythingService everythingService, IEventService eventService)
        {
            _everythingService = everythingService;
            _eventService = eventService;

            _everythingService.CreateEverythingIfIncomplete();
        }

        [HttpGet(Name = "GetPersonStatus")]
        public IActionResult GetPersonStatus(string id)
        {
            PersonStatus personStatus = _eventService.GetPersonStatus(id);

            if (personStatus == null) return NotFound();

            return Ok(personStatus);
        }

        [HttpPost]
        public IActionResult AddPersonStatus(string eventId, [FromBody] AddPersonStatus addPersonStatus)
        {
            if (addPersonStatus == null) return BadRequest();

            PersonStatus personStatus = _eventService.AddPersonStatus(eventId, addPersonStatus);

            if (personStatus == null) return BadRequest();

            return CreatedAtRoute("GetPersonStatus", new { id = personStatus.Id }, personStatus);
        }
    }
}
