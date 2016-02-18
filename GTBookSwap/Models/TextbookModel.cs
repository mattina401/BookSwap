using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;

namespace GTBookSwap.Models
{
    public class TextbookModels
    {
        public EG_Textbook EG_Textbook { get; set; }
        public Buy_User Buy_User { get; set; }
        public GT_Class GT_Class { get; set; }
        public GT_Course GT_Course { get; set; }
        public Sell_Bookmark Sell_Bookmark { get; set; }
        public Buy_Bookmark Buy_Bookmark { get; set; }

    }

    public class EG_Textbook
    {
        public int ID { get; set; }
        public int Class_id { get; set; }
        public string Major { get; set; }
        public Nullable<int> Course_num { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
        public string Edition { get; set; }
        public int Price { get; set; }
        public string Condition { get; set; }
        public string ISBN {get; set;}
        public int Flag {get; set;}
        public string User_id {get; set;}
        public string Desc { get; set; }
    }
    public class Buy_User
    {

        public int ID { get; set; }
        public int Class_id { get; set; }
        public string Major { get; set; }
        public Nullable<int> Course_num { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
        public string Edition { get; set; }
        public string ISBN { get; set; }
        public string Desc { get; set; }
        public string User_id { get; set; }
        public int Flag { get; set; }
    }

   

    public class GT_Course
    {
        public int ID { get; set; }
        public string Course_name { get; set; }
    }

    public class GT_Class
    {
        public int ID { get; set; }
        public int Course_id { get; set; }
        public Nullable<int> Course_num { get; set; }
        public String Class_name { get; set; }
    }

    public class AspNetUsers
    {
        public string Id {get; set;}
        public string UserName {get; set;}
        public string PasswordHash {get; set;}
        public string SecurityStamp {get; set;}
        public string Discriminator {get; set;}
        [Required]
        [StringLength(100, ErrorMessage = "The Nickname must be at least 4 characters long.", MinimumLength = 4)]
        [Display(Name = "Nickname")]
        public string NickName { get; set; }
        [Required]
        [StringLength(10, ErrorMessage = "The phone must be 10 digits numbers.", MinimumLength = 10)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Phone")]
        public string Phone { get; set; }
    }

    public class Sell_Bookmark
    {
        public int ID { get; set; }
        public int Book_id { get; set; }
        public string User_name { get; set; }


    }

    public class Buy_Bookmark
    {
        public int ID { get; set; }
        public int Book_id { get; set; }
        public string User_name { get; set; }
    
    }


    public class GTBooksEntities : DbContext
    {
        public DbSet<EG_Textbook> EG_Textbooks { get; set; }
        public DbSet<Buy_User> Buy_Users { get; set; }
        public DbSet<GT_Course> GT_Courses { get; set; }
        public DbSet<GT_Class> GT_Classes { get; set; }
        public DbSet<AspNetUsers> GT_Users { get; set; }
        public DbSet<Sell_Bookmark> Sell_Bookmarks { get; set; }
        public DbSet<Buy_Bookmark> BuyBookmarks { get; set; }

    }

}