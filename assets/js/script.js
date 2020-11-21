//Main Variables
var main = $(".card-body");
var cityhistory = [];
 
//Var for Wheater Items for City 
var item = function () {
   var citystored = JSON.parse(localStorage.getItem("cityhistory"));
   if (citystored !== null) {
     cityhistory = citystored;
     for(var i=0;i<cityhistory.length;i++) {
         if(i==8){
             break;
         }
       //  creates links/buttons https://getbootstrap.com/docs/4.0/components/list-group/
       citylist = $("<a>").attr({
         class: "list-group-item list-group-item-action",
         href: "#",
         "data-btn-num": i
       });
         // appends history as a button below the search field
         citylist.text(cityhistory[i]);
         $(".list-group").append(citylist);      
     }
   }
};

// Save City Name to LocalStorage 
var savecity = function(city){
    var inArray = cityhistory.includes(city);
    if(!inArray && city !==""){
        cityhistory.push(city);
        localStorage.setItem("cityhistory", JSON.stringify(cityhistory));
        var citylist = $("<a>").attr(
            {
                class:"list-group-item list-group-item-action",
                href: "#",
                "data-btn-num": cityhistory.length
            }
        );
        citylist.text(city);
        $(".list-group").append(citylist);

    }
};

// Funtions
// Data Funtion
function getdata(city) {
  var isError=false;
      main.empty();
  $("#weeklyForecast").empty();
  if(!city){
      return;
  }
var weatherQueryApiUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&units=imperial&appid=c2c2d29dc318edf1d5964398941833dd";
fetch(weatherQueryApiUrl)
  .then(function (response) {
      return response.json();
  })
  .then(function (response) {
      if(response.cod !== 200){
          alert("City Not Found!");
          $("#city").val("");
          isError=true;
          getlocation();
          return;
      }
      if(!isError){
          savecity(city);
      }
  
    var date = moment().format(" MM/DD/YYYY");
    var weathericon = response.weather[0].icon;
    var urlicon = "http://openweathermap.org/img/w/" + weathericon + ".png";
    var cityname = $("<h3>").html(city + date);
    main.prepend(cityname);
    main.append($("<img>").attr("src", urlicon));
    var temp = Math.ceil(response.main.temp);
    main.append($("<p>").html("Temperature: " + temp + " &#8457"));
    var feelsliketemp = Math.ceil(response.main.feels_like);
    main.append($("<p>").html("Feels Like: " + feelsliketemp));
    var humidity = response.main.humidity + "&#37;";
    main.append($("<p>").html("Humidity: " + humidity));
    var windspeed = response.wind.speed;
    main.append($("<p>").html("Wind Speed: " + windspeed + " MPH"));

    //Get UV Index from Weather API
    var fullweatherurl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      response.coord.lat +
      "&lon=" +
      response.coord.lon +
      "&exclude=minutely,hourly&units=imperial&appid=c2c2d29dc318edf1d5964398941833dd";
    return fetch(fullweatherurl)
      .then(function (urlresponse) {
        return urlresponse.json();
      })
      .then(function (urlresponse) {
        main.append(
          $("<p>").html(
            "UV Index: <span>" + urlresponse.current.uvi + "</span>"
          )
        );
        /* Set UV Priority Warning */
        if (urlresponse.current.uvi <= 2) {
          $("span").attr("class", "btn btn-success");
        } else if (
          urlresponse.current.uvi > 2 &&
          urlresponse.current.uvi <= 7
        ) {
          $("span").attr("class", "btn btn-warning");
        } else {
          $("span").attr("class", "btn btn-danger");
        }

        /* Get 5 Day Forecast From Weather API */
        for (var i = 1; i < 6; i++) {
          var newcard = $("<div>").attr(
            "class",
            "col fiveDay bg-secondary text-white rounded-lg p-2"
          );
          $("#weeklyForecast").append(newcard);
          var myDate = new Date(
            urlresponse.daily[i].dt * 1000
          ).toLocaleDateString("en-US");
          /* Display Date */
          newcard.append($("<h4>").html(myDate));
          var iconCode = urlresponse.daily[i].weather[0].icon;
          var urlicon =
            "http://openweathermap.org/img/w/" + iconCode + ".png";
          newcard.append($("<img>").attr("src", urlicon));
          var temp = Math.ceil(urlresponse.daily[i].temp["day"]);
          newcard.append($("<p>").html("Temp: " + temp + " &#8457"));
          var humidity = urlresponse.daily[i].humidity;
          newcard.append($("<p>").html("Humidity: " + humidity));
        }
      });
  });
}

// Geo-Location Function
function getlocation() {
 if (navigator.geolocation) {
   navigator.geolocation.getcurrentposition(showposition);
 } else { 
   console.log("Geolocation is not supported by this browser.");
 }
}

// Position Function
function showposition(position) {
 fetch("https://geolocation-db.com/json/09ba3820-0f88-11eb-9ba6-e1dd7dece2b8")
     .then(function(response){
         return response.json();
     })
     .then(function(response){
         getdata(response.city);
         $("#city").val(response.city);
         savecity(response.city);
     });
}

//Search Button
$("#citysearch").on("click",function(){
  var city=$("#city").val(); 
  getdata(city);
  $("#city").val("");
});

// History List
$(".list-group").on("click",function(e){
 var callcity = e.target.innerHTML;
 $("#city").val(callcity);
 getdata(callcity);

});

 
item();
 