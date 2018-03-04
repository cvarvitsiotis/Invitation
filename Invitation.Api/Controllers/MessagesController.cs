using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/events/{eventId}/messages")]
    [ApiController]
    public class MessagesController : Controller
    {
        private readonly IEverythingService _everythingService;
        private readonly IEventService _eventService;

        public MessagesController(IEverythingService everythingService, IEventService eventService)
        {
            _everythingService = everythingService;
            _eventService = eventService;

            _everythingService.CreateEverythingIfIncomplete();
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public IActionResult GetMessage(string id)
        {
            Message message = _eventService.GetMessage(id);

            if (message == null) return NotFound();

            return Ok(message);
        }

        [HttpPost]
        public IActionResult AddMessage(string eventId, [FromBody] AddMessage addMessage)
        {
            if (addMessage == null) return BadRequest();

            Message message = _eventService.AddMessage(eventId, addMessage);

            if (message == null) return BadRequest();

            return CreatedAtRoute("GetMessage", new { id = message.Id }, message);
        }
    }
}
