using System;
using System.Collections.Generic;
using System.Linq;

namespace Invitation.Api.Models
{
    public class Status
    {
        public const string Yes = "yes";
        public const string No = "no";
        public const string NoResponse = "no response";
        public const string Maybe = "maybe";
        public const string NotPrompted = "not prompted";

        public static string GetAbbreviationFromStatus(string status)
        {
            return StatusWithAbbreviations.FirstOrDefault(s => s.Status == status).Abbreviation;
        }

        public static string GetStatusFromAbbreviation(string abbreviation)
        {
            return StatusWithAbbreviations.FirstOrDefault(s => string.Equals(s.Abbreviation, abbreviation, StringComparison.InvariantCultureIgnoreCase)).Status;
        }

        private static List<(string Status, string Abbreviation)> StatusWithAbbreviations => new List<(string, string)>
        {
            (Yes, "y"),
            (No, "n"),
            (Maybe, "m")
        };
    }
}