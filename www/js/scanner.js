let scan = {
    barcodeScanner: function(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                result = JSON.parse(result.text); //parse JSON from results
                markerHandler.addMarker(result.lat, result.lon, result.addr); // create a marker
            },
            function (error) {
                alert("Scanning failed: " + error);
                const msg = `Scanning failed, ${error}`
                document.getElementById("status_2").innerText = msg;
            },
            {
                preferFrontCamera: true, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
        );
    }
}