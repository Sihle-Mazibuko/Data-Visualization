const api_Key = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
const api_URL = `https://api.nasa.gov/insight_weather/?api_key=${api_Key}&feedtype=json&ver=1.0;`;

function getWeather() {
  fetch(api_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      console.log(solData);
    });
}

getWeather();
