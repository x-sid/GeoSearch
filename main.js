// selects the address form and add a submit event which triggers an api call
const addressForm = document.getElementById('addressForm');
addressForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  let location = searchBox.value;
  axios.get("https://us1.locationiq.com/v1/search.php?",{
    params:{
      key:'3180628f7bc8ea',
      q:location,
      format:'json'
    }
  })
  .then((response)=>{
    let lat = response.data[0].lat;
    let long = response.data[0].lon;
    
    displayMap(lat,long);
    setTimeout(lat,long);
    setIcon(lat,long);
  });
})

//a function that display the map to the UI
function displayMap(lat,long){
  // Maps access token goes here
  var key = 'pk.4482eea469b93346d01c60da10de2878';

  // Add layers that we need to the map
  var streets = L.tileLayer.Unwired({key: key, scheme: "streets"});

  // Initialize the map
  var map = L.map('map', {
      center: {lat:lat,lng:long}, // Map loads with this location as center
      zoom: 11,
      scrollWheelZoom: false,
      layers: [streets] // Show 'streets' by default
  });

  //Add maker
  var marker = L.marker([lat, long]).addTo(map);

  // Add the 'scale' control
  L.control.scale().addTo(map);

}


//function that grabs weather info from an api
function weatherInfo(lat,long){
  let proxy ="https://cors-anywhere.herokuapp.com/"
  let api = `${proxy}https://api.darksky.net/forecast/e3968dcc1c744f252da0bd34d9ae19e9/${lat},${long}`;
  axios.get(api,{
    params:{crossDomain:true}
  })

  .then((res)=>{
    //returned weather properties from the call to the api
    let { temperature,summary,icon,humidity,windSpeed} = res.data.currently;
    let timezone = res.data.timezone
    setIcon(icon,document.querySelector("#icon"));
    let celcius = (temperature-32) * 5/9;
    let currentTemp= document.querySelector(".degrees")
    currentTemp.innerHTML = `${temperature}F <p id="tempConvert">click to convert</p>`;
    //displays the required properties to the appropriate HTML DOM
    document.querySelector("#timezone").textContent = timezone;
    document.querySelector("#visibility").innerHTML = `<span class="props"><strong>Humidity:</strong> ${humidity}</span>`
    document.querySelector("#windspeed").innerHTML = `<span class="props"><strong>Windspeed:</strong> ${windSpeed}</span>`;
    document.querySelector("#desc").innerHTML = `<span "props"><i>The current weather is ${summary}</i></span>`;
  })
}

//functtion that sets the weather icon
function setIcon(icon,iconId){
  const skycons = new Skycons({color:"white"});
  const currentIcon = icon.replace(/-/g,"_").toUpperCase();
  skycons.play();
  return skycons.set(iconId,Skycons[currentIcon]);

}

