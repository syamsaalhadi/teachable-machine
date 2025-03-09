const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions;

// Load model saat halaman dibuka
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    console.log("Model berhasil dimuat!");
}

// Start Webcam
async function startWebcam() {
    if (!model) {
        console.error("Model belum dimuat! Tunggu sebentar...");
        return;
    }

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    console.log("Webcam aktif!");
    window.requestAnimationFrame(loop);
}

// Loop untuk prediksi webcam
async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
    }
    window.requestAnimationFrame(loop);
}

// Prediksi dari webcam
async function predict(imageSource) {
    if (!model) {
        console.error("Model belum dimuat!");
        return;
    }
    if (!imageSource) {
        console.error("Sumber gambar tidak ditemukan!");
        return;
    }

    try {
        const prediction = await model.predict(imageSource);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = `${prediction[i].className}: ${(prediction[i].probability * 100).toFixed(2)}%`;
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } catch (error) {
        console.error("Error saat prediksi:", error);
    }
}

// Event Listener untuk Start Webcam
document.getElementById("startWebcam").addEventListener("click", startWebcam);

// Load model saat halaman dibuka
loadModel();
