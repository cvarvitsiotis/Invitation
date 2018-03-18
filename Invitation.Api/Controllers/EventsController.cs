using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet("{id}", Name = "GetEvent")]
        public async Task<IActionResult> GetEvent(string id)
        {
            var @event = await _eventService.GetEventAsync(User.Identity.Name, id);

            if (@event == null) return NotFound();

            return Ok(@event);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] AddEvent addEvent)
        {
            if (addEvent == null) return BadRequest();

            Event @event = await _eventService.CreateEventAsync(User.Identity.Name, addEvent);

            return CreatedAtRoute("GetEvent", new { id = @event.Id }, @event);
        }
    }
}
