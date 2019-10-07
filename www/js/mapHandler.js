let mapHandler = {
    map: null,
    currentMarker: null,
    defaultPosition: { lat: -25.344, lng: 131.036 },
    initMap: function () {
        mapHandler.map = new google.maps.Map(document.getElementById('map'), { zoom: 3, center: mapHandler.defaultPosition });
    },
    createMarker: function (lat, lng, addr, id) {
        const latLng = new google.maps.LatLng(lat, lng);
        const marker = new google.maps.Marker({
            position: latLng,
            map: mapHandler.map
        });
        const infoWindow = new google.maps.InfoWindow;
        const content = mapHandler.setContent(id, addr)
        infoWindow.setContent(content)
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            markerHandler.getMarker(id);
            mapHandler.currentMarker = marker;
        });
        mapHandler.map.setCenter(latLng);
    },
    setContent: function (id, addr) {
        return (
            `<p>${addr}</p>
            <button id="${id}-addNote"><a href="#pageTwo">Add a Note</a></button>
            <button id="${id}-addPhoto" >Add Photo</button>
            <button id="${id}-deleteMarker" onclick="mapHandler.deleteMarker(${id})">Delete Marker</button>
            <button id="${id}-showPhotos">Show Photos</button>
            <button id="${id}-showNotes" onclick="markerHandler.getNote(${id})">
                <a href="#pageThree">Show Notes</a>
            </button>`
        )
    },
    deleteMarker: function (id) {
        markerHandler.deleteMarker(id);
        mapHandler.currentMarker.setMap(null);
        document.getElementById("markerId").innerText = ` id: `;
        document.getElementById("latitude").innerText = ` latitude: `;
        document.getElementById("longitude").innerText = ` longitude: `;
        document.getElementById("address").innerText = ` address: `;
    }
};