(async function() {

    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models/');
    
    const input = document.getElementById('myImage');
    let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();
}());
