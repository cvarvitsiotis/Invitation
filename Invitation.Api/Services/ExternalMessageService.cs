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
        
        public async Task SendAsync(List<PersonStatusMessage> personStatusMessages)
        {
            TwilioClient.Init(_configuration["TwilioAccountSid"], _configuration["TwilioAuthToken"]);
            
            List<Task> tasks = new List<Task>();

            personStatusMessages.ForEach(personStatusMessage =>
            {
                Task<MessageResource> task = SendInternalAsync(personStatusMessage.Person.Phone, personStatusMessage.Message);
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