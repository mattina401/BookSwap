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

    public class SellController : Controller
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



        public ActionResult SellIndex(string searchString, int? id, int? status, string courseNum, string sortOrder, string currentSortOrder, int? start)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            ViewBag.currentSearchString = searchString;
            ViewBag.currentCourseNum = courseNum;

            //assign the page start number
            if (start == null)
            {
                ViewBag.pageStart = 0;
            }
            else
            {
                ViewBag.pageStart = start;
            }

            //adding bookmark
            if (status == 3)
            {
                EG_Textbook textbook = db.EG_Textbooks.Find(id);

                Sell_Bookmark mybook = new Sell_Bookmark();



                Sell_Bookmark mybook2 = db.Sell_Bookmarks.Where(c => c.Book_id.Equals(textbook.ID) && c.User_name.Equals(User.Identity.Name)).FirstOrDefault();


                if (mybook2 == null)
                {
                    mybook.Book_id = textbook.ID;
                    mybook.User_name = User.Identity.Name;
                    db.Sell_Bookmarks.Add(mybook);
                }
                else
                {
                    db.Sell_Bookmarks.Remove(mybook2);
                }

                //db.Sell_Bookmarks.Add(mybook);

                db.SaveChanges();
                return Json("Add Succeed");
                //return View(db.EG_Textbooks);

            }

            //remove bookmark
            else if (status == 4)
            {


                EG_Textbook textbook = db.EG_Textbooks.Find(id);
                Sell_Bookmark mybook = new Sell_Bookmark();

                Sell_Bookmark mybook2 = db.Sell_Bookmarks.Where(c => c.Book_id.Equals(textbook.ID) && c.User_name.Equals(User.Identity.Name)).FirstOrDefault();

                if (mybook2 == null)
                {
                    mybook.Book_id = textbook.ID;
                    mybook.User_name = User.Identity.Name;
                    db.Sell_Bookmarks.Add(mybook);
                }
                else
                {
                    db.Sell_Bookmarks.Remove(mybook2);
                }

                // when Sell_Bookmark dose not have item
                /*
                if (mybook == null)
                {
                    return View(db.EG_Textbooks);
                }
                 * */

                //db.Sell_Bookmarks.Remove(mybook);
                db.SaveChanges();
                return Json("Remove Succeed");
                //return View(db.EG_Textbooks);
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
                    var beforeList = db.EG_Textbooks.Where(z => z.Class_id.Equals(r));
                    ViewBag.maxPage = beforeList.Count();//for the page count

                    foreach (var item in beforeList)
                    {
                        Sell_Bookmark mybook2 = db.Sell_Bookmarks.Where(c => c.Book_id.Equals(item.ID) && c.User_name.Equals(User.Identity.Name)).FirstOrDefault();


                        if (mybook2 == null)
                        {
                            item.Flag = 0;
                        }
                        else
                        {
                            item.Flag = 1;
                        }

                    }
                    return PartialView("SellIndex", sortThisShit(beforeList, sortOrder).ToList());
                }
                else
                {
                    var beforeList = (db.EG_Textbooks.Where(s => s.Title.Contains(searchString)
                    || s.Author.Contains(searchString)
                    || s.ISBN.Equals(searchString)
                    || searchString == null));

                    foreach (var item in beforeList)
                    {
                        Sell_Bookmark mybook2 = db.Sell_Bookmarks.Where(c => c.Book_id.Equals(item.ID) && c.User_name.Equals(User.Identity.Name)).FirstOrDefault();


                        if (mybook2 == null)
                        {
                            item.Flag = 0;
                        }
                        else
                        {
                            item.Flag = 1;
                        }

                    }

                    ViewBag.maxPage = beforeList.Count();//for the page count
                    return PartialView("SellIndex", sortThisShit(beforeList, sortOrder).ToList());
                }
            }
        }

        /*private sorting method*/
        public IQueryable<EG_Textbook> sortThisShit(IQueryable<EG_Textbook> beforeList, string sortOrder)
        {
            IQueryable<EG_Textbook> beforeListResult = beforeList;
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
                case "price":
                    beforeListResult = beforeList.OrderBy(s => s.Price);
                    break;
                case "condition":
                    beforeListResult = beforeList.OrderBy(s => s.Condition);
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
                case "priced":
                    beforeListResult = beforeList.OrderByDescending(s => s.Price);
                    break;
                case "conditiond":
                    beforeListResult = beforeList.OrderByDescending(s => s.Condition);
                    break;
                default:
                    beforeListResult = beforeList;
                    //set ViewBag.currentSortOrder as null
                    ViewBag.currentSortOrder = null;
                    break;
            }
            return beforeListResult;
        }

        public ActionResult _AdminSellPost()
        {
            return PartialView("_AdminSellPost", db.EG_Textbooks.ToList());
        }

        //String parameter(e.g. string id) no needed
        public ActionResult _MySellPost()
        {
            //Please use [User.Identity.Name] to get ID(email) of user, Don't user [GetUserID] or [GetUserName].
            return PartialView("_MySellPost", db.EG_Textbooks.Where(s => s.User_id.Equals(User.Identity.Name)).ToList());
        }


        public ActionResult _MySellBookmark()
        {
            var q = from c in db.EG_Textbooks
                    from o in db.Sell_Bookmarks
                    where (o.User_name.Equals(User.Identity.Name))
                    where c.ID.Equals(o.Book_id)
                    select c;

            return PartialView("_MySellBookmark", q.ToList());
        }

        [ChildActionOnly]
        public ActionResult PAction(int? id)
        {

            EG_Textbook textbook = db.EG_Textbooks.Find(id);
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("Image", typeof(string)));
            dt.Columns.Add(new DataColumn("Title", typeof(string)));
            dt.Columns.Add(new DataColumn("Author", typeof(string)));
            dt.Columns.Add(new DataColumn("Year", typeof(string)));
            dt.Columns.Add(new DataColumn("Page", typeof(string)));
            dt.Columns.Add(new DataColumn("ISBN", typeof(string)));
            dt.Columns.Add(new DataColumn("User Description", typeof(string)));
            dt.Columns.Add(new DataColumn("Seller E-mail", typeof(string)));
            dt.Columns.Add(new DataColumn("Seller Phone", typeof(string)));

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
                    //Checking Description is null or not
                    if((from sellerid in db.EG_Textbooks where sellerid.ID == id select sellerid.Desc).FirstOrDefault() == null)
                    {
                        dr["User Description"] = "";
                    }
                    else
                    {
                        dr["User Description"] = (from sellerid in db.EG_Textbooks
                                                  where sellerid.ID == id
                                                  select sellerid.Desc).FirstOrDefault().ToString();
                    }

                    //Admin can see all the seller info
                    if (User.Identity.Name == "qhdtnkim1@gmail.com")
                    {
                        dr["Seller E-mail"] = (from sellerid in db.EG_Textbooks
                                               where sellerid.ID == id
                                               select sellerid.User_id).FirstOrDefault();

                        dr["Seller Phone"] = (from sellerid in db.EG_Textbooks
                                              where sellerid.ID == id
                                              join sellerphone in db.GT_Users on sellerid.User_id equals sellerphone.UserName
                                              select sellerphone.Phone).FirstOrDefault();
                    }
                    //engineer book store post always shows the e-mail and phone
                    if (textbook.User_id == "ebsbook@mindspring.com")
                    {
                        dr["Seller E-mail"] = (from sellerid in db.EG_Textbooks
                                               where sellerid.ID == id
                                               select sellerid.User_id).FirstOrDefault();

                        dr["Seller Phone"] = (from sellerid in db.EG_Textbooks
                                              where sellerid.ID == id
                                              join sellerphone in db.GT_Users on sellerid.User_id equals sellerphone.UserName
                                              select sellerphone.Phone).FirstOrDefault();
                    }
                    else
                    {
                        //only login user can see the user info.
                        if (User.Identity.Name == "")
                        {
                        }
                        else
                        {
                            dr["Seller E-mail"] = (from sellerid in db.EG_Textbooks
                                                   where sellerid.ID == id
                                                   select sellerid.User_id).FirstOrDefault();
                            //only reveal e-mail, or e-mail + phone
                            if (textbook.Flag == 1)
                            {
                                dr["Seller Phone"] = (from sellerid in db.EG_Textbooks
                                                      where sellerid.ID == id
                                                      join sellerphone in db.GT_Users on sellerid.User_id equals sellerphone.UserName
                                                      select sellerphone.Phone).FirstOrDefault();
                            }
                            else
                            {

                            }
                        }
                    }


                    dt.Rows.Add(dr);
                }
            }

            return PartialView("ExpandPartial1", dt);
        }
        // GET: /Textbooks/Details/5
        public ActionResult SellDetails(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            EG_Textbook textbook = db.EG_Textbooks.Find(id);
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
            dt.Columns.Add(new DataColumn("Seller E-mail", typeof(string)));
            dt.Columns.Add(new DataColumn("Seller Phone", typeof(string)));

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
                    dr["User Description"] = (from sellerid in db.EG_Textbooks
                                              where sellerid.ID == id
                                              select sellerid.Desc).FirstOrDefault().ToString();
                    dr["Seller E-mail"] = (from sellerid in db.EG_Textbooks
                                           where sellerid.ID == id
                                           select sellerid.User_id).FirstOrDefault();

                    dr["Seller Phone"] = (from sellerid in db.EG_Textbooks
                                          where sellerid.ID == id
                                          join sellerphone in db.GT_Users on sellerid.User_id equals sellerphone.UserName
                                          select sellerphone.Phone).FirstOrDefault();


                    dt.Rows.Add(dr);
                }
            }
            return View(dt);
        }

        // GET: /Textbooks/Create
        public ActionResult _SellPost(string ISBNSearch)
        {
            if (ISBNSearch == null || ISBNSearch == "")
            {
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("No item to display", typeof(string)));
                return PartialView(dt);

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
                //dt.Columns.Add(new DataColumn("URL", typeof(string)));

                IList<IBookResult> results = client.Search(ISBNSearch, 1);
                foreach (IBookResult result in results)
                {
                    ViewBag.ISBN = result.BookId;
                    ViewBag.title = result.Title;
                    ViewBag.author = result.Authors;
                    ViewBag.year = result.PublishedYear;
                    //ViewBag.url = result.Url;
                    ViewBag.page = result.PageCount;
                    DataRow dr = dt.NewRow();
                    dr["Image"] = result.TbImage;
                    dr["Title"] = result.Title.ToString();
                    dr["Author"] = result.Authors.ToString();
                    dr["Year"] = result.PublishedYear.ToString();
                    dr["Page"] = result.PageCount;
                    dr["ISBN"] = result.BookId.ToString();
                    //dr["URL"] = result.Url.ToString();
                    dt.Rows.Add(dr);
                }
                return PartialView(dt);
            }


        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult _SellPostBottom(EG_Textbook model)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");

            return PartialView(model);
        }

        [AllowAnonymous]
        public ActionResult SellPost(EG_Textbook model)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");

            return View(model);
        }

        // POST: /Textbooks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SellPost([Bind(Include = "Desc, Price")] EG_Textbook textbook, string condition, string ISBN, string title, string author, string Edition, int GT_Course, int courseNum, string userinfo)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            if (ModelState.IsValid)
            {
                if (userinfo == "Only e-mail")
                {
                    textbook.Flag = 0;
                }
                else
                {
                    textbook.Flag = 1;
                }

                textbook.Major = (from course in db.GT_Courses
                                  where course.ID == GT_Course
                                  select course.Course_name).FirstOrDefault();

                textbook.Course_num = (from course_num in db.GT_Classes
                                       where course_num.ID == courseNum
                                       select course_num.Course_num).FirstOrDefault();
                textbook.Class_id = courseNum;
                textbook.ISBN = ISBN;
                textbook.Title = title;
                textbook.Author = author;
                textbook.Edition = Edition;
                textbook.User_id = User.Identity.Name;
                textbook.Condition = condition;

                db.EG_Textbooks.Add(textbook);
                db.SaveChanges();
                return Json("/Books/Index");
                //return RedirectToAction("SellIndex");
            }

            return View(textbook);
        }

        [AllowAnonymous]
        public ActionResult SellEdit(EG_Textbook model)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            return View();
        }

        // GET: /Textbooks/Edit/5
        public ActionResult _SellEdit(int? id)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            EG_Textbook textbook = db.EG_Textbooks.Find(id);
            if (textbook == null)
            {
                return HttpNotFound();
            }
            return PartialView(textbook);
        }

        // POST: /Textbooks/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SellEdit([Bind(Include = "ID, Title, Author, Edition, ISBN, Price, Condition, Desc")] EG_Textbook textbook, int GT_Course, int courseNum, string userinfo)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            if (ModelState.IsValid)
            {
                if (userinfo == "Only e-mail")
                {
                    textbook.Flag = 0;
                }
                else
                {
                    textbook.Flag = 1;
                }
                textbook.Major = (from course in db.GT_Courses
                                  where course.ID == GT_Course
                                  select course.Course_name).FirstOrDefault();

                textbook.Course_num = (from course_num in db.GT_Classes
                                       where course_num.ID == courseNum
                                       select course_num.Course_num).FirstOrDefault();
                textbook.Class_id = courseNum;
                //If Admin changed posts, doesn't change the user name
                textbook.User_id = (from user_id in db.EG_Textbooks
                                    where user_id.ID == textbook.ID
                                    select user_id.User_id).FirstOrDefault();
                db.Entry(textbook).State = EntityState.Modified;
                db.SaveChanges();
                return Json("/Account/Manage");
            }
            return View(textbook);
        }

        [AllowAnonymous]
        public ActionResult SellDelete(EG_Textbook model)
        {
            ViewBag.courseid = new SelectList(db.GT_Courses, "ID", "Course_name");
            return View();
        }

        // GET: /Textbooks/Delete/5
        public ActionResult _SellDelete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            EG_Textbook textbook = db.EG_Textbooks.Find(id);
            if (textbook == null)
            {
                return HttpNotFound();
            }
            return PartialView(textbook);
        }

        // POST: /Textbooks/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SellDelete([Bind(Include = "Desc, Price, Title, Major, Course_Num, Condition")] EG_Textbook textbook, int ID)
        {
            EG_Textbook b = db.EG_Textbooks.Find(ID);
            db.EG_Textbooks.Remove(b);
            db.SaveChanges();
            return Json("/Account/Manage");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

}