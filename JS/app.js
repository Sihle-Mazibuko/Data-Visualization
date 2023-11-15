const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navList = document.querySelector(".navlist");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navList.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navList.classList.remove("active");
};

document.addEventListener("DOMContentLoaded", function () {
  const blogLink = document.getElementById("blog-link");
  const dataLink = document.getElementById("data-link");
  const homeLink = document.getElementById("home-link");

  blogLink.addEventListener("click", function () {
    window.location.href =
      "https://sihle-mazibuko.github.io/Data-Visualization/html/blogs.html";
  });

  dataLink.addEventListener("click", function () {
    window.location.href =
      "https://sihle-mazibuko.github.io/Data-Visualization/html/data.html";
  });

  homeLink.addEventListener("click", function () {
    window.location.href =
      "https://sihle-mazibuko.github.io/Data-Visualization/";
  });
});
