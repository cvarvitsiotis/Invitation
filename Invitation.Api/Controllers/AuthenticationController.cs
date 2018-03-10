using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpGet("{idToken}")]
        public async Task<IActionResult> Authenticate(string idToken)
        {
            ExternalClaim claim = await _authenticationService.Authenticate(idToken);
            
            if (claim?.Sub == null) return BadRequest();

            return Ok(claim);
        }
    }
}