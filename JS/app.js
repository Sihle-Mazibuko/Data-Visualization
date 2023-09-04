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

const blogBoxes = document.querySelectorAll("#blogs");
blogBoxes.forEach((blogBox) => {
  blogBox.addEventListener("click", () => BlogClick());
});

function BlogClick() {
  window.location.replace(
    "https://sihle-mazibuko.github.io/Data-Visualization/html/blogs.html"
  );
}
