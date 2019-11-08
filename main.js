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
    let{lat,lon} = response.data[0];
    
    displayMap(lat,lon);
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