const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navlist = document.querySelector(".navlist");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navlist.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navlist.classList.remove("active");
};

const blogBoxes = document.querySelectorAll(".blog-box");
blogBoxes.forEach((blogBox) => {
  blogBox.addEventListener("click", () => BlogClick());
});

function BlogClick() {
  window.location(
    "https://sihle-mazibuko.github.io/Data-Visualization/blogs.html"
  );
}
