using Microsoft.AspNetCore.Mvc;

namespace Invitation.Client.Controllers
{
    public class ClientController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
