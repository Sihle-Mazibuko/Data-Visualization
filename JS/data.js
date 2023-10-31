let currentDay = 1;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function fetchAPODsForPreviousMonth() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const titles = [];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

  const daysInMonth = new Date(previousYear, previousMonth, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${previousYear}-${previousMonth
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.date && data.title && data.url) {
        titles.push(data.title);
      }
    } catch (error) {
      console.error(`Error fetching data for ${date}: ${error}`);
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const previousMonthName = monthNames[previousMonth - 1];
  const heading = document.getElementById("graph-title");
  const monthYear = document.getElementById("month-year");
  monthYear.textContent = `${previousMonthName} ${previousYear}`;
  heading.textContent = `Top Words For ${previousMonthName} ${previousYear}`;

  const topWords = getTopWords(titles);
  drawBarGraph(topWords, previousMonthName, previousYear);
}

async function fetchAPODs() {
  await fetchAPODsForPreviousMonth();
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const titles = [];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

  const daysInMonth = new Date(previousYear, previousMonth, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${previousYear}-${previousMonth
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.date && data.title && data.url) {
        titles.push(data.title);
      }
    } catch (error) {
      console.error(`Error fetching data for ${date}: ${error}`);
    }
  }

  const topWords = getTopWords(titles);
  drawBarGraph(topWords);
}

function getTopWords(titles) {
  const titlesWords = titles
    .join(" ")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
    .toLowerCase();
  const words = titlesWords.split(/\s+/);
  const ignore = ["a", "an", "the", "and", "of"];
  const wordCount = {};

  words.forEach((word) => {
    if (!ignore.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const wordCountArray = Object.entries(wordCount).map(([word, count]) => ({
    word,
    count,
  }));
  wordCountArray.sort((a, b) => b.count - a.count);

  return wordCountArray.slice(0, 5);
}

function drawBarGraph(topWords, previousMonthName, previousYear) {
  d3.select("#bar-graph svg").remove();
  const margin = { top: 60, right: 60, bottom: 80, left: 80 };

  const width = 1100 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("#bar-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(topWords.map((d) => d.word))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear().domain([0, 10]).nice().range([height, 0]);

  svg
    .selectAll(".bar")
    .data(topWords)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.word))
    .attr("y", (d) => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.count))
    .attr("fill", "red");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale).ticks(10));

  svg
    .selectAll(".bar-label")
    .data(topWords)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => xScale(d.word) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.count) - 10)
    .text((d) => d.count)
    .style("text-anchor", "middle")
    .style("fill", "white");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "white")
    .classed("underline", true)
    .text(
      `Top 5 Most Common Words in the ${previousMonthName} ${previousYear} APOD`
    );

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Word");

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 30)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Frequency");
}

async function TodaysAPOD() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const apodImage = document.getElementById("apod-img");
  const apodTitle = document.getElementById("t-apod-title");

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    );
    const data = await response.json();

    if (data.date && data.title && data.url) {
      apodImage.src = data.url;
      apodImage.title = data.title;
      apodTitle.textContent = data.title;
      apodTitle.style.display = "block";

      apodImage.addEventListener("mousemove", (event) => {
        const rect = apodImage.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const originX = (mouseX / rect.width) * 100;
        const originY = (mouseY / rect.height) * 100;
        apodImage.style.transformOrigin = `${originX}% ${originY}%`;
      });
    }
  } catch (error) {
    console.error("Error fetching APOD: ", error);
  }
}

async function updateSlide() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";

  document.addEventListener("DOMContentLoaded", async function () {
    const previousSlide = document.getElementById("previous-slide");
    const currentSlide = document.getElementById("current-slide");
    const nextSlide = document.getElementById("next-slide");

    const updateSlideContent = (element, data) => {
      const image = element.querySelector(".ss-apod-image");
      const title = element.querySelector(".ss-apod-title");
      const date = element.querySelector(".ss-apod-date");

      if (data.url) {
        image.setAttribute("src", data.url);
        title.textContent = data.title;
        date.textContent = data.date;
      }
    };

    let currentDay = 1;

    const fetchDataAndUpdateSlides = async () => {
      if (currentDay <= 28) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

        try {
          for (let i = 0; i < 3; i++) {
            const date = `${currentYear}-${String(currentMonth).padStart(
              2,
              "0"
            )}-${String(currentDay).padStart(2, "0")}`;
            const response = await fetch(`${apiUrl}&date=${date}`);
            const data = await response.json();

            if (data.date && data.title && data.url) {
              if (i === 0) {
                updateSlideContent(previousSlide, data);
              } else if (i === 1) {
                updateSlideContent(currentSlide, data);
              } else if (i === 2) {
                updateSlideContent(nextSlide, data);
              }
            } else {
              currentDay = 1;
            }

            currentDay++;
          }

          await new Promise((resolve) => setTimeout(resolve, 4000));
        } catch (error) {
          console.error(`Error fetching data: ${error}`);
        }

        fetchDataAndUpdateSlides();
      }
    };

    fetchDataAndUpdateSlides();
  });
}

async function createSolarSystem() {
  const width = 800;
  const height = 800;

  const svg = d3
    .select("#solar-system-svg")
    .attr("width", width)
    .attr("height", height);

  const sunGradient = svg
    .append("defs")
    .append("radialGradient")
    .attr("id", "sunGradient")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .attr("fx", "50%")
    .attr("fy", "50%");

  sunGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color: #ffcc00");
  sunGradient
    .append("stop")
    .attr("offset", "30%")
    .attr("style", "stop-color: #ff9933");
  sunGradient
    .append("stop")
    .attr("offset", "50%")
    .attr("style", "stop-color: #ff751a");
  sunGradient
    .append("stop")
    .attr("offset", "70%")
    .attr("style", "stop-color: #ff3300");
  sunGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color: #ff1a1a");

  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", 60)
    .style("fill", "url(#sunGradient)")
    .style("stroke", "none");

  const orbits = [
    { radius: 180, color: "lightblue" },
    { radius: 260, color: "lightgreen" },
    { radius: 360, color: "lightgrey" },
  ];

  svg
    .selectAll(".orbit")
    .data(orbits)
    .enter()
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", (d) => d.radius)
    .style("fill", "none")
    .style("stroke", (d) => d.color);

  const planetGroups = svg
    .selectAll(".planet")
    .data([
      { angle: 0, speed: 0.8, distance: 180, color: "../images/first.jpg" },
      { angle: 0, speed: 0.3, distance: 260, color: "../images/second.jpg" },
      { angle: 0, speed: 1, distance: 360, color: "../images/third.jpg" },
    ])
    .enter()
    .append("g")
    .attr("class", "planet");
  planetGroups.each(function (d) {
    d3.select(this)
      .append("image")
      .attr("xlink:href", d.color)
      .attr("width", 70)
      .attr("height", 70)
      .attr("x", width / 2 + d.distance - 35)
      .attr("y", height / 2 - 35);
  });

  function animatePlanets() {
    planetGroups.each(function (d) {
      d.angle += d.speed * 0.005;
      d3.select(this)
        .select("image")
        .attr("x", width / 2 + d.distance * Math.cos(d.angle) - 35)
        .attr("y", height / 2 + d.distance * Math.sin(d.angle) - 35);
    });

    requestAnimationFrame(animatePlanets);
  }

  animatePlanets();
}

createSolarSystem();

// TodaysAPOD();
// fetchAPODs();
// updateSlide();
