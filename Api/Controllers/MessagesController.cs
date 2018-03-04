using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Invitation.Models;
using System.Linq;
using Invitation.DataAccess;
using Invitation.Services;

namespace Invitation.Controllers
{
    [Route("api/events/{eventId}/[controller]")]
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
        
        [HttpGet(Name = "GetMessage")]
        public IActionResult GetMessage(string id)
        {
            Message message = _eventService.GetMessage(id);
            
            if (message == null) return NotFound();

            return new Ok(message);
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