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

async function updateSlide() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const slideshowContainer = document.getElementById("slideshow-container");
  const apodImage = document.getElementById("apod-image");
  const apodTitle = document.getElementById("apod-title");
  const apodDate = document.getElementById("apod-date");

  if (currentDay <= 31) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const date = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.date && data.title && data.url) {
        apodImage.src = data.url;
        apodTitle.textContent = data.title;
        apodDate.textContent = data.date;
        currentDay++;
      } else {
        currentDay = 1;
      }
    } catch (error) {
      console.error(`Error fetching data for ${date}: ${error}`);
    }
  } else {
    currentDay = 1;
  }

  setTimeout(updateSlide, 3000);
}

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

TodaysAPOD();
fetchAPODs();

updateSlide();
