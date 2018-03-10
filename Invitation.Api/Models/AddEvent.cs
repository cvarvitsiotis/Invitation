using System;

namespace Invitation.Api.Models
{
    public class AddEvent
    {
        public string UserId { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}