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

document.addEventListener("DOMContentLoaded", function () {
  const colours = document.querySelectorAll(".colour-item");

  colours.forEach(function (colour) {
    const colourID = colour.id;
    tippy(colour, {
      content: `Colour: ${colourID}`,
    });
  });
});
