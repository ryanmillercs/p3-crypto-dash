

// Search form functionality
const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target);
  // console.log(formData)
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}, ${pair[1]}`);
  // }
  // Gets the value that was input into the search box.
  const queryText = formData.get("query");
  console.log("queryText", queryText);


  // Gets the coins from the API.
  const coinsResultsPromise = getCoins(queryText);
  // Filter results first by word.
  addCoinsToDOM(coinsResultsPromise, "coin-results")
  // Adds every coin returned from API to the side bar
  const coinsOnSide = document.getElementById("coins-side");
  coinsOnSide.innerHTML = "";
  coinsResultsPromise.then((coinResults) => {
    const coinArray = coinResults.data.filter((coin) => {
      // console.log(coin.name);
      // Create the coin DOM element and add it to the search results if it matches the query.
      const coinLI = document.createElement("li");
      coinLI.textContent = coin.name;
      coinsOnSide.appendChild(coinLI);
      if (coin.name.toLowerCase().includes(queryText.toLowerCase())) {
        return true;
      }
    });
    // console.log(coinArray);
    const coinListItemsArray = coinArray.map(coinObj2DOMObj);
    // console.log("coinListItemsArray", coinListItemsArray);
    const coinResultsUL = document.getElementById("coin-results");
    coinResultsUL.style.display = "flex";
    coinResultsUL.innerHTML = "";
    const resultsTitle = document.createElement("p");
    resultsTitle.className = "lead";
    resultsTitle.textContent = "Search Results";
    coinResultsUL.appendChild(resultsTitle);
    console.log(resultsTitle);
    // Adds each coin to the results list / DOM.
    coinListItemsArray.forEach((coinLi) => {
      coinResultsUL.appendChild(coinLi);
    });
  });
};


const getCoins = (coin) => {
  // Gets the coins from the API.
  console.log("attempting to get asssets for", coin);
  return fetch(
    `https://api.coincap.io/v2/assets`
  ).then((resp) => resp.json());
};

const coinObj2DOMObj = (coinObj) => {
  // changePercent24Hr "0.4709830922410479"
  // explorer "https://blockchain.info/"
  // id "bitcoin"
  // marketCapUsd "565041482906.6948740707615900"
  // maxSupply "21000000.0000000000000000"
  // name "Bitcoin"
  // priceUsd "29188.3261933956509524"
  // rank "1"
  // supply "19358475.0000000000000000"
  // symbol "BTC"
  // volumeUsd24Hr "7375136562.7940626523911917"
  // vwap24Hr "29398.8929452607070614"
  const coinDivItem = document.createElement("div");
  addInformation(coinDivItem, coinObj);
  return coinDivItem;
};

// Searches for the clicked on coin in the News API.
const searchForCoin = (ev) => {
  const coin = ev.target.textContent;
  console.log("search for", coin);
  let url = 'https://api.currentsapi.services/v1/search?' +
    `keywords=${coin}&language=en&` +
    'apiKey=JbcZt2Z_lrDwogBYEGuslToIdW--_cjcNpeGZvnPOPMRQ_Nr';
  let req = new Request(url);
  return fetch(req).then((r) =>
    r.json()
  ).then((newsResultsObj) => {
    console.log(newsResultsObj);
    // console.log(newsResultsObj.hasOwnProperty('results'))
    const newsArticlesArray = newsResultsObj.news.map(newsObj2DOMObj)
    console.log("newsArticlesArray", newsArticlesArray);
    // Display the news filter and results
    newsFilter.style.display = "block";
    const newsResultsElem = document.getElementById("search-results");
    newsResultsElem.style.display = "flex";
    newsResultsElem.innerHTML = "";
    newsArticlesArray.forEach(coin => newsResultsElem.appendChild(coin))
  })
};

// Adds the news articles about the coin to the DOM
const newsObj2DOMObj = (coinObj) => {

  const coinCardDiv = document.createElement("div");
  coinCardDiv.classList.add("card");

  const coinCardBody = document.createElement("div");
  coinCardBody.classList.add("card-body");

  const titleElem = document.createElement("h5");
  titleElem.textContent = coinObj.title;
  coinCardBody.appendChild(titleElem);
  const newsInfo = document.createElement("p");
  newsInfo.textContent = `Description: ${coinObj.description}`;
  coinCardBody.appendChild(newsInfo);
  const newsDate = document.createElement("p");
  newsDate.textContent = `Date Published: ${coinObj.published}`;
  coinCardBody.appendChild(newsDate);
  const newsURL = document.createElement("a");
  newsURL.textContent = "Read More";
  console.log(newsURL.title);
  newsURL.href = `${coinObj.url}`;
  console.log(coinObj.url);
  coinCardBody.appendChild(newsURL);

  // Ensures there is no image errors
  if (coinObj.image != "None") {
    const newsImg = document.createElement("img");
    newsImg.height = 100;
    newsImg.width = 100;
    newsImg.src = `${coinObj.image}`;
    coinCardBody.appendChild(newsImg);
  }

  coinCardDiv.appendChild(coinCardBody)
  return coinCardDiv

};


