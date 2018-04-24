using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        private readonly IExternalPersonService _externalPersonService;
        private readonly IPersonService _personService;
        private readonly IAntiforgery _antiforgery;

        public AuthController(IExternalAuthService externalAuthService, IExternalPersonService externalPersonService, IPersonService personService, IAntiforgery antiforgery)
        {
            _externalAuthService = externalAuthService;
            _externalPersonService = externalPersonService;
            _personService = personService;
            _antiforgery = antiforgery;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet("signIn/{accessToken}")]
        public async Task<IActionResult> SignIn(string accessToken)
        {
            ExternalClaimsIdentity externalClaimsIdentity = await _externalAuthService.GetExternalClaimsIdentityAsync(WebUtility.UrlDecode(accessToken));
            
            if (externalClaimsIdentity?.Sub == null) return BadRequest();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, externalClaimsIdentity.Sub)
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            
            List<Person> people = await _externalPersonService.GetPeopleAsync(accessToken);

            if ((people?.Any()).GetValueOrDefault())
            {
                await _personService.UpsertPeopleAsync(externalClaimsIdentity.Sub, people);
            }

            return Ok();
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("getAntiForgeryTokens")]
        public IActionResult GetAntiForgeryTokens()
        {
            var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

            return Ok(tokens.RequestToken);
        }

        [HttpGet("signOut")]
        public async Task<IActionResult> SignOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok();
        }
    }
}