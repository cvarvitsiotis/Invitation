using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Invitation.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IExternalAuthService _externalAuthService;
        private readonly IAntiforgery _antiforgery;

        public AuthController(IExternalAuthService externalAuthService, IAntiforgery antiforgery)
        {
            _externalAuthService = externalAuthService;
            _antiforgery = antiforgery;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet("signIn/{idToken}")]
        public async Task<IActionResult> SignIn(string idToken)
        {
            ExternalClaimsIdentity externalClaimsIdentity = await _externalAuthService.AuthenticateAsync(idToken);
            
            if (externalClaimsIdentity?.Sub == null) return BadRequest();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, externalClaimsIdentity?.Sub)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                new ClaimsPrincipal(claimsIdentity));

            return Ok(new { UserIsAuthenticated = true, UserPicture = externalClaimsIdentity.Picture });
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("getAntiForgeryTokens")]
        public IActionResult GetAntiForgeryTokens()
        {
            var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
            
            //Cookie name must match axios's xsrfCookieName
            HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false });

            return Ok();
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