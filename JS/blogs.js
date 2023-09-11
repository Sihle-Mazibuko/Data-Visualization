document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".blog-menu li");
  const articles = document.querySelectorAll(".blog");

  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("click", function () {
      articles.forEach(function (article) {
        article.style.display = "none";
      });

      menuItems.forEach(function (item) {
        item.classList.remove("active");
      });

      this.classList.add("active");

      const articleId = this.getAttribute("data-article");
      document.getElementById(articleId).style.display = "block";
    });
  });
});
