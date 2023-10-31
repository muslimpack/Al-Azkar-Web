// Function to load titles and contents from JSON files
async function loadJSONData() {
  try {
    // Load titles.json and contents.json
    const [titlesResponse, contentsResponse] = await Promise.all([
      fetch("./data/titles.json"), // Update the path to your titles.json
      fetch("./data/contents.json"), // Update the path to your contents.json
    ]);

    if (!titlesResponse.ok || !contentsResponse.ok) {
      throw new Error("Failed to load JSON data.");
    }

    // Parse JSON data
    const titlesData = await titlesResponse.json();
    const contentsData = await contentsResponse.json();

    return { titles: titlesData, contents: contentsData };
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

// Function to generate content for a given title ID
function generateContent(titleId, data) {
  const { contents } = data;
  // Find content related to the selected titleId
  const titleContent = contents.filter((item) => item.titleId === titleId);

  // Construct the HTML for content
  const contentHTML = titleContent
    .map(
      (item) => `
        <div class="content-item">
            <p>${item.body}</p>
            <p><strong>Source:</strong> ${item.source}</p>
        </div>
    `
    )
    .join("");

  // Display the content
  document.querySelector("main").innerHTML = contentHTML;
}

// Function to create title cards
function createTitleCards(data) {
  const { titles } = data;

  // Create a container for title cards
  const titleCardsContainer = document.createElement("div");
  titleCardsContainer.classList.add("title-cards-container");

  // Construct and append the HTML for title cards
  titles.forEach((title) => {
    const titleCard = document.createElement("div");
    titleCard.classList.add("title-card");

    // Set the title as the title card text
    titleCard.innerHTML = `<h2>${title.name}</h2>`;
    titleCard.addEventListener("click", () => loadContent(title.id, data));
    titleCardsContainer.appendChild(titleCard);
  });

  // Display title cards container
  const main = document.querySelector("main");
  main.innerHTML = ""; // Clear existing content
  main.appendChild(titleCardsContainer);
}

// Initialize by loading JSON data and creating title cards
loadJSONData().then((data) => {
  createTitleCards(data);
});

// Function to load content for a specific title
function loadContent(titleId, data) {
  generateContent(titleId, data);
}
