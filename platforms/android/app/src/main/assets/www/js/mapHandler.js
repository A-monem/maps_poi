let mapHandler = {
    map: null,
    currentMarker: null,
    defaultPosition: { lat: -25.344, lng: 131.036 },
    initMap: function () {
        mapHandler.map = new google.maps.Map(document.getElementById('map'), { zoom: 3, center: mapHandler.defaultPosition });
    },
    createMarker: function (lat, lng, addr, id) { // create marker
        const latLng = new google.maps.LatLng(lat, lng);
        const marker = new google.maps.Marker({
            position: latLng,
            map: mapHandler.map
        });
        const infoWindow = new google.maps.InfoWindow; //create infowindow
        const content = mapHandler.setContent(addr)
        infoWindow.setContent(content)
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            markerHandler.id = id;
            markerHandler.getMarker();
            mapHandler.currentMarker = marker;
        });
        mapHandler.map.setCenter(latLng);
    },
    setContent: function (addr) {
        return (
            //infor window content
            `<button class="btnInfoView"><a href="#pageTwo">Add a Note</a></button>
            <button class="btnInfoView" onclick="markerHandler.getNote()"><a href="#pageThree">Show Notes</a></button>
            <button class="btnInfoView"><a href="#pageFour">Add a Photo</a></button>
            <button class="btnInfoView" onclick="markerHandler.getPhoto()"><a href="#pageFive">Show Photos</a></button>
            <button class="btnInfoView" onclick="mapHandler.deleteMarker()">Delete Marker</button>`
        )
    },
    deleteMarker: function () { //delete marker and remover marker from map
        markerHandler.deleteMarker();
        mapHandler.currentMarker.setMap(null);
        document.getElementById("markerId").value = "";
        document.getElementById("latitude").value = "";
        document.getElementById("longitude").value = "";
        document.getElementById("address").value = "";
    }
};