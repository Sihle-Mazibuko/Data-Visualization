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
let selectedDay = null;
const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";

async function getTopWordsFromPreviousMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const daysInMonth = new Date(previousYear, previousMonth, 0).getDate();

  const titles = [];

  try {
    const apiPromises = Array.from({ length: daysInMonth }, (_, day) => {
      const date = `${previousYear}-${String(previousMonth).padStart(
        2,
        "0"
      )}-${String(day + 1).padStart(2, "0")}`;
      const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.date && data.title && data.url) {
            titles.push(data.title);
          }
        })
        .catch((error) => {
          console.error(`Error fetching data for ${date}: ${error}`);
        });
    });

    await Promise.all(apiPromises);

    const topWords = calculateTopWords(titles, 6);
    return topWords;
  } catch (error) {
    console.error("Error fetching data from APOD API:", error);
    throw error;
  }
}

function calculateTopWords(titles, topCount) {
  const titlesWords = titles
    .join(" ")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
    .toLowerCase();

  const words = titlesWords.split(/\s+/);
  const ignore = ["a", "an", "the", "and", "of", "in", "from"];

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

  return wordCountArray.slice(0, topCount);
}

async function drawBarGraph() {
  try {
    const topWords = await getTopWordsFromPreviousMonth();

    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(topWords.map((d) => d.word));

    const y = d3.scaleLinear().range([height, 0]).domain([0, 7]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("dy", "0.71rem")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Words");

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left - 2)
      .attr("x", -height / 2)
      .attr("dy", "0.71rem")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Frequency");

    svg
      .selectAll("rect")
      .data(topWords)
      .enter()
      .append("rect")
      .style("fill", "red")
      .attr("x", (d) => x(d.word))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthName = monthNames[previousMonth - 1];

    document.getElementById(
      "chart-heading"
    ).textContent = `Top Words for ${previousMonthName} ${previousYear}`;
  } catch (error) {
    console.error("Error drawing bar graph:", error);
  }
}

function drawCalendar(containerElement, currentDate) {
  d3.select(containerElement).select(".calendar-container").remove();

  const calendarContainer = d3
    .select(containerElement)
    .append("div")
    .classed("calendar-container", true);

  const calendarHeader = calendarContainer
    .append("div")
    .classed("calendar-header", true);

  calendarHeader.html(
    `<button id="prev-month">Previous</button> 
      ${new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()
      ).toLocaleString("default", {
        month: "long",
      })} ${currentDate.getFullYear()}
      <button id="next-month">Next</button>`
  );

  const calendarDays = calendarContainer
    .append("div")
    .classed("calendar-days", true);

  const today = new Date();
  let row = 0;

  for (
    let i = 1;
    i <=
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    i++
  ) {
    const calendarDay = calendarDays
      .append("div")
      .classed("calendar-day", true)
      .text(i);

    if (
      i === currentDate.getDate() &&
      currentDate.getMonth() === currentDate.getMonth()
    ) {
      calendarDay.classed("current-day", true);
    }

    if (
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i) > today
    ) {
      calendarDay.classed("future-day", true);
    }

    calendarDay.on("mouseover", async function () {
      try {
        const apodData = await fetchCalendarAPOD(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          i
        );
        console.log(apodData);
      } catch (error) {
        console.error("Error fetching APOD data:", error);
      }
    });

    calendarDay.on("click", async function () {
      if (!calendarDay.classed("future-day")) {
        selectedDay = i;
        const apodData = await fetchCalendarAPOD(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          i
        );
        openModal(
          apodData.title,
          apodData.url,
          `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`
        );
      }
    });

    if (row === 6) {
      row = 0;
    } else {
      row++;
    }
  }

  document.getElementById("prev-month").addEventListener("click", function () {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    drawCalendar(containerElement, previousMonth);
  });

  document.getElementById("next-month").addEventListener("click", function () {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    drawCalendar(containerElement, nextMonth);
  });
}

function openModal(title, imageUrl, clickedDate) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `<h3>${title}</h3><p>Date: ${clickedDate}</p><img src="${imageUrl}" alt="${title}">`;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

