// The code waits until the document is ready
$(document).ready(function () {
    initializePage();
  });
  
  function initializePage() {
    attachSearchButtonHandlers();
    loadSearchHistory();
  }
  
  function attachSearchButtonHandlers() {
    // Attach click event handler
    $("#search-button").on("click", function () {
      var searchTerm = getAndClearSearchValue();
      displayWeather(searchTerm);
    });
  
    // Attach keypress event handler (enter key)
    $("#search-button").keypress(function (event) {
      var keycode = event.keyCode || event.which;
      if (keycode === 13) {
        var searchTerm = getAndClearSearchValue();
        displayWeather(searchTerm);
      }
    });
  }
  
  function getAndClearSearchValue() {
    var searchTerm = $("#search-value").val();
    $("#search-value").val("");
    return searchTerm;
  }
  
  function displayWeather(searchTerm) {
    weatherFunction(searchTerm);
    weatherForecast(searchTerm);
  }
  
  function loadSearchHistory() {
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
    if (history.length > 0) {
      displayWeather(history[history.length - 1]);
    }
  
    history.forEach(function (searchTerm) {
      createRow(searchTerm);
    });
  
    // Attach click event handler to list items
    $(".history").on("click", "li", function () {
      displayWeather($(this).text());
    });
  }
  