

let APIKEY = "eWQxVqOHNxqizhNvAlAXPu7uXES9fSJ0";
let map;
 map = tt.map({
    key:APIKEY,
    container: 'mymap',
    zoom: 14,
    interactive: true,
    style: {
        map: "basic_night",
    },
    styleVisibility : {
        trafficFlow: true,
        trafficIncidents: false,
    }
});
if (map) {
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        let marker = new tt.Marker().setLngLat([lat,long]).addTo(map);

        map.flyTo({
            center:[lat,long],
            essential: true
        });
    });
}

