using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : Controller
    {
        private readonly IEverythingService _everythingService;
        private readonly IEventService _eventService;

        public EventsController(IEverythingService everythingService, IEventService eventService)
        {
            _everythingService = everythingService;
            _eventService = eventService;

            _everythingService.CreateEverythingIfIncomplete();
        }

        [HttpGet(Name = "GetEvent")]
        public IActionResult GetEvent(string id)
        {
            var @event = _eventService.GetEvent(id);

            if (@event == null) return NotFound();

            return Ok(@event);
        }

        [HttpPost]
        public IActionResult CreateEvent([FromBody] AddEvent addEvent)
        {
            if (addEvent == null) return BadRequest();

            Event @event = _eventService.CreateEvent(addEvent);

            return CreatedAtRoute("GetEvent", new { id = @event.Id }, @event);
        }
    }
}
