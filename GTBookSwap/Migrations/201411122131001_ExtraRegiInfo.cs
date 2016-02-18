namespace GTBookSwap.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExtraRegiInfo : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "NickName", c => c.String());
            AddColumn("dbo.AspNetUsers", "Phone", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Phone");
            DropColumn("dbo.AspNetUsers", "NickName");
        }
    }
}