//Initial Setup For top 10 coins
function setupCoins() {
  const initialCoinsPromise = fetch(
    `https://api.coincap.io/v2/assets`
  ).then((resp) => resp.json());
  addCoinsToDOM(initialCoinsPromise, "coins")
}

//Function to add the recieved coins to DOM;
function addCoinsToDOM(promise, DOMElement) {
  promise.then((coinResults) => {
    // Only get the top 10 coins
    const coinArray = coinResults.data.slice(0, 10)
    // console.log(coinArray);
    // Convert each coin object to a DOM object
    const coinListItemsArray = coinArray.map(coinObj2DOMObj);
    // console.log("coinListItemsArray", coinListItemsArray);
    const coinResultsUL = document.getElementById(DOMElement);
    coinListItemsArray.forEach((coinLi) => {
      coinResultsUL.appendChild(coinLi);
    });
  });
}

// Adds information for each coin
function addInformation(element, jsonInformation) {
  const coinButton = document.createElement("button");
  const coinPrice = document.createElement("p");
  const coinRank = document.createElement("p");
  const coinSymbol = document.createElement("p");
  const coinSupply = document.createElement("p");

  // Retrieves the information from the JSON format
  element.classList.add('coin')
  coinButton.classList.add('coin-btn')
  coinButton.classList.add('btn-info')
  coinButton.textContent = jsonInformation.name;
  coinPrice.innerHTML = `Price: $${parseFloat(jsonInformation.priceUsd).toFixed(3)}`
  coinRank.innerHTML = `Rank: ${jsonInformation.rank}`
  coinSymbol.innerHTML = `Symbol: ${jsonInformation.symbol}`
  coinSupply.innerHTML = `Supply: ${parseFloat(jsonInformation.supply).toFixed(3)}`

  // console.log(typeof jsonInformation.priceUsd)
  // Appends each of the fields to the element
  coinButton.onclick = searchForCoin;
  element.appendChild(coinButton);
  element.appendChild(coinSymbol);
  element.appendChild(coinRank);
  element.appendChild(coinPrice);
  element.appendChild(coinSupply);
}

setupCoins();

// Add Filter functionality to the news search
const newsFilter = document.getElementById("news-filter");
newsFilter.addEventListener("change", (ev) => {
  const filterValue = ev.target.value;
  console.log(filterValue);
  // Get all of the search results so that they can be manipulated
  const filterSearch = document.getElementById("filter-container");
  const newsResultsElem = document.getElementById("search-results");
  const newsArticles = newsResultsElem.querySelectorAll(".card");

  // Switch on Date, Day, Week, Month, and Custom
  switch (filterValue) {
    case "day":
      // Get the date from the article
      newsArticles.forEach((newsArticle) => {
        const newsDate = newsArticle.querySelector("p:nth-child(3)").textContent;
        // Convert the date String into a Date object
        const date = new Date(newsDate);
        const day = date.getDate();

        const currentDay = new Date().getDate();
        if (day !== currentDay) newsArticle.style.display = "none";
        else newsArticle.style.display = "flex";
      });
      break;
    case "week":
      newsArticles.forEach((newsArticle) => {
        const newsDate = newsArticle.querySelector("p:nth-child(3)").textContent;
        // Convert the date String into a Date object
        const date = new Date(newsDate);
        const day = date.getDate();

        const currentDay = new Date().getDate();
        // Checks if the article is greater than 7 days old
        if (currentDay - day > 7) newsArticle.style.display = "none";
        else newsArticle.style.display = "flex";
      }); break;
    case "month":
      newsArticles.forEach((newsArticle) => {
        const newsDate = newsArticle.querySelector("p:nth-child(3)").textContent;
        // Convert the date String into a Date object
        const date = new Date(newsDate);
        const month = date.getMonth();

        console.log(month);
        // Gets the current month from the current date
        const currentMonth = new Date().getMonth();
        if (month !== currentMonth) newsArticle.style.display = "none";
        else newsArticle.style.display = "flex";
      }); break;
    case "custom":
      // Display the filter search
      filterSearch.style.display = "flex";
      filterSearch.onsubmit = (ev) => {
        ev.preventDefault();
        // https://stackoverflow.com/a/26892365/1449799
        const formData = new FormData(ev.target);
        const queryText = formData.get("query");
        // Filter News Articles
        newsArticles.forEach((newsArticle) => {
          if (!newsArticle.textContent.toLowerCase().includes(queryText.toLowerCase()))
            newsArticle.style.display = "none";
          else newsArticle.style.display = "flex";
        });
      };
    default:
      // Reset the display of all news articles
      newsArticles.forEach((newsArticle) => {
        newsArticle.style.display = "flex";
      });
      break;
  }
});
