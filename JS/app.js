const navLinks = document.querySelectorAll(".nav-link");
const windowPathname = window.location.pathname;

navLinks.forEach((navLink) => {
  if (navLink.href.includes(windowPathname)) {
    navLink.classList.add("active");
  }
});

const blogLinks = document.querySelectorAll("page-links-content");
blogLinks.forEach((blogLink) => {
  blogBox.addEventListener("click", () => BlogClick());
});

function BlogClick() {
  window.location.replace(
    "https://sihle-mazibuko.github.io/Portfolio/essay.html"
  );

  console.log(blogLinks);
}
