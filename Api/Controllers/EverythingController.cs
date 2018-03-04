using Invitation.Models;
using Invitation.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EverythingController : Controller
    {
        private readonly IEverythingService _everythingService;
        
        public EverythingController(IEverythingService everythingService)
        {
            _everythingService = everythingService;
        }

        [HttpGet]
        public Everything GetEverything()
        {
            return _everythingService.GetEverything();
        }
    }
}