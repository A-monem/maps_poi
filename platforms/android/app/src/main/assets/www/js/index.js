
let app = {
  init: function () {
    document.addEventListener("deviceready", app.ready);
  },
  ready: function () {
    databaseHandler.createDatabase(); // initializa database and create tables
    document.getElementById("btnScan").addEventListener("click", scan.barcodeScanner);
    mapHandler.initMap(); //initialaize map
    document.getElementById("btnAddNote").addEventListener("click", markerHandler.addNote);
    document.getElementById("btnAddPhoto").addEventListener("click", cameraHandler.takePhoto);
    markerHandler.getAllMarkers(); //check for already existing markers in DB
  },
};

app.init();