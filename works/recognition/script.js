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
        async detectObjects() {
            const img = document.getElementById('myImage');
            // Load the model.
            const model = await cocoSsd.load();
            // detect objects in the image.
            const predictions = await model.detect(img);

            const ctx = document.getElementById('overlay').getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // resize the canvas
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            const font = "16px sans-serif";
            ctx.font = font;
            ctx.textBaseline = "top";

            predictions.forEach(prediction => {
                const x = prediction.bbox[0];
                const y = prediction.bbox[1];
                const width = prediction.bbox[2];
                const height = prediction.bbox[3];
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#00FFFF";
                ctx.strokeRect(x, y, width, height);
                const textWidth = ctx.measureText(prediction.class).width;
                const textHeight = parseInt(font, 10); // base 10
                ctx.fillStyle = "#00FFFF";
                ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
            });

            predictions.forEach(prediction => {
                const x = prediction.bbox[0];
                const y = prediction.bbox[1];
                // Draw the text last to ensure it's on top.
                ctx.fillStyle = "#000000";
                ctx.fillText(prediction.class, x, y);
            });
        },
        changePhoto(event) {
            const item = event.target;
            if (item.files && item.files[0]) {
                const img = document.querySelector('img');
                const ctx = document.getElementById('overlay').getContext('2d');
                img.src = URL.createObjectURL(item.files[0]);
                img.onload = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
    },
    async beforeMount() {
        await faceapi.loadFaceDetectionModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);
        await faceapi.loadAgeGenderModel(MODEL_URL);
    }
});