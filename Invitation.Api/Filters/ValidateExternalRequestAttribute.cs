using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using Twilio.Security;

namespace Invitation.Api.Filters
{
    public class ValidateExternalRequestAttribute : TypeFilterAttribute
    {
        public ValidateExternalRequestAttribute()
            : base(typeof(ValidateExternalRequestImpl))
        {
        }

        public class ValidateExternalRequestImpl : ActionFilterAttribute
        {
            private readonly RequestValidator _requestValidator;
                
            public ValidateExternalRequestImpl(IConfiguration configuration)
            {
                var authToken = configuration["TwilioAuthToken"];
                _requestValidator = new RequestValidator(authToken);
            }
            
            public override void OnActionExecuting(ActionExecutingContext actionContext)
            {
                var context = actionContext.HttpContext;
                if (!IsValidRequest(context.Request))
                {
                    actionContext.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
                }

                base.OnActionExecuting(actionContext);
            }

            private bool IsValidRequest(HttpRequest request)
            {
                var requestUrl = RequestRawUrl(request);
                var parameters = ToDictionary(request.Query);
                var signature = request.Headers["X-Twilio-Signature"].FirstOrDefault();
                return _requestValidator.Validate(requestUrl, parameters, signature);
            }

            private static string RequestRawUrl(HttpRequest request)
            {
                return $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
            }

            private static IDictionary<string, string> ToDictionary(IQueryCollection collection)
            {
                return collection.Keys
                    .Select(key => new { Key = key, Value = collection[key] })
                    .ToDictionary(p => p.Key, p => p.Value.ToString());
            }
        }
    }
}