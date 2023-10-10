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

const currentMonth = new Date().getMonth();
const currentMonthName = monthNames[currentMonth];

const ignore = ["a", "an", "the", "and", "of", "in"];

async function fetchAPODs() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const titles = [];

  for (let day = 1; day <= 30; day++) {
    const date = `2023-${currentMonth + 1}-${day}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.date && data.title && data.url) {
        const { title, copyright } = data;
        titles.push(title);
      } else {
        console.warn(`Skipping day ${day} - Incomplete data`);
        continue;
      }
    } catch (error) {
      console.error(`Error fetching data for ${date}: ${error}`);
      continue;
    }
  }

  const topWords = calculateTopWords(titles);

  createGraph(topWords);
  createCalendar(currentMonth, currentMonthName);

  const topWords2023 = calculateTopWords2023(titles);
  createLineGraph(topWords2023);
}

function createGraph(topWords) {
  const margin = { top: 80, right: 80, bottom: 100, left: 100 };
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
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "white")
    .classed("underline", true)
    .text(`Top 5 Most Common Words for the ${currentMonthName} 2023 APOD`);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 30)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Word");

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Frequency");
}

function calculateTopWords(titles) {
  const wordCount = {};

  titles.forEach((title) => {
    const words = title
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
      .toLowerCase()
      .split(/\s+/);

    words.forEach((word) => {
      if (!ignore.includes(word)) {
        if (wordCount[word]) {
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
        }
      }
    });
  });

  const wordCountArray = Object.entries(wordCount).map(([word, count]) => ({
    word,
    count,
  }));

  wordCountArray.sort((a, b) => b.count - a.count);

  const topWords = wordCountArray.slice(0, 5);

  return topWords;
}

function createCalendar(currentMonth, currentMonthName) {
  const margin = { top: 80, right: 80, bottom: 100, left: 100 };
  const width = 1100 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const calendarContainer = d3
    .select("#calendar")
    .append("div")
    .attr("class", "calendar-container")
    .style("background-color", "white")
    .style("border-radius", "10px")
    .style("overflow", "hidden");

  const calendarHeader = calendarContainer
    .append("h2")
    .text(`APODs for ${currentMonthName} 2023`)
    .style("color", "white")
    .style("margin", "0")
    .style("padding", "20px");

  const daysInMonth = new Date(
    new Date().getFullYear(),
    currentMonth + 1,
    0
  ).getDate();

  const calendarTable = calendarContainer
    .append("table")
    .style("width", width + "px")
    .style("height", height + "px")
    .style("border-collapse", "collapse");

  const calendarBody = calendarTable.append("tbody");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const headerRow = calendarBody.append("tr");

  daysOfWeek.forEach((day) => {
    headerRow
      .append("th")
      .text(day)
      .style("background-color", "white")
      .style("color", "black")
      .style("padding", "8px")
      .style("border", "1px solid black");
  });

  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    const row = calendarBody.append("tr");
    for (let j = 0; j < 7; j++) {
      if (dayCounter <= daysInMonth) {
        if (
          i === 0 &&
          j < new Date(new Date().getFullYear(), currentMonth, 1).getDay()
        ) {
          row
            .append("td")
            .text("")
            .style("padding", "8px")
            .style("border", "1px solid black")
            .style("background-color", "white");
        } else {
          row
            .append("td")
            .text(dayCounter)
            .style("padding", "8px")
            .style("border", "1px solid black")
            .style("background-color", "white")
            .style("color", "black")
            .classed(
              "current-day",
              dayCounter === new Date().getDate() &&
                currentMonth === new Date().getMonth()
            );
          dayCounter++;
        }
      } else {
        row
          .append("td")
          .text("")
          .style("padding", "8px")
          .style("border", "1px solid black")
          .style("background-color", "white");
      }
    }
  }
}

function calculateTopWords2023(titles) {
  const wordCount = {};

  titles.forEach((title) => {
    const words = title
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
      .toLowerCase()
      .split(/\s+/);

    words.forEach((word) => {
      if (!ignore.includes(word)) {
        if (wordCount[word]) {
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
        }
      }
    });
  });

  const wordCountArray = Object.entries(wordCount).map(([word, count]) => ({
    word,
    count,
  }));

  wordCountArray.sort((a, b) => b.count - a.count);

  const topWords2023 = wordCountArray.slice(0, 10);

  return topWords2023;
}

function createLineGraph(topWords2023) {
  const width = 1000;
  const height = 600;
  const padding = 80;

  const svg = d3
    .select("#line-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const maxCount = d3.max(topWords2023, (d) => d.count);

  const xScale = d3
    .scalePoint()
    .domain(topWords2023.map((d) => d.word))
    .range([padding, width - padding])
    .padding(0.5);

  const yScale = d3
    .scaleLinear()
    .domain([0, 8])
    .range([height - padding, padding]);

  const line = d3
    .line()
    .x((d) => xScale(d.word))
    .y((d) => yScale(d.count))
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .datum(topWords2023)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line);

  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .attr("dy", "1em");

  const yAxis = d3.axisLeft(yScale).ticks(8);
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .selectAll("circle")
    .data(topWords2023)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.word))
    .attr("cy", (d) => yScale(d.count))
    .attr("r", 5)
    .style("fill", "red");

  svg
    .selectAll("text")
    .data(topWords2023)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.word))
    .attr("y", (d) => yScale(d.count) - 15)
    .text((d) => `${d.word} (${d.count})`)
    .style("fill", "white")
    .style("font-size", "12px")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Words");

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", padding - 40)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("font-size", "14px")
    .style("fill", "white")
    .text("Count");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

fetchAPODs();
