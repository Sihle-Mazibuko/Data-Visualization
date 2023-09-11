async function fetchAPODs() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const tbody = d3.select("tbody");
  const isToday = new Date().toISOString().split("T")[0];
  const titles = [];

  for (let day = 1; day <= 30; day++) {
    const date = `2023-09-${day}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.date && data.title && data.url) {
        const { date, title, url, hdurl, copyright } = data;

        titles.push(title);

        const row = tbody.append("tr");
        const dateCol = row.append("td");

        if (date === isToday) {
          dateCol.text(date + " (Today's APOD)");
          dateCol.classed("today-indicator", true);
        } else {
          dateCol.text(date);
        }

        row.append("td").html(`${title}<br>(${copyright})`);

        const imgUrlCol = row.append("td");
        imgUrlCol
          .append("a")
          .attr("href", url)
          .attr("target", "_blank")
          .text("View Image URL");

        if (hdurl) {
          imgUrlCol.append("br");
          imgUrlCol
            .append("a")
            .attr("href", hdurl)
            .attr("target", "_blank")
            .text("View HD URL");
        }
      }
    } catch (error) {
      console.error(`Error fetching data for ${date}: ${error}`);
      continue;
    }
  }

  //Title checker
  const titlesWords = titles.join(" ");

  const plainWords = titlesWords
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
    .toLowerCase();

  const words = plainWords.split(/\s+/);

  const ignore = ["a", "an", "the"];

  const wordCount = {};

  words.forEach((word) => {
    if (!ignore.includes(word)) {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    }
  });

  const wordCountArray = Object.entries(wordCount).map(([word, count]) => ({
    word,
    count,
  }));

  wordCountArray.sort((a, b) => b.count - a.count);

  const topWords = wordCountArray.slice(0, 5);

  //Bar-graph
  const margin = { top: 40, right: 30, bottom: 40, left: 60 }; // Adjust left margin for longer labels
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

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale).ticks(10)); // Show whole numbers up to 10

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
    .text("Top 5 Most Common Words in the September 2023 APOD");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
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

fetchAPODs();
