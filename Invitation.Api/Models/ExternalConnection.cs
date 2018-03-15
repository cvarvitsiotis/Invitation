using System.Collections.Generic;

namespace Invitation.Api.Models
{
    public class ExternalConnection
    {
        public string ResourceName { get; set; }

        public List<ExternalConnectionName> Names { get; set; }

        public List<ExternalConnectionPhoneNumber> PhoneNumbers { get; set; }
    }

    public class ExternalConnectionName
    {        
        public string GivenName { get; set; }

        public string FamilyName { get; set; }

        public ExternalConnectionMetadata Metadata { get; set; }
    }

    public class ExternalConnectionPhoneNumber
    {
        public string CanonicalForm { get; set; }

        public string FormattedType { get; set; }
    }

    public class ExternalConnectionMetadata
    {
        public bool Primary { get; set; }
    }
}