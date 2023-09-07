const navLinks = document.querySelectorAll(".nav-link");
const windowPathname = window.location.pathname;

navLinks.forEach((navLink) => {
  if (navLink.href.includes(windowPathname)) {
    navLink.classList.add("active");
  }
});
