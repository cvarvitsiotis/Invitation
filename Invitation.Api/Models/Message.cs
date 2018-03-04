using System;

namespace Invitation.Api.Models
{
    public class Message
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
    }
}