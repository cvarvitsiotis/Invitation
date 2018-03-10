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
        private readonly IMessageService _messageService;

        public MessagesController(IEverythingService everythingService, IMessageService messageService)
        {
            _everythingService = everythingService;
            _messageService = messageService;

            _everythingService.CreateEverythingIfIncomplete();
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public IActionResult GetMessage(string eventId, string id)
        {
            Message message = _messageService.GetMessage(eventId, id);

            if (message == null) return NotFound();

            return Ok(message);
        }

        [HttpPost]
        public IActionResult AddMessage(string eventId, [FromBody] AddMessage addMessage)
        {
            if (addMessage == null) return BadRequest();

            Message message = _messageService.AddMessage(eventId, addMessage);

            if (message == null) return BadRequest();

            return CreatedAtRoute("GetMessage", new { id = message.Id }, message);
        }
    }
}
