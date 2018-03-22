using Invitation.Api.DataAccess;
using Invitation.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Threading.Tasks;

namespace Invitation.Api
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;    
                        return Task.CompletedTask;
                    };
                });

            //HeaderName must match axios's xsrfHeaderName
            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

            services.AddCors();
            services.AddHttpClient();
            services.AddMvc(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                
                options.Filters.Add(new AuthorizeFilter(policy));

                options.Filters.Add(new ValidateAntiForgeryTokenAttribute());
            })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddDbContext<ApiContext>(opt => opt.UseInMemoryDatabase("Api"));
            services.AddScoped<IExternalAuthService, ExternalAuthService>();
            services.AddScoped<IExternalPersonService, ExternalPersonService>();
            services.AddScoped<IEverythingService, EverythingService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IPersonStatusService, PersonStatusService>();
            services.AddScoped<IPersonService, PersonService>();
            services.AddScoped<IGoogleApiAccessTokenService, GoogleApiAccessTokenService>();            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseAuthentication();

            app.UseCors(builder => builder
                .WithOrigins("https://localhost:44326")
                 .AllowAnyMethod()
                 .AllowAnyHeader()
                 .AllowCredentials());

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
