
// src/scripts/mapboxsearch.js

document.addEventListener('DOMContentLoaded', () => {
    const accessToken =
      "pk.eyJ1IjoiZGllZ29jZXJvbmRldiIsImEiOiJjbDBxNWY5OWcwOWMyM2NxbmFyNjN0cm51In0.gEWz2YRkQypcE52QUIErIA";
  
    const script = document.getElementById("search-js");
    if (script) {
      script.onload = function () {
        mapboxsearch.autofill({
          accessToken,
        });
      };
    }
  });
  