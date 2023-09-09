async function fetchAPODs() {
  const apiKey = "8yTheQIGpatO25KHaczru6p8jd3Z2HlAU0InUaKD";
  const tbody = d3.select("tbody");
  const isToday = new Date().toISOString().split("T")[0];

  for (let day = 1; day <= 30; day++) {
    const date = `2023-09-${day}`;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.date && data.title && data.url) {
        const { date, title, url, hdurl } = data;

        const row = tbody.append("tr");
        const dateCol = row.append("td");

        if (date === isToday) {
          dateCol.text(date + " (Today's APOD)");
          dateCol.classed("today-indicator", true);
        } else {
          dateCol.text(date);
        }

        row.append("td").text(title);
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
    }
  }
}

fetchAPODs();
