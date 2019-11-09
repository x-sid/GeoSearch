const searchBox = document.getElementById('searchBox');

//gets the info inputed into the search box
let inputValue =searchBox.value;

//an event listener that lsitens for a submit action
searchBox.addEventListener('input',()=>{
  let inputValue =searchBox.value;
  //an api call with the user request
  let api = "https://api.locationiq.com/v1/autocomplete.php?"
  axios.get(api,{
    params:{
      key:'3180628f7bc8ea',
      q:inputValue,
      limit:5,
      crossDomain:true,
      format:'json'
    }
  })

  //recieves the data returned from the api call
  .then((res)=>{
    let inputValue = searchBox.value;
    let places = res.data;
    let suggest;
    let autoComplete = document.querySelector('#autoComplete');
   
    if(inputValue.length !== 0){
      //suggests an auto complete based on user input and displays it to the UI
      suggest = places.map(place=>
        `<div class="suggest"> ${place.address.name},${place.address.country}</div>`
      ).join('');

    } else {
      suggest = [];
      suggest = places.map(place=>
        `<div class="suggest" id="hide"> ${place.address.name},${place.address.country}</div>`
      ).join('');
    }
   autoComplete.innerHTML = suggest;
   document.querySelector('.suggest').addEventListener('click',(e)=>{
    console.log(searchBox.value = e.target.innerHTML );
   })

    
  })

})

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
    console.log(response)
    let {lat,lon,} = response.data[0];
    
    displayMap(lat,lon);
    weatherInfo(lat,lon);
    setIcon(lat,lon);
  });
})

//function that grabs weather info from an api
function weatherInfo(lat,lon){
  let proxy ="https://cors-anywhere.herokuapp.com/"
  let api = `${proxy}https://api.darksky.net/forecast/e3968dcc1c744f252da0bd34d9ae19e9/${lat},${lon}`;
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
    document.querySelector("#visibility").innerHTML = `<h4 class="props"><strong>Humidity:</strong> ${humidity}</h4>`
    document.querySelector("#windspeed").innerHTML = `<h4 class="props">
                                                        <strong>Windspeed:</strong> ${windSpeed}
                                                      </h4>`;
    document.querySelector("#desc").innerHTML = `<h4 class="props"><i>The current weather is ${summary}</i></h4>`;

    //converts temperature between Celcius and Fahrenheit
    currentTemp.addEventListener("click",()=>{
      if(currentTemp.innerHTML.indexOf("F") >= 0 ){
        currentTemp.textContent = `${Math.floor(celcius)}C`;
      } else{
        currentTemp.textContent = `${temperature}F`;
      }
    })

    //addressForm.reset();

  });
}

//functtion that sets the weather icon
function setIcon(icon,iconId){
  const skycons = new Skycons({color:"white"});
  const currentIcon = icon.replace(/-/g,"_").toUpperCase();
  skycons.play();
  return skycons.set(iconId,Skycons[currentIcon]);

}

//a function that display the map to the UI
function displayMap(lat,lon){
  // Maps access token goes here
  var key = 'pk.4482eea469b93346d01c60da10de2878';

  // Add layers that we need to the map
  var streets = L.tileLayer.Unwired({key: key, scheme: "streets"});

  // Initialize the map
  var map = L.map('map', {
      center: {lat:lat,lng:lon}, // Map loads with this location as center
      zoom: 11,
      scrollWheelZoom: true,
      layers: [streets] // Show 'streets' by default
  });

  //Add maker
  var marker = L.marker([lat, lon]).addTo(map);

  // Add the 'scale' control
  L.control.scale().addTo(map);

}
