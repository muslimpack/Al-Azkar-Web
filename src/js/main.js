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

function decrementCount(itemId) {
  const item = findContentItem(itemId);
  if (item) {
    if (item.count > 0) {
      item.count--;
      updateCount(itemId, item.count);
    }
  }
}
// Function to find the content item by its ID
function findContentItem(itemId) {
  return titleContent.find((item) => item.id === itemId);
}

// Function to update the count in the DOM
function updateCount(itemId, count) {
  const countElement = document.querySelector(`#item-${itemId} .count`);
  if (countElement) {
    countElement.textContent = count;
  }
}
// Function to generate content for a given title ID
function generateContent(title, data) {
  const { contents } = data;
  // Find content related to the selected titleId
  const titleContent = contents.filter((item) => item.titleId === title.id);

  // Construct the HTML for content
  const contentHTML = titleContent
    .map((item) => {
      const fadlElement = item.fadl ? `<p class="source">${item.fadl}</p>` : "";
      const sourceElement = item.source
        ? `<p class="source">${item.source}</p>`
        : "";

      return `
<div class="content-item" onclick="decrementCount(${item.id})">
    <div class="content-card">
      <div class="header">
      <span class="count">${item.count}</span>
        <p class="content-body">${item.body}</p>
      </div>
        ${fadlElement}
        ${sourceElement}
    </div>
</div>
    `;
    })
    .join("");

  const backButton = `
    <div class="content-header"">
      <div class="title">
          ${title.name}
      </div>
      <div class="back-button" onclick="loadTitles()">
          العودة
      </div>
    </div>
    `;

  // Display the content
  document.querySelector("main").innerHTML = backButton + contentHTML;
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
    titleCard.addEventListener("click", () => loadContent(title, data));
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
function loadContent(title, data) {
  generateContent(title, data);
}

function loadTitles() {
  loadJSONData().then((data) => {
    createTitleCards(data);
  });
}
