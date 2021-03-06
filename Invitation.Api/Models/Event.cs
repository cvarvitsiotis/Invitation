using System;
using System.Collections.Generic;

namespace Invitation.Api.Models
{
    public class Event
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public List<Message> Messages { get; set; }
        public List<PersonStatus> PersonStatuses { get; set; }
    }
}