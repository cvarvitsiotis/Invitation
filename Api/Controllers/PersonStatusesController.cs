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

            return new Ok(personStatus);
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