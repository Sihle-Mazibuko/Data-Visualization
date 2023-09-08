const navLinks = document.querySelectorAll(".nav-link");
const windowPathname = window.location.pathname;

navLinks.forEach((navLink) => {
  if (navLink.href.includes(windowPathname)) {
    navLink.classList.add("active");
  }
});

const blogLink = document.querySelector(".blog-link");
blogLink.addEventListener("click", () => BlogClick());

function BlogClick() {
  window.location.replace(
    "https://sihle-mazibuko.github.io/Data-Visualization/html/blogs.html"
  );
}
