let app = {
  init: function () {
    document.addEventListener("deviceready", app.ready);
  },
  ready: function () {
    databaseHandler.createDatabase();
    document.getElementById("btnScan").addEventListener("click", scan.barcodeScanner);
    
    mapHandler.initMap();
  },

};

// databaseHandler.createDatabase();

// markerHandler.addMarker(1000, 5000, "address 1");
// markerHandler.getMarker();


app.init();