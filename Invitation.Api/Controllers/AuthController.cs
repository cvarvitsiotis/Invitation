using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

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
        
        private const string SingleUseAntiForgeryToken = "SingleUseAntiForgeryToken";

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

            string singleUseAntiForgeryToken = GetAndSaveSingleUseAntiForgeryToken();

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

            return Ok(singleUseAntiForgeryToken);
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("getAntiForgeryTokens/{singleUseAntiForgeryToken}")]
        public IActionResult GetAntiForgeryTokens(string singleUseAntiForgeryToken)
        {
            if (!CanAuthenticateAndDeleteSingleUseAntiForgeryToken(singleUseAntiForgeryToken)) return BadRequest();

            var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

            return Ok(tokens.RequestToken);
        }

        [HttpGet("signOut")]
        public async Task<IActionResult> SignOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok();
        }

        private string GetAndSaveSingleUseAntiForgeryToken()
        {
            using (var generator = RandomNumberGenerator.Create())
            {
                byte[] tokenData = new byte[32];
                generator.GetBytes(tokenData);
                string token = WebEncoders.Base64UrlEncode(tokenData);
                HttpContext.Session.SetString(SingleUseAntiForgeryToken, token);
                return token;
            }
        }

        private bool CanAuthenticateAndDeleteSingleUseAntiForgeryToken(string singleUseAntiForgeryToken)
        {
            if (string.Equals(HttpContext.Session.GetString(SingleUseAntiForgeryToken), WebUtility.UrlDecode(singleUseAntiForgeryToken), StringComparison.InvariantCultureIgnoreCase))
            {
                HttpContext.Session.Remove(SingleUseAntiForgeryToken);
                return true;
            }

            return false;
        }
    }
}