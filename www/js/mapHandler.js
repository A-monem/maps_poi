let mapHandler = {
    map : null,
    defaultPosition: {lat: -25.344, lng: 131.036},
    initMap: function() {
        mapHandler.map = new google.maps.Map(document.getElementById('map'), {zoom: 3, center: mapHandler.defaultPosition});
        // infoWindow = new google.maps.InfoWindow;
    }, 
    addMarker: function(lat, lng, addr, id){
        const latLng = new google.maps.LatLng(lat, lng);
        const marker = new google.maps.Marker({
            position: latLng,
            map: mapHandler.map
          });
        // const infoWindow = new google.maps.InfoWindow;
        // const content = mapHandler.setContent(id, addr)
        // infoWindow.setContent(content)
        // marker.addEventListener('click', function() {
        //     infoWindow.open(map, marker);
        //   });
        mapHandler.map.setCenter(latLng);
    }, 
    setContent: function(id, addr){
        return (
            `<p>${addr}</p>
            <button id="${id}-addNote"><a href="#pageTwo">Add a Note</a></button>
            <button id="${id}-addPhoto" >Add Photo</button>
            <button id="${id}-deleteMarker" >Delete Marker</button>
            <button id="${id}-showPhotos">Show Photos</button>
            <button id="${id}-showNotes">Show Notes</button>`
        )
    }
};

// let map 
// function initMap() {
//     const uluru = {lat: -25.344, lng: 131.036};
//     map = new google.maps.Map(document.getElementById('map'), {zoom: 3, center: uluru});
//     // infoWindow = new google.maps.InfoWindow;
// }