async function createSolarSystem() {
  let width = 800;
  let height = 800;

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
      { angle: 0, speed: 0.8, distance: 180, image: "../images/first.jpg" },
      { angle: 0, speed: 0.3, distance: 260, image: "../images/second.jpg" },
      { angle: 0, speed: 1, distance: 360, image: "../images/third.jpg" },
    ])
    .enter()
    .append("g")
    .attr("class", "planet");

  planetGroups.each(function (d) {
    const patternId = `pattern-${d.image.replace(/\W/g, "_")}`;

    svg
      .append("defs")
      .append("pattern")
      .attr("id", patternId)
      .attr("width", 2)
      .attr("height", 2)
      .append("image")
      .attr("width", 70)
      .attr("height", 70)
      .attr("xlink:href", d.image);

    d3.select(this)
      .append("circle")
      .attr("cx", width / 2 + d.distance)
      .attr("cy", height / 2 + d.distance)
      .attr("r", 30)
      .style("fill", `url(#${patternId})`)
      .style("stroke", "white")
      .style("stroke-width", 0.1);
  });

  function animatePlanets() {
    planetGroups.each(function (d) {
      d.angle += d.speed * 0.005;
      d3.select(this)
        .select("circle")
        .attr("cx", width / 2 + d.distance * Math.cos(d.angle))
        .attr("cy", height / 2 + d.distance * Math.sin(d.angle));
    });

    requestAnimationFrame(animatePlanets);
  }

  animatePlanets();
}

async function fetchCalendarAPOD(year, month, day) {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${year}-${month}-${day}`
  );
  const data = await response.json();
  return data;
}

function calculateWordFrequencies(words) {
  const frequencies = {};
  words.forEach((word) => {
    frequencies[word] = (frequencies[word] || 0) + 1;
  });
  return frequencies;
}

async function fetchAPODTitlesForYear(year) {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-05-30`;

  const excludedWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "of",
    "with",
    "at",
    "by",
    "in",
    "from",
  ];

  const wordFrequencyMap = new Map();

  try {
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
    const apiUrl = "https://api.nasa.gov/planetary/apod";

    const requests = [];

    for (
      let currentDateTime = startDateTime;
      currentDateTime <= endDateTime;
      currentDateTime += 86400000
    ) {
      const currentDate = new Date(currentDateTime);
      const formattedDate = currentDate.toISOString().split("T")[0];

      const request = fetch(`${apiUrl}?api_key=${apiKey}&date=${formattedDate}`)
        .then((response) => response.json())
        .then((apodData) => {
          if (apodData.title) {
            const words = apodData.title.toLowerCase().split(/\s+/);

            words.forEach((word) => {
              const cleanedWord = word.replace(
                /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                ""
              );
              if (
                cleanedWord.length > 0 &&
                !excludedWords.includes(cleanedWord)
              ) {
                const count = wordFrequencyMap.get(cleanedWord) || 0;
                wordFrequencyMap.set(cleanedWord, count + 1);
              }
            });
          }
        })
        .catch((error) =>
          console.error(
            `Error fetching APOD titles for ${formattedDate}:`,
            error
          )
        );

      requests.push(request);
    }

    await Promise.all(requests);
  } catch (error) {
    console.error("Error fetching APOD titles:", error);
  }

  return wordFrequencyMap;
}

function getTopWords(wordFrequencyMap, topN) {
  const sortedWords = [...wordFrequencyMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sortedWords;
}

function createPieChart(containerId, data) {
  let width = 500;
  let height = 500;
  let radius = Math.min(width, height) / 2;

  const svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie().value((d) => d.value);

  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = svg
    .selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d) => `${d.data.label} (${d.data.value})`);
}

async function displayPieChart() {
  try {
    const wordFrequencyMap = await fetchAPODTitlesForYear(2023);
    const topWords = getTopWords(wordFrequencyMap, 5);

    console.log("Top 5 words and their occurrences:");
    topWords.forEach(([word, count]) => {
      console.log(`${word}: ${count}`);
    });

    const topWordsData = topWords.map(([label, value]) => ({ label, value }));
    createPieChart("pie-chart-container", topWordsData);
  } catch (error) {
    console.error(
      "Error fetching APOD titles and displaying pie chart:",
      error
    );
  }
}

async function postcardapod() {
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    d3.select("#front").style("background-image", `url(${data.url})`);

    d3.select("#back")
      .style("background-image", `url(${data.url})`)
      .html(
        `<p>Title: ${data.title}</p><p>Date: ${data.date}</p><p>From: Sihle</p>`
      );
  } catch (error) {
    console.error("Error fetching APOD:", error);
  }
}

drawBarGraph();
getTopWordsFromPreviousMonth();
postcardapod();
displayPieChart();
const calendarContainer = document.getElementById("calendar-container");
drawCalendar(calendarContainer, new Date());
createSolarSystem();

window.addEventListener("resize", adjustSectionSize);

function adjustSectionSize() {
  const sectionElement = document.querySelector(".section");
  const screenWidth = window.innerWidth;

  if (screenWidth <= 600) {
    sectionElement.style.width = "100%";
  } else if (screenWidth <= 480) {
    sectionElement.style.width = "80%";
  } else if (screenWidth <= 320) {
    sectionElement.style.width = "60%";
  } else {
    sectionElement.style.width = "90%";
  }
}
