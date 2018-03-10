using System.Collections.Generic;
using System.Linq;

namespace Invitation.Api.Services
{
    public abstract class BaseService
    {
        protected string GetNextId(IEnumerable<string> ids)
        {
            return (ids.Max(i => int.Parse(i)) + 1).ToString();
        }
    }
}