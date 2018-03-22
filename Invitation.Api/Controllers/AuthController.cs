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
        private readonly IGoogleApiAccessTokenService _googleApiAccessTokenService;

        public AuthController(IExternalAuthService externalAuthService, IExternalPersonService externalPersonService, IPersonService personService, IAntiforgery antiforgery, IGoogleApiAccessTokenService googleApiAccessTokenService)
        {
            _externalAuthService = externalAuthService;
            _externalPersonService = externalPersonService;
            _personService = personService;
            _antiforgery = antiforgery;
            _googleApiAccessTokenService = googleApiAccessTokenService;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet("signIn/{idToken}")]
        public async Task<IActionResult> SignIn(string idToken)
        {
            ExternalClaimsIdentity externalClaimsIdentity = await _externalAuthService.GetExternalClaimsIdentityAsync(WebUtility.UrlDecode(idToken));
            
            if (externalClaimsIdentity?.Sub == null) return BadRequest();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, externalClaimsIdentity.Sub)
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            
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

        [HttpGet("wasPreviouslyAuthorized")]
        public async Task<IActionResult> WasPreviouslyAuthorized()
        {
            string accessToken = (await _googleApiAccessTokenService.GetAccessTokenAsync(User.Identity.Name))?.AccessToken;
            
            bool wasPreviouslyAuthorized = !string.IsNullOrEmpty(accessToken);
            
            return Ok(wasPreviouslyAuthorized);
        }

        [HttpGet("exchangeAuthCodeForAccessToken/{authCode}")]
        public async Task<IActionResult> ExchangeAuthCodeForAccessToken(string authCode)
        {
            string accessToken = await _externalAuthService.ExchangeAuthCodeForAccessTokenAsync(WebUtility.UrlDecode(authCode));
            
            if (string.IsNullOrEmpty(accessToken)) return Ok(false);
            
            await _googleApiAccessTokenService.SaveAccessTokenAsync(User.Identity.Name, accessToken);
            
            return Ok(true);
        }

        [HttpGet("refreshPeople")]
        public async Task<IActionResult> RefreshPeople()
        {
            string accessToken = (await _googleApiAccessTokenService.GetAccessTokenAsync(User.Identity.Name))?.AccessToken;
            if (string.IsNullOrEmpty(accessToken)) return BadRequest();
        
            List<Person> people = await _externalPersonService.GetPeopleAsync(accessToken);

            if ((people?.Any()).GetValueOrDefault())
            {
                await _personService.UpsertPeopleAsync(User.Identity.Name, people);
            }
          
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