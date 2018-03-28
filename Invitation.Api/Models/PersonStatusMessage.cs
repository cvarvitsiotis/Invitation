namespace Invitation.Api.Models
{
    public class PersonStatusMessage
    {
        public PersonStatus PersonStatus { get; set; }
        public Person Person { get; set; }
        public string Message { get; set; }
    }
}