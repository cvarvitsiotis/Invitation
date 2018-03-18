using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/messages")]
    public class MessagesController : Controller
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(string eventId, string id)
        {
            Message message = await _messageService.GetMessageAsync(User.Identity.Name, eventId, id);

            if (message == null) return NotFound();

            return Ok(message);
        }

        [HttpPost]
        public async Task<IActionResult> AddMessage(string eventId, [FromBody] AddMessage addMessage)
        {
            if (addMessage == null) return BadRequest();

            Message message = await _messageService.AddMessageAsync(User.Identity.Name, eventId, addMessage);

            if (message == null) return BadRequest();

            return CreatedAtRoute("GetMessage", new { id = message.Id }, message);
        }
    }
}
