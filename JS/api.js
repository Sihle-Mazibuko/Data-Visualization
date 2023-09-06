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
  document.querySelector("#image").innerHTML += `<img src="${data.url}"`;
  document.querySelector("#img-description").innerHTML = data.explanation;
  document.querySelector("#img-date").innerHTML = data.date;
}

RequestImage();
