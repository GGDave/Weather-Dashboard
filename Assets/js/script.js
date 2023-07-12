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
  
  
  function weatherFunction(searchTerm) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=0159F416728EF1C917DCDA2C6377C923&units=imperial";
  
    $.ajax({ type: "GET", url: api }).then(function (data) {
      updateSearchHistory(searchTerm);
  
      
      renderWeatherData(data);
    });
  }
  
  
  function updateSearchHistory(searchTerm) {
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
    if (history.indexOf(searchTerm) === -1) {
      history.push(searchTerm);
      localStorage.setItem("history", JSON.stringify(history));
      createRow(searchTerm);
    }
  }
  
  
  function renderWeatherData(data) {
    $("#today").empty();
    
    var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    
    
    appendWeatherPropertiesToCard(cardBody, data);
  
    
    title.append(img);
    cardBody.append(title);
    card.append(cardBody);
    $("#today").append(card);
  }
  
  
  function appendWeatherPropertiesToCard(cardBody, data) {
    var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
    var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
    var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
  
    cardBody.append(wind, humidity, temp);
  }
  
  
  function weatherForecast(searchTerm) {
    var api = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=0159F416728EF1C917DCDA2C6377C923&units=imperial";
  
    $.ajax({ type: "GET", url: api }).then(function (data) {
      renderForecastData(data);
    });
  }
  
  
  function renderForecastData(data) {
    $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
    data.list.forEach(function (item) {
      if (item.dt_txt.indexOf("15:00:00") !== -1) {
        createForecastCard(item);
      }
    });
  }
  
  
  function createForecastCard(item) {
    var title = $("<h3>").addClass("card-title").text(new Date(item.dt_txt).toLocaleDateString());
    var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png");
    var card = $("<div>").addClass("card bg-primary text-white");
    var cardBody = $("<div>").addClass("card-body p-2");
  
    
    appendForecastPropertiesToCard(cardBody, item);
  
    
    card.append(cardBody.append(title, img));
    $("#forecast .row").append(card);
  }
  
  
  function appendForecastPropertiesToCard(cardBody, item) {
    var humidity = $("<p>").addClass("card-text").text("Humidity: " + item.main.humidity + "%");
    var temp = $("<p>").addClass("card-text").text("Temperature: " + item.main.temp + " °F");
  
    cardBody.append(humidity, temp);
  } 