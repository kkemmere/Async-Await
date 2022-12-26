const apiKey = config.SECRET_API_KEY;
const API_URL = config.MY_API_TOKEN + apiKey;
const main = document.querySelector("main");

// Must use a polyfill for older browsers if using asnyc/await.
// To be backwards compatible you can use babel to convert your async/await function to promises

const locations = ["Minnesota", "Minneapolis"];

// Ajax request to get data. If status request is 200 OK send data to our DOM else call badData function
export const getData = (API_URL) => {
  return new Promise((result, rej) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", API_URL);
    httpRequest.onload = () => {
      {
        httpRequest.status === 200
          ? result(httpRequest.responseText)
          : // Error obj
            rej(Error(httpRequest.status));
      }
    };

    httpRequest.onerror = () => {
      rej(Error("Network Error"));
    };

    httpRequest.send();
  });
};

const badData = (status) => {
  console.log("API call failed with status code:", status);
};
const tempToF = (kelvin) => {
  return Math.round((kelvin - 273.15) * 1.8 + 32);
};

const dataArticle = (data) => {
  const dataObj = JSON.parse(data);

  const weatherArticle = document.createElement("article");
  weatherArticle.classList.add("weather");

  weatherArticle.innerHTML = `
    <h2>${dataObj.name}</h2>
    <img src="http://openweathermap.org/img/w/${
      dataObj.weather[0].icon
    }.png" alt="${dataObj.weather[0].description}" width="50" height="50"/>
    <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | ${
    dataObj.weather[0].description
  }
    `;

  main.append(weatherArticle);
};

const urls = locations.map((location) => {
  return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
});

// Now using an Async/Await function that is immediately called to map each return from api fetch
// to our dataArticle() function

(async function () {
  try {
    let responses = [];
    // All await statements run in parallel
    responses.push(await getData(urls[0]));
    responses.push(await getData(urls[1]));
    // Below await statement only runs once we get data from each await statement
    responses.map((result) => {
      dataArticle(result);
    });
  } catch (status) {
    badData(status);
  }
  // Can also put finally() here.
})();

// Using the promise. Successful promise is passsed to dataArticle(). Failed promise is passed to badData()
// Promise.all([getData(urls[1]), getData(urls[0])])
//   .then((results) => {
//     return results.map((result) => {
//       dataArticle(result);
//     });
//   })
//   .catch((status) => {
//     badData(status);
//   });
// // can have .finally() here
