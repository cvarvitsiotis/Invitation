using System.Collections.Generic;
using System.Linq;

namespace Invitation.Api.Services
{
    public abstract class BaseService
    {
        protected string GetNextId(IEnumerable<string> ids)
        {
            if (!(ids?.Any()).GetValueOrDefault()) return "1";
            
            return (ids.Max(i => int.Parse(i)) + 1).ToString();
        }
    }
}