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

document.addEventListener("DOMContentLoaded", function () {
  const blogLink = document.getElementById("blog-link");
  const dataLink = document.getElementById("data-link");

  blogLink.addEventListener("click", function () {
    window.location.href =
      "https://sihle-mazibuko.github.io/Data-Visualization/html/blogs.html";
  });

  dataLink.addEventListener("click", function () {
    window.location.href =
      "https://sihle-mazibuko.github.io/Data-Visualization/html/data.html";
  });
});

// Get all the color list items
const colorItems = document.querySelectorAll(".colour-item");

function handleMouseOver(event) {
  const listItem = event.target;
  const listItemClass = listItem.classList[0];

  const tooltip = document.getElementById("tool-tip");
  tooltip.textContent = listItemClass;
}

function handleMouseOut() {
  const tooltip = document.getElementById("tool-tip");
  tooltip.textContent = "";
}

colorItems.forEach((item) => {
  item.addEventListener("mouseover", handleMouseOver);
  item.addEventListener("mouseout", handleMouseOut);
});
