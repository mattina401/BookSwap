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

    public class BuyController : Controller
    {
        private GTBooksEntities db1 = new GTBooksEntities();
        public JsonResult classList(int id)
        {
            var Class = from c in db1.GT_Classes
                        where c.Course_id == id
                        select c;
            return Json(new SelectList(Class.ToArray(), "ID", "Course_num"), JsonRequestBehavior.AllowGet);
        }

        public IList<GT_Class> Getclass(int courseid)
        {
            return db1.GT_Classes.Where(m => m.Course_id == courseid).ToList();
        }


        public ActionResult BuyIndex(string searchString, int? id, int? status, string courseNum, string sortOrder, string currentSortOrder)
        {
            ViewBag.courseid = new SelectList(db1.GT_Courses, "ID", "Course_name");
            ViewBag.currentSearchString = searchString;
            ViewBag.currentCourseNum = courseNum;
            // Add to Buy_Bookmark
            if (status == 3)
            {


                Buy_User textbook = db1.Buy_Users.Find(id);

                Buy_Bookmark mybook = new Buy_Bookmark();

                mybook.Book_id = textbook.ID;
                mybook.User_name = User.Identity.Name;

                db1.BuyBookmarks.Add(mybook);


                db1.SaveChanges();
                return View(db1.Buy_Users);

            }

            // remove from Buy_Bookmark
            else if (status == 4)
            {

                Buy_User textbook = db1.Buy_Users.Find(id);
                Buy_Bookmark mybook = db1.BuyBookmarks.Where(c => c.Book_id.Equals(textbook.ID) && c.User_name.Equals(User.Identity.Name)).FirstOrDefault();


                // when Buy_Bookmark dose not have item
                if (mybook == null)
                {
                    return View(db1.Buy_Users);
                }

                db1.BuyBookmarks.Remove(mybook);
                db1.SaveChanges();
                return View(db1.Buy_Users);

            }
            else
            {
                //sorting
                //case 1: no sort. 
                //case 2: sortOrderAscending 
                //case 3: sortOrderDescending //by clicking one thing more 
                if (sortOrder != null)
                {
                    if (currentSortOrder != null)
                    {
                        if (currentSortOrder == (sortOrder))
                        {
                            sortOrder = sortOrder + "d";
                        }
                        ViewBag.currentSortOrder = sortOrder;
                    }
                    else
                    {
                        ViewBag.currentSortOrder = sortOrder;
                    }
                }

                int r;
                if (int.TryParse(courseNum, out r))
                { //searching by course
                    //int answer= Convert.ToInt32(searchString); 
                    var beforeList = db1.Buy_Users.Where(z => z.Class_id.Equals(r));

                    return View(sortThisShit(beforeList, sortOrder).ToList());
                }
                else
                {
                    var beforeList = (db1.Buy_Users.Where(s => s.Title.Contains(searchString)
                    || s.Author.Contains(searchString)
                    || s.ISBN.Equals(searchString)
                    || searchString == null));

                    return View(sortThisShit(beforeList, sortOrder).ToList());
                }


            }


        }

        /*private sorting method*/
        public IQueryable<Buy_User> sortThisShit(IQueryable<Buy_User> beforeList, string sortOrder)
        {
            IQueryable<Buy_User> beforeListResult = beforeList;
            switch (sortOrder)
            {
                //ascending
                case "title":
                    beforeListResult = beforeList.OrderBy(s => s.Title);
                    break;
                case "courseName":
                    beforeListResult = beforeList.OrderBy(s => s.Major);
                    break;

                case "courseNumber":
                    beforeListResult = beforeList.OrderBy(s => s.Course_num);
                    break;
               
                //descending
                case "titled":
                    beforeListResult = beforeList.OrderByDescending(s => s.Title);
                    break;
                case "courseNamed":
                    beforeListResult = beforeList.OrderByDescending(s => s.Major);
                    break;

                case "courseNumberd":
                    beforeListResult = beforeList.OrderByDescending(s => s.Course_num);
                    break;
                default:
                    beforeListResult = beforeList;
                    //set ViewBag.currentSortOrder as null
                    ViewBag.currentSortOrder = null;
                    break;
            }
            return beforeListResult;
        }

        public ActionResult _AdminBuyPost()
        {
            return PartialView("_AdminBuyPost", db1.Buy_Users.ToList());
        }

        //String parameter(e.g. string id) no needed
        public ActionResult _MyBuyPost()
        {
            //Please use [User.Identity.Name] to get ID(email) of user, Don't user [GetUserID] or [GetUserName].
            return PartialView("_MyBuyPost", db1.Buy_Users.Where(s => s.User_id.Equals(User.Identity.Name)).ToList());
        }

        [ChildActionOnly]
        public ActionResult PAction(int? id)
        {

            Buy_User textbook = db1.Buy_Users.Find(id);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("Image", typeof(string)));
            dt.Columns.Add(new DataColumn("Title", typeof(string)));
            dt.Columns.Add(new DataColumn("Author", typeof(string)));
            dt.Columns.Add(new DataColumn("Year", typeof(string)));
            dt.Columns.Add(new DataColumn("Page", typeof(string)));
            dt.Columns.Add(new DataColumn("ISBN", typeof(string)));
            dt.Columns.Add(new DataColumn("User Description", typeof(string)));
            dt.Columns.Add(new DataColumn("Buyer E-mail", typeof(string)));
            dt.Columns.Add(new DataColumn("Buyer Phone", typeof(string)));

            GbookSearchClient client = new GbookSearchClient("localhost");

            if (!(textbook == null || textbook.Title == null))
            {
                IList<IBookResult> results = client.Search(textbook.Title, 1);
                foreach (IBookResult result in results)
                {
                    DataRow dr = dt.NewRow();
                    dr["Image"] = result.TbImage;
                    dr["Title"] = result.Title.ToString();
                    dr["Author"] = result.Authors.ToString();
                    dr["Year"] = result.PublishedYear.ToString();
                    dr["Page"] = result.PageCount.ToString();
                    dr["ISBN"] = result.BookId.ToString();
                    dr["User Description"] = (from buyerid in db1.Buy_Users
                                              where buyerid.ID == id
                                              select buyerid.Desc).FirstOrDefault().ToString();

                    //Admin can see all the buyler info
                    if (User.Identity.Name == "qhdtnkim1@gmail.com")
                    {
                        dr["Buyer E-mail"] = (from buyerid in db1.Buy_Users
                                              where buyerid.ID == id
                                              select buyerid.User_id).FirstOrDefault();

                        dr["Buyer Phone"] = (from buyerid in db1.Buy_Users
                                             where buyerid.ID == id
                                             join buyerphone in db1.GT_Users on buyerid.User_id equals buyerphone.UserName
                                             select buyerphone.Phone).FirstOrDefault();
                    }

                    //engineer book store post always shows the e-mail and phone
                    if (textbook.User_id == "ebsbook@mindspring.com")
                    {
                        dr["Buyer E-mail"] = (from buyerid in db1.Buy_Users
                                               where buyerid.ID == id
                                               select buyerid.User_id).FirstOrDefault();

                        dr["Buyer Phone"] = (from buyerid in db1.Buy_Users
                                              where buyerid.ID == id
                                             join buyerphone in db1.GT_Users on buyerid.User_id equals buyerphone.UserName
                                             select buyerphone.Phone).FirstOrDefault();
                    }
                    else
                    {
                        //only login user can see the user info.
                        if (User.Identity.Name == "")
                        {
                        }
                        else
                        {
                            dr["Buyer E-mail"] = (from buyerid in db1.Buy_Users
                                                  where buyerid.ID == id
                                                  select buyerid.User_id).FirstOrDefault();
                            //only reveal e-mail, or e-mail + phone
                            if (textbook.Flag == 1)
                            {
                                dr["Buyer Phone"] = (from buyerid in db1.Buy_Users
                                                     where buyerid.ID == id
                                                     join buyerphone in db1.GT_Users on buyerid.User_id equals buyerphone.UserName
                                                     select buyerphone.Phone).FirstOrDefault();
                            }
                            else
                            {

                            }
                        }
                    }
                    dt.Rows.Add(dr);
                }
            }

            return PartialView("ExpandPartial", dt);
        }

        // GET: /Textbooks/Details/5
        public ActionResult BuyDetails(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Buy_User textbook = db1.Buy_Users.Find(id);
            if (textbook == null)
            {
                return HttpNotFound();
            }

            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("Image", typeof(string)));
            dt.Columns.Add(new DataColumn("Title", typeof(string)));
            dt.Columns.Add(new DataColumn("Author", typeof(string)));
            dt.Columns.Add(new DataColumn("Year", typeof(string)));
            dt.Columns.Add(new DataColumn("Page", typeof(string)));
            dt.Columns.Add(new DataColumn("ISBN", typeof(string)));
            dt.Columns.Add(new DataColumn("User Description", typeof(string)));
            dt.Columns.Add(new DataColumn("Buyer E-mail", typeof(string)));
            dt.Columns.Add(new DataColumn("Buyer Phone", typeof(string)));

            GbookSearchClient client = new GbookSearchClient("localhost");

            if (!(textbook == null || textbook.Title == null))
            {
                IList<IBookResult> results = client.Search(textbook.Title, 1);
                foreach (IBookResult result in results)
                {
                    DataRow dr = dt.NewRow();
                    dr["Image"] = result.TbImage;
                    dr["Title"] = result.Title.ToString();
                    dr["Author"] = result.Authors.ToString();
                    dr["Year"] = result.PublishedYear.ToString();
                    dr["Page"] = result.PageCount.ToString();
                    dr["ISBN"] = result.BookId.ToString();
                    dr["User Description"] = (from buyerid in db1.Buy_Users
                                              where buyerid.ID == id
                                              select buyerid.Desc).FirstOrDefault().ToString();
                    dr["Buyer E-mail"] = (from buyerid in db1.Buy_Users
                                          where buyerid.ID == id
                                          select buyerid.User_id).FirstOrDefault();

                    dr["Buyer Phone"] = (from buyerid in db1.Buy_Users
                                         where buyerid.ID == id
                                         join buyerphone in db1.GT_Users on buyerid.User_id equals buyerphone.UserName
                                         select buyerphone.Phone).FirstOrDefault();


                    dt.Rows.Add(dr);
                }
            }

            return View(dt);
        }

        public ActionResult _BuyPost (string ISBNSearch)
        {
            if (ISBNSearch == null || ISBNSearch == "")
            {
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("No item to display", typeof(string)));
                return View(dt);
            }
            else
            {
                GbookSearchClient client = new GbookSearchClient("localhost");
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("Image", typeof(string)));
                dt.Columns.Add(new DataColumn("Title", typeof(string)));
                dt.Columns.Add(new DataColumn("Author", typeof(string)));
                dt.Columns.Add(new DataColumn("Year", typeof(string)));
                dt.Columns.Add(new DataColumn("Page", typeof(string)));
                dt.Columns.Add(new DataColumn("ISBN", typeof(string)));

                IList<IBookResult> results = client.Search(ISBNSearch, 1);
                foreach (IBookResult result in results)
                {
                    ViewBag.ISBN = result.BookId;
                    ViewBag.title = result.Title;
                    ViewBag.author = result.Authors;
                    ViewBag.year = result.PublishedYear;
                    ViewBag.page = result.PageCount;
                    DataRow dr = dt.NewRow();
                    dr["Image"] = result.TbImage;
                    dr["Title"] = result.Title.ToString();
                    dr["Author"] = result.Authors.ToString();
                    dr["Year"] = result.PublishedYear.ToString();
                    dr["Page"] = result.PageCount;
                    dr["ISBN"] = result.BookId.ToString();
                    dt.Rows.Add(dr);
                }
                return PartialView(dt);
            }
        }

        // GET: /Textbooks/Create
        public ActionResult BuyPost(string ISBN, string title, string author, string year)
        {
            ViewBag.courseid = new SelectList(db1.GT_Courses, "ID", "Course_name");

            ViewBag.Title = title;
            ViewBag.Author = author;
            ViewBag.Year = year;
            ViewBag.ISBN = ISBN;
            return View();
        }

        // POST: /Textbooks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult BuyPost([Bind(Include = "Desc")] Buy_User textbook, string ISBN, string title, string author, string year, int GT_Course, int courseNum, string userinfo)
        {
            if (userinfo == "Only e-mail")
            {
                textbook.Flag = 0;
            }
            else
            {
                textbook.Flag = 1;
            }

            if (ModelState.IsValid)
            {
                textbook.Major = (from course in db1.GT_Courses
                                  where course.ID == GT_Course
                                  select course.Course_name).FirstOrDefault();

                textbook.Course_num = (from course_num in db1.GT_Classes
                                       where course_num.ID == courseNum
                                       select course_num.Course_num).FirstOrDefault();
                textbook.Class_id = courseNum;
                textbook.ISBN = ISBN;
                textbook.Title = title;
                textbook.Author = author;
                textbook.Edition = year;
                textbook.User_id = User.Identity.Name;

                db1.Buy_Users.Add(textbook);
                db1.SaveChanges();
                return RedirectToAction("BuyIndex");
            }

            return View(textbook);
        }

        // GET: /Textbooks/Edit/5
        public ActionResult BuyEdit(int? id)
        {
            ViewBag.courseid = new SelectList(db1.GT_Courses, "ID", "Course_name");
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Buy_User textbook = db1.Buy_Users.Find(id);
            if (textbook == null)
            {
                return HttpNotFound();
            }
            return View(textbook);
        }

        // POST: /Textbooks/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult BuyEdit([Bind(Include = "ID, Title, Author, Edition, ISBN, Desc")] Buy_User textbook, int GT_Course, int courseNum)
        {
            if (ModelState.IsValid)
            {
                textbook.Major = (from course in db1.GT_Courses
                                  where course.ID == GT_Course
                                  select course.Course_name).FirstOrDefault();

                textbook.Course_num = (from course_num in db1.GT_Classes
                                       where course_num.ID == courseNum
                                       select course_num.Course_num).FirstOrDefault();
                textbook.Class_id = courseNum;
                //If Admin changed posts, doesn't change the user name
                textbook.User_id = (from user_id in db1.Buy_Users
                                    where user_id.ID == textbook.ID
                                    select user_id.User_id).FirstOrDefault();
                db1.Entry(textbook).State = EntityState.Modified;
                db1.SaveChanges();
                return RedirectToAction("Manage", "Account");
            }
            return View(textbook);
        }

        // GET: /Textbooks/Delete/5
        public ActionResult BuyDelete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Buy_User textbook = db1.Buy_Users.Find(id);
            if (textbook == null)
            {
                return HttpNotFound();
            }
            return View(textbook);
        }

        // POST: /Textbooks/Delete/5
        [HttpPost, ActionName("BuyDelete")]
        [ValidateAntiForgeryToken]
        public ActionResult BuyDeleteConfirmed(int id)
        {
            Buy_User textbook = db1.Buy_Users.Find(id);
            db1.Buy_Users.Remove(textbook);
            db1.SaveChanges();
            return RedirectToAction("Manage", "Account");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db1.Dispose();
            }
            base.Dispose(disposing);
        }
    }

}