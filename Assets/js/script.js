//in the following function, Jquery will ensure that all elements in the DOM are loaded
//manipulating javascript can cause errors if not properly loaded. When the html document is
//fully loaded "initializePage" will trigger
$(document).ready(function () {//in this line we use $ as the JQuery identifier and document refers to the entire html document
    initializePage();//this function will trigger as soon as the DOM is ready.
  });
  //The following function will set up the search buttons functionality and load any previous saved search history 
  function initializePage() {//
    attachSearchButtonHandlers();//this function call is responsible for attaching events handlers to the search button the page.
    loadSearchHistory();//this function call us responsible for loading the search history from the local storage and displaying
    //it on the page 
  }
  //the following function will attach a click event to the "search-button" and define the result when clicked
  function attachSearchButtonHandlers() {
    $("#search-button").on("click", function () {
      var searchTerm = getAndClearSearchValue();//this line will allow the search for what was inputed in the search field, and the 
      //value will clear once searched.
      displayWeather(searchTerm); //this function is responsible for taking the search term, fetching the corresponding weather 
      //information and displaying the information on the page.
    });
  
    //the following function will initiation of the search by also hitting the enter button
    $("#search-value").keypress(function (event) {
      var keycode = event.keyCode || event.which;
      if (keycode === 13) {
        event.preventDefault(); // prevent the default action form submit in this case 
        var searchTerm = getAndClearSearchValue();
        displayWeather(searchTerm);
      }
    });
  }
  //the following function will fetch the value from the specified element, clear the input, and pass
  // the fetched value to other parts of the code
  function getAndClearSearchValue() {
    var searchTerm = $("#search-value").val();//This line is using jQuery to select an HTML element 
    //with the id of "search-value" and retrieve the current value inside that element.
    $("#search-value").val("");//This line will also use jQuery to select the same HTML element 
    //with the id "search-value", but this time it's setting the value of that element to an empty string ("").
    //clearing the text entered bu the user.
    return searchTerm;//The function then returns the value it previously fetched 
    //from the "#search-value" element allowing the function to pass this value 
    //to wherever the function was called from, so that this information can be used elsewhere in the code.
  }
  //the following function will allow the input of the desired city or location
  //and fetch both current weather and forecast
  function displayWeather(searchTerm) {
    weatherFunction(searchTerm);//will allow the fetching of current weather
    weatherForecast(searchTerm);//will allow the fetching of the forecast
  }
  //the following function will managing of the history in the local storage
  function loadSearchHistory() {
    var history = JSON.parse(localStorage.getItem("history")) || [];//This line retrieves an item called "history" 
    //from the browser's local storage. we add parse to convert it into a JavaScript array.
  
    if (history.length > 0) {
      displayWeather(history[history.length - 1]);//this line will allow the display of the most recent searched term
    }
  
    history.forEach(function (searchTerm) {//This line of code will iterates over each item in the history array 
     // and for each one, it calls the createRow(searchTerm) function. 
     //The createRow() function will then create a new row for each search term.
      createRow(searchTerm);
    });
  
    //The next function attaches a click event handler to each li element within elements with a class of history. 
    //When an li element is clicked, it gets the text within that li element in this case the search term, 
    //and then calls displayWeather() with that text, this will then display the weather for the clicked search term.
    $(".history").on("click", "li", function () {
      displayWeather($(this).text());
    });
  }
  
 //the following function creates a new list item with the class "list-group-item" and the text of the search term,
 // and then adds this new item to the end of the list with the class history. This function will be 
 //used to display a new search term in the search history list on the webpage.
  function createRow(searchTerm) {
    var listItem = $("<li>").addClass("list-group-item").text(searchTerm);
    $(".history").append(listItem);
  }
  
  //The weatherFunction(searchTerm) function makes a call to the OpenWeatherMap API to get current weather data for
  // the location specified by searchTerm. This is done using Asynchronous, JavaScript, and XML (AJAX), this will allow 
  //the web page to be updated asynchronously by exchanging data with a web server behind the scenes. This means it 
  //can update parts of a web page, without reloading the whole page.
  function weatherFunction(searchTerm) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=0159F416728EF1C917DCDA2C6377C923&units=imperial";
   //line 86 will constructs the URL for the API request. It's using the OpenWeatherMap API's endpoint for current 
   //weather data, passing in the searchTerm for the location query, an appid for authentication, and units=imperial
   // to get the data in Fahrenheit and MPH.
    $.ajax({ type: "GET", url: api }).then(function (data) {
     //line 90 sends an asynchronous HTTP (AJAX) request to the server. The type: "GET" specifies that it should 
     //be a GET request, and url: api specifies the URL to send the request to, which is the URL constructed above.   
      updateSearchHistory(searchTerm);
     //line 93 calls updateSearchHistory function passing the searchTerm as 
     //the argument, which adds the searchTerm to the search history.
      renderWeatherData(data);
      //This line calls renderWeatherData function passing the data as the argument, which is responsible 
      //for displaying the returned weather data on the page.
    });
  }
  
  
  function updateSearchHistory(searchTerm) {
    var history = JSON.parse(localStorage.getItem("history")) || [];
    //line 104 will retrieve a previously stored search history from the local storage of the browser. 
  
    if (history.indexOf(searchTerm) === -1) {//This line checks whether the current search term is already present in the history.
    //The indexOf(searchTerm) method returns the index of searchTerm in the history array. If the term is not present in 
    //the array, it returns -1. So if the term is not in the history, the code inside the if-statement is executed.
      history.push(searchTerm);//this line adds the new search term to the end of the history array using the push() method.
      localStorage.setItem("history", JSON.stringify(history));
      //line 111 saves the updated history array back to local storage so it will be available even if the page is reloaded 
      //or closed and reopened later. The "JSON.stringify(history)"" method is used to convert the JavaScript object, the history array
      // into a JSON string, because local storage can only store strings.
      createRow(searchTerm);
      //line 115 calls the createRow(searchTerm) function, which adds the new search term to the search history displayed on the page.
    }
  }
  
  //the following function will allow displaying of weather data on the page.
  function renderWeatherData(data) {
    $("#today").empty();
    //line 122 clears out any content currently in the HTML element with the ID of "today". 
    //The $ is a reference to jQuery, and $("#today") selects the HTML element with the ID "today". 
    //.empty() is a jQuery method that removes all child elements from the selected element(s).
    var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
    //line 127 creates a new HTML h3 element, adds the class "card-title" to it, and sets its text content. 
    //The text content is set to the name property from the data object , this case being the user input, 
    //followed by the current date.
    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
    //line 130 creates a new HTML img element and sets its src attribute to a URL that points to the weather 
    //icon corresponding to the current weather condition, specified by data.weather[0].icon.
    var card = $("<div>").addClass("card");
    //line 133 creates a new HTML div element and adds the class "card" to it.
    var cardBody = $("<div>").addClass("card-body");
    //line 135 does the same as above and adds the class "card-body" to it.
    
    appendWeatherPropertiesToCard(cardBody, data);
   //line 138 will append additional weather details like wind speed, humidity, temperature to the cardBody div.
    
    title.append(img);
    //line 141 adds the image img as a child to the title h3 element.
    cardBody.append(title);
    //line 143 adds the title h3 element, which now contains the weather icon as well to the cardBody div.
    card.append(cardBody);
    //line 145 adds the cardBody div, which now contains the title and weather details to the card div.
    $("#today").append(card);
    //This line adds the card div, which now contains all the weather data, to the HTML element with 
    //the ID "today". This is what ultimately displays the weather data on the web page.
  }
  
  //the following function creates HTML paragraph elements for each of the key weather properties
  //and appends these elements to a given card body element "cardBody".
  function appendWeatherPropertiesToCard(cardBody, data) {
    var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
    //line 155 creates a new HTML paragraph element, adds the class "card-text" to it, and sets its 
    //text content to display the wind speed, which is accessed from the data object's wind.speed property.
    // The speed will then be displayed in miles per hour (MPH).
    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
    //line 159 will also create a paragraph to display the humidity, 
    //accessed from the data object's main.humidity property. humidity will then be displayed as a percentage.
    var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
    //line 162 will also create a paragraph to display the temperature, which is accessed from the 
    //data object's main.temp property. The temperature will then be displayed in degrees Fahrenheit.
    cardBody.append(wind, humidity, temp);
    //line 165 appends the three newly created paragraphs wind, humidity, and temp to the cardBody element.
    //those three properties will then be displayed in the card body on the webpage.
  }
  
  //the following function will request a forecast from the OpenWeatherMap API for the area being searched.
  function weatherForecast(searchTerm) {
    var api = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=0159F416728EF1C917DCDA2C6377C923&units=imperial";
  //This line constructs the URL for the API request. The searchTerm is added to the URL as the query (q) 
  //parameter to specify the location for which the forecast is requested. The appid parameter is the API key,
  // and the units parameter specifies that the temperatures should be returned in Fahrenheit.
    $.ajax({ type: "GET", url: api }).then(function (data) {
      renderForecastData(data);
    });
    //This line sends a GET request to the URL above. When the response is received, the anonymous
    // function within the then() method is called with the response data as its argument.
  }
  
  // the following function will allow the forcast to be displayed on the page
  function renderForecastData(data) {
    $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
    //line 185 will select the HTML element with the ID "forecast" using jQuery's $() function. 
    //It then sets the HTML content of this element to a header "5-Day Forecast:" and appends a div
    // element with the class "row". This prepares the "forecast" section of the webpage to display the forecast data.
  
    data.list.forEach(function (item) {
    //line 190 uses the forEach method to loop over each item in the list array from the data returned 
    //by the API. For each item, it calls the anonymous function passed to forEach.
      if (item.dt_txt.indexOf("15:00:00") !== -1) {
        //Inside the forEach loop, this if statement checks if the dt_txt property
        // of the current item (which represents the date and time of the forecast) contains the string 
        //"15:00:00". This string represents 3pm in 24-hour time. If it does, then the if statement's block is executed.
        // This is done because the data returned by the API includes a forecast for every three hours, and this code is 
        //selecting the forecast for 3pm each day.
        createForecastCard(item);
        //line 199 is responsible for creating a card displaying the forecast for the time specified by the current item.
      }
    });
  }
  
  //the following function creates a card with forecast data for a single time point and appends
  // it to the forecast section of the webpage. 
  function createForecastCard(item) {
    var title = $("<h3>").addClass("card-title").text(new Date(item.dt_txt).toLocaleDateString());
    //line 207 creates a new <h3> HTML element, adds the class "card-title" to it, and sets its text
    // to be the date associated with the item in local format. item.dt_txt is the timestamp of the forecast,
    // which gets converted to a Date object and then to a localized string.
    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png");
    //line 212 creates a new <img> HTML element and sets its src attribute to be the URL of the weather
    // icon associated with the forecast. item.weather[0].icon is the name of the icon for the forecast's weather.
    var card = $("<div>").addClass("card bg-primary text-white");
    //line 215 creates a new <div> HTML element and adds the classes "card", "bg-primary", and "text-white" to it.
    // This will be the card that contains the forecast.
    var cardBody = $("<div>").addClass("card-body p-2");
    //line 218 creates a new <div> HTML element and adds the classes "card-body" and "p-2" to it. This will be the body
    // of the card that contains the forecast data.  
    appendForecastPropertiesToCard(cardBody, item);
    //line 221 will add the forecast data, temperature and humidity to cardBody.
    card.append(cardBody.append(title, img));
    //line 223 first appends title and img to cardBody, then appends cardBody to card. This puts the title, image, and forecast
    // data together in the card.
    $("#forecast .row").append(card);
    //line 226 selects the .row element within the #forecast element and appends the card to it. This displays the card on the
    // webpage in the forecast section.
  }
  //The following function will add the following weather properties to an HTML element representing a card body.
  function appendForecastPropertiesToCard(cardBody, item) {
    var humidity = $("<p>").addClass("card-text").text("Humidity: " + item.main.humidity + "%");
    //line 231 creates a new <p> HTML element, gives it a class of "card-text", and sets its text to display the humidity value 
    //retrieved from the item object in percentage form. "item.main.humidity" will hold the humidity value.
    var temp = $("<p>").addClass("card-text").text("Temperature: " + item.main.temp + " °F");
    //line 235 creates another <p> HTML element, also with the class of "card-text", but this time, 
    //its text displays the temperature value retrieved from the item object in Fahrenheit. item.main.temp will hold the
    //temperature value.
    cardBody.append(humidity, temp);
    //line 239 then appends the two <p> elements humidity and temp to the cardBody HTML element.
  } 