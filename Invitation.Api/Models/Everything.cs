using System.Collections.Generic;

namespace Invitation.Api.Models
{
    public class Everything
    {
        public List<Event> Events { get; set; }
        public List<Person> People { get; set; }
    }
}