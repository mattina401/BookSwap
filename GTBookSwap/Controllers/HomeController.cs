using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GTBookSwap.Models;
using Google.API.Search;
using System.Data;

namespace GTBookSwap.Controllers
{
    public class HomeController : Controller
    {
        private GTBooksEntities db = new GTBooksEntities();

        public ActionResult Primary(string searchString)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");


            if (searchString != null)
            {
                string url = string.Format("/Books/Index?searchString=" + searchString);
                return Redirect(url);
            }
            return View();
        }





        public ActionResult Index(string searchOption, string searchString, string GT_Course, string courseNum)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");

            if (searchOption == "Buy" && searchString != null)
            {
                string url = string.Format("/Buy/BuyIndex?searchString=" + searchString);
                return Redirect(url);
            }
            if (searchOption == "Sell" && searchString != null)
            {
                string url = string.Format("/Sell/SellIndex?searchString=" + searchString);
                return Redirect(url);
            }

            if (GT_Course != null && searchOption == "Sell")
            {
                string url = string.Format("/Sell/SellIndex?courseNum=" + courseNum);
                return Redirect(url);
            }

            if (GT_Course != null && searchOption == "Buy")
            {
                string url = string.Format("/Buy/BuyIndex?courseNum=" + courseNum);
                return Redirect(url);
            }

            return View();
        }
        /*
         * Dropdown box
         */
        public JsonResult classList(int id)
        {
            var Class = from c in db.GT_Classes
                        where c.Course_id == id
                        select c;
            return Json(new SelectList(Class.ToArray(), "ID", "Course_num"), JsonRequestBehavior.AllowGet);
        }

        public IList<GT_Class> Getclass(int courseid)
        {
            return db.GT_Classes.Where(m => m.Course_id == courseid).ToList();
        }

        /*
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult LoadClassesBycourseid(string course_name)
        {
            var classList = this.Getclass(Convert.ToInt32(course_name));
            var classData = classList.Select(m => new SelectListItem()
            {
                Text = m.Course_num.ToString(),
                Value = m.Course_id.ToString(),
            });
            return Json(classData, JsonRequestBehavior.AllowGet);
        }*/

        /*
         */

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}