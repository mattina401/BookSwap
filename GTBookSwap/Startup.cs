using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GTBookSwap.Startup))]
namespace GTBookSwap
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
