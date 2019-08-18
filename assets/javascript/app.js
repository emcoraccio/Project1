$(document).ready(function () {

  // weather variables
  let userZip = localStorage.getItem("Location");
  let weatherData,
    cityName,
    temp,
    weather,
    weatherIcon,
    forecast,
    tempCond,
    timeOfDay,
    search,
    playlists,
    icon,
    userGenre,
    userMood,
    bgImage;

  let currentTime = moment();
  let morningStart = moment("4:00", "HH:mm");
  let dayStart = moment("10:30", "HH:mm");
  let nightStart = moment("19:00", "HH:mm");

  $("#weather-data").hide();
  $(".helper-text").hide();
  $("#zipcode").focus();

  let bgImageArray = [

    "./assets/images/wmprecip.jpg", "./assets/images/wmcloudy.jpg", "./assets/images/wmclear.jpg",
    "./assets/images/wdprecip.jpg", "./assets/images/wdcloudy.jpg", "./assets/images/wdclear.jpg",
    "./assets/images/weprecip.jpg", "./assets/images/wecloudy.jpg", "./assets/images/weclear.jpg",
    "./assets/images/cmprecip.jpg", "./assets/images/cmcloudy.jpg", "./assets/images/cmclear.jpg",
    "./assets/images/cdprecip.jpg", "./assets/images/cdcloudy.jpg", "./assets/images/cdclear.jpg",
    "./assets/images/ceprecip.jpg", "./assets/images/cecloudy.jpg", "./assets/images/ceclear.jpg"

  ];

  bgImageArray.forEach(function (img) {

    new Image().src = img;

  });

  let conditions = {

    warm: {

      morning: {

        precip: {

          search: "cozy",
          background: `${bgImageArray[0]}`

        },

        cloudy: {

          search: "summer,acoustic",
          background: `${bgImageArray[1]}`
        },

        clear: {

          search: "chill,summer",
          background: `${bgImageArray[2]}`

        }

      },

      day: {

        precip: {

          search: "chill,summer",
          background: `${bgImageArray[3]}`

        },

        cloudy: {

          search: "happy",
          background: `${bgImageArray[4]}`

        },

        clear: {

          search: "summer",
          background: `${bgImageArray[5]}`

        }

      },

      evening: {

        precip: {

          search: "summer,acoustic",
          background: `${bgImageArray[6]}`

        },

        cloudy: {

          search: "summer,night",
          background: `${bgImageArray[7]}`

        },

        clear: {

          search: "summer,night",
          background: `${bgImageArray[8]}`

        }

      }

    },

    cold: {

      morning: {

        precip: {

          search: "chill,morning",
          background: `${bgImageArray[9]}`

        },

        cloudy: {

          search: "cold,morning",
          background: `${bgImageArray[10]}`

        },

        clear: {

          search: "coffee,cozy",
          background: `${bgImageArray[11]}`

        }

      },

      day: {

        precip: {

          search: "winter,chill",
          background: `${bgImageArray[12]}`

        },

        cloudy: {

          search: "chill",
          background: `${bgImageArray[13]}`

        },

        clear: {

          search: "chill,hits",
          background: `${bgImageArray[14]}`

        }

      },

      evening: {

        precip: {

          search: "evening",
          background: `${bgImageArray[15]}`

        },

        cloudy: {

          search: "evening,cozy",
          background: `${bgImageArray[16]}`

        },
        clear: {

          search: "chill",
          background: `${bgImageArray[17]}`

        }

      }

    }

  }

  let changeBG = function () {

    $("body").css({
      "background": `url(${conditions[tempCond][timeOfDay][forecast].background}) no-repeat center center fixed`,
      "background-size": "cover"
    });

  }

  // Toggle Animated Icons Div Visible/Invisible
  let togglevisibility = function (selector) {
    if ($(selector).hasClass("hide")) {
      $(selector).removeClass("hide");
      // console.log("We are hidden.");
    }
    else {
      $(selector).addClass("hide");
    }
  }

  // TIME SECTION
  if (currentTime.isBetween(morningStart, dayStart)) {

    timeOfDay = "morning";

  } else if (currentTime.isBetween(dayStart, nightStart)) {

    timeOfDay = "day";

  } else {

    timeOfDay = "evening";

  }

  // WEATHER SECTION 
  // Retrieves weather from the api
  let getWeather = function () {

    // queryURL = `api.openweathermap.org/data/2.5/weather?zip=${userZip}&APPID=01b094dd158ecf4fb77c7c5db98a6ad6`
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${userZip}&APPID=01b094dd158ecf4fb77c7c5db98a6ad6`

    $.get({
      url: queryURL,
      success: function (response) {

        $("p.weather-error").hide();

        weatherData = response;
        console.log(weatherData);

        // display location
        cityName = weatherData.name;
        let cityP = $("<span>").text(cityName).addClass("updatedWeather");

        // declares weather icon
        weatherIcon = weatherData.weather[0].icon;
        //   let iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;
        //   let wIcon = $("<img>").attr('src', iconURL).addClass("weatherPic");
        // display weather
        weather = weatherData.weather[0].description;
        let weatherP = $("<span>").text(weather + " in ").addClass("updatedWeather");
        $("div#weather-text").append(weatherP, cityP);

        // display weather icon + temperature
        temp = (parseInt(weatherData.main.temp) - 273.15) * 9 / 5 + 32;
        temp = Math.round(temp);

        let tempP = $("<span>").text(temp + "°")
          .addClass("updatedWeather")
          .css("font-size", "70px");
        $("div#temperature").prepend(tempP);
        let weatherId = parseInt(weatherData.weather[0].id);

        console.log(weatherId);

        let weatherSet = () => {
          $("div.icon-body").addClass("hide");
          switch (true) {
            case (weatherId < 233):
              forecast = "precip";
              icon = "t-storms";
              togglevisibility("div.thunder-storm");
              break;
            case (weatherId < 550):
              forecast = "precip";
              icon = "rain";
              togglevisibility("div.rainy");
              break;
            case (weatherId < 623):
              forecast = "precip";
              icon = "snowy";
              togglevisibility("div.flurries");
              break;
            case (weatherId < 782):
              forecast = "cloudy";
              icon = "cloudy";
              togglevisibility("div.cloudy");
              break;
            case (weatherId < 804):
              forecast = "clear";
              icon = "sunny";
              togglevisibility("div.sunny");
              break;
            case (weatherId == 804):
              forecast = "cloudy";
              icon = "cloudy";
              togglevisibility("div.cloudy");
              break;
            default:
              forecast = "clear";
              togglevisibility("div.sunny");
              break;

          };

          searchForPlaylist();

        }

        if (temp > 60) {

          tempCond = "warm"

        } else {

          tempCond = "cold"

        }

        $("#weather-data").show();
        weatherSet();
        changeBG();

      },
      error: function (error) {
        $("p.weather-error").show();
      }
    })

  };

  if (userZip) {

    getWeather();
    $("#submitZip").hide();
    $(".input-field").hide();
    $("#changeZip").focus();
    $("section#music").fadeIn("slow");

  }

  // checks to make sure zip code user inputs is valid
  let checkZip = function () {

    $(".updatedWeather").empty();

    // holds user input
    userZip = $("#zipcode").val().trim();
    localStorage.setItem("Location", userZip);
    
    // "^" indicates the beginning of input
    // "$" indicates the end of input
    // "d{5}" wants the users input to be only 5 digits long, EX : 90210 or in the second statement after the "|",
    // it allows 5 digits followed by a hyphen and 4 more digits, EX : 90210-1234
    let regex = /^\d{5}$|^\d{5}-\d{4}$/;
    // if user input is valid, it'll display the current weather and location of specified area
    if (regex.test(userZip)) {

      getWeather();
      $(".helper-text").hide();
      $(".input-field").hide();

    } else {
      $(".helper-text").show();
    }
    // clears input field after clicking search
    $("#zipcode").val('');

  }

  // checks zipcode after clicking search button
  $("#submitZip").on("click", function (event) {

    checkZip();
    $("section#music").fadeIn("slow");

  });

  // shows input field and hides weather data
  $("#changeZip").on("click", function (event) {

    $("section#music").fadeOut("slow");
    $("div.music-cards").empty();
    $(".input-field").show();
    $("#weather-data").hide();
    $("#submitZip").show();
    $("#zipcode").focus();

  });

  // press enter key to submit zipcode
  $(document).on("keypress", function (event) {

    if (event.key === "Enter") {
      checkZip();
      $("section#music").fadeIn("slow");
    }

  });

  // adds preference data to local storage 
  $("#searchPref").on("click", function () {

    localStorage.removeItem("Mood");
    localStorage.removeItem("Genre");

    if ($(".mood").is(":checked")) {

      console.log($("input[type='radio']:checked").val());
      userMood = $("input[type='radio']:checked").val();

      localStorage.setItem("Mood", userMood);

    }

    if ($('.prefGenre').is(":checked")) {

      console.log($("input[type='checkbox']:checked").val());
      userGenre = $("input[type='checkbox']:checked").val();

      localStorage.setItem("Genre", userGenre);

    }

    // makes an ajax request to search the spotify api with recommended playlists
    $.get({

      url: `https://api.spotify.com/v1/search?q=${userMood}+${userGenre}&type=playlist&limit=15`,
      // url: `https://api.spotify.com/v1/search?q=winter,chill&type=playlist&limit=20`,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function (response) {
        console.log(response);
        playlists = response.playlists.items;
        console.log(playlists);
        appendPlaylists(playlists);
      }

    });

  });

  // MUSIC SECTION
  // displays playlists on the page
  let appendPlaylists = (playlists) => {

    for (i = 0; i < 4; i++) {

      let playlistName = playlists[i].name;
      let imgSrc = playlists[i].images[0].url;
      let redirect = playlists[i].external_urls.spotify;

      let $img = $("<img>")
        .attr("src", imgSrc)
        .addClass("hoverable")

      let $a = $("<a>")
        .attr("href", `${redirect}`)
        .attr("target", "_blank")
        .append($img);

      $(`div#${i}`).append($a);

    }

  }

  // var to hold access token
  let accessToken = "BQD2PCJhewrW0K4uEnhJhAbyyExnDdLFVV9zV8_6lEx_4vJUxikkMIRM5mg5Nq-YRZfw5vLIC51ublVxGMqe5r13lvmLzTkVfgQLfXU_czFciKWphOqwYk8xsAQaHxqclt7AP3GJNPTBq1-KyjVUZKT0f2WeWzr8JsfbNO2lVEzBmvatYAH1OG8LjADBJNjF_QQq16c-Ru-d0ZV85dL7Bjb-qWSfoErTmbn_QssFfQ"
  let searchForPlaylist = function () {

    // makes an ajax request to search the spotify api with recommended playlists
    $.get({

      url: `https://api.spotify.com/v1/search?q=${conditions[tempCond][timeOfDay][forecast].search}&type=playlist&limit=15`,
      // url: `https://api.spotify.com/v1/search?q=winter,chill&type=playlist&limit=20`,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function (response) {
        $("p.music-error").hide();
        console.log(response);
        playlists = response.playlists.items;
        console.log(playlists);
        appendPlaylists(playlists);
      },
      error: function (error) {
        $("p.music-error").show();
      }

    });

  }

  $("a.modal-trigger").on("click", function () {

    $('.modal').modal();

  })

});