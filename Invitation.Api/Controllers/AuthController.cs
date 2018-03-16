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
        private readonly IExternalApiService _externalApiService;
        private readonly IPersonService _personService;
        private readonly IAntiforgery _antiforgery;

        public AuthController(IExternalAuthService externalAuthService, IExternalApiService externalApiService, IPersonService personService, IAntiforgery antiforgery)
        {
            _externalAuthService = externalAuthService;
            _externalApiService = externalApiService;
            _personService = personService;
            _antiforgery = antiforgery;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet("signIn/{authCode}")]
        public async Task<IActionResult> SignIn(string authCode)
        {
            ExternalAccessTokenAndClaimsIdentity accessTokenAndClaimsIdentity = await _externalAuthService.GetAccessTokenAndClaimsIdentity(WebUtility.UrlDecode(authCode));

            if (accessTokenAndClaimsIdentity?.ExternalClaimsIdentity?.Sub == null) return BadRequest();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, accessTokenAndClaimsIdentity.ExternalClaimsIdentity.Sub)
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            if (!string.IsNullOrEmpty(accessTokenAndClaimsIdentity.AccessToken))
            {
                List<Person> people = await _externalApiService.GetPeopleAsync(accessTokenAndClaimsIdentity.AccessToken);

                if ((people?.Any()).GetValueOrDefault())
                {
                    await _personService.UpsertPeopleAsync(accessTokenAndClaimsIdentity.ExternalClaimsIdentity.Sub, people);
                }
            }

            return Ok(new { UserIsAuthenticated = true, UserPicture = accessTokenAndClaimsIdentity.ExternalClaimsIdentity.Picture });
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
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok();
        }
    }
}