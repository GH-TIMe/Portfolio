const MODEL_URL = "./models";

var app = new Vue({
    el: '#recognize',
    data: function() {
        return {
            url: "./img/yzA8A1w_gYE.jpg",
            info: []
        }
    },
    methods: {
        async regonizeFaces() {
            console.log(document.getElementById("load-file").value);
            const input = document.getElementById('myImage');
            const displaySize = { width: input.width, height: input.height };
            const canvas = document.getElementById('overlay');
            faceapi.matchDimensions(canvas, displaySize);

            /* Display face expression results */
            
            const detectionsWithFaceDescriptors = await faceapi
            .detectAllFaces(input)
            .withFaceLandmarks()
            .withFaceExpressions() // get emotions
            .withAgeAndGender()
            .withFaceDescriptors(); // 68 Point Face Landmarks

            // resize the detected boxes and landmarks in case your displayed image has a different size than the original
            const resizedResults = faceapi.resizeResults(detectionsWithFaceDescriptors, displaySize);

            // adding a number under the face
            resizedResults.forEach((result, index) => {
                const { age, gender, genderProbability } = result;
                new faceapi.draw.DrawTextField(
                [
                    `Face ${index + 1}`,
                    `${age.toFixed(0)} years`,
                    `${gender} (${(genderProbability*100).toFixed(2)})`
                ],
                result.detection.box.bottomLeft
                ).draw(canvas);
            });

            // draw detections into the canvas
            faceapi.draw.drawDetections(canvas, resizedResults);
            // draw the landmarks into the canvas
            faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
            this.info = detectionsWithFaceDescriptors;
        },
        changePhoto(event) {
            let item = event.target;
            if (item.files && item.files[0]) {
                let img = document.querySelector('img');
                img.src = URL.createObjectURL(item.files[0]);
                img.onload = () => this.regonizeFaces();
            }
        }
    },
    async beforeMount() {
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);
        await faceapi.loadAgeGenderModel(MODEL_URL);
        await faceapi.loadFaceDetectionModel(MODEL_URL);
    }
});