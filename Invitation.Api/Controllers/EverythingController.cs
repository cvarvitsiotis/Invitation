using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Invitation.Api.Controllers
{
    [Route("api/everything")]
    [ApiController]
    public class EverythingController : Controller
    {
        private readonly IEverythingService _everythingService;

        public EverythingController(IEverythingService everythingService)
        {
            _everythingService = everythingService;
        }

        [HttpGet("{userId}")]
        public async Task<Everything> GetEverything(string userId)
        {
            return await _everythingService.GetEverything(userId);
        }
    }
}
