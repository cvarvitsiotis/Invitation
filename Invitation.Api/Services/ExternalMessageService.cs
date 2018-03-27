using System.Collections.Generic;
using System.Threading.Tasks;
using Invitation.Api.Models;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Invitation.Api.Services
{
    public class ExternalMessageService : IExternalMessageService
    {
        private readonly IConfiguration _configuration;
        
        public ExternalMessageService(IConfiguration configuration)
        {
            _configuration = configuration;            
        }
        
        public async Task SendAsync(List<Person> people, string message)
        {
            TwilioClient.Init(_configuration["TwilioAccountSid"], _configuration["TwilioAuthToken"]);
            
            List<Task> tasks = new List<Task>();

            people.ForEach(p =>
            {
                Task<MessageResource> task = SendInternalAsync(p.Phone, message);
                tasks.Add(task);
            });

            await Task.WhenAll(tasks);
        }

        private Task<MessageResource> SendInternalAsync(string phone, string message)
        {
            return MessageResource.CreateAsync(
                to: new PhoneNumber(phone),
                from: new PhoneNumber(_configuration["TwilioPhoneNumber"]),
                body: message);
        }
    }
}