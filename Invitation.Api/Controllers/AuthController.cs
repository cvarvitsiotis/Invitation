using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpGet("signIn/{idToken}")]
        public async Task<IActionResult> SignIn(string idToken)
        {
            ExternalClaimsIdentity externalClaimsIdentity = await _authService.AuthenticateAsync(idToken);
            
            if (externalClaimsIdentity?.Sub == null) return BadRequest();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, externalClaimsIdentity?.Sub)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties());

            return Ok(new { UserIsAuthenticated = true, UserPicture = externalClaimsIdentity.Picture });
        }

        [HttpGet("signOut")]
        public async Task<IActionResult> SignOut()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok();
        }
    }
}