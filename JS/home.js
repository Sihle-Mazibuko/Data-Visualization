const blogLinks = document.querySelectorAll(".blog-link");
blogLinks.forEach((blogLink) => {
  blogLink.addEventListener("click", () => BlogClick());
});

function BlogClick() {
  window.location.replace(
    "https://sihle-mazibuko.github.io/Portfolio/blogpages.html"
  );
}

const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";

async function RequestImage() {
  let response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
  );
  let data = await response.json();
  console.log(data);
  useAPIData(data);
}

function useAPIData(data) {
  document.querySelector("#image-title").innerHTML = data.title;
  document.querySelector("#img-description").innerHTML = data.explanation;
  document.querySelector("#img-date").innerHTML = data.date;

  const apodImg = document.getElementById("apod-img");
  apodImg.src = data.url;
  apodImg.alt = data.title;
}

RequestImage();
