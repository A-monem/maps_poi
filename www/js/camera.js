let cameraHandler = {
    takePhoto: function(){
        const cameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 300,
            targetHeight: 400,
            saveToPhotoAlbum: true
        };

        navigator.camera.getPicture(cameraHandler.cameraSuccess, cameraHandler.cameraError, cameraOptions);
    },
    cameraSuccess: function(imageData){
        markerHandler.addPhoto(imageData); //add photo path to DB
    },
    cameraError: function (message){
        console.log('error while taking a photo:', message);
    }
}