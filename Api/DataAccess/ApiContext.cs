using Invitation.Models;
using Microsoft.EntityFrameworkCore;

namespace Invitation.DataAccess
{
    public class ApiContext : DbContext
    {
        public ApiContext(DbContextOptions<ApiContext> options)
            : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }

        public DbSet<Person> People { get; set; }
    }
}