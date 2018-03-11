using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/everything")]
    public class EverythingController : Controller
    {
        private readonly IEverythingService _everythingService;

        public EverythingController(IEverythingService everythingService)
        {
            _everythingService = everythingService;
        }

        [HttpGet]
        public async Task<Everything> GetEverything()
        {
            return await _everythingService.GetEverythingAsync(User.Identity.Name);
        }
    }
}
