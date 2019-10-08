
let app = {
  init: function () {
    document.addEventListener("deviceready", app.ready);
  },
  ready: function () {
    databaseHandler.createDatabase();
    document.getElementById("btnScan").addEventListener("click", scan.barcodeScanner);
    mapHandler.initMap();
    document.getElementById("btnAddNote").addEventListener("click", markerHandler.addNote);
    document.getElementById("btnAddPhoto").addEventListener("click", cameraHandler.takePhoto);
    markerHandler.getAllMarkers();
  },
};

app.init();