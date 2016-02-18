using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using GTBookSwap.Models;
using System.Collections.Generic;
using System;
using Google.API.Search;
using System.Data;
using Microsoft.AspNet.Identity;

namespace GTBookSwap.Controllers
{
    public class BooksController : Controller
    {

        private GTBooksEntities db = new GTBooksEntities();
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
        //
        // GET: /Books/
        public ActionResult Index(string searchString, int? id, int? status, string courseNum, string sortOrder, string currentSortOrder)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            ViewBag.currentSearchString = searchString;
            ViewBag.currentCourseNum = courseNum;
            return View();
        }
    }
}