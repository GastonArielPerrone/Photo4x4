// DOM
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureButton = document.getElementById("capture");
const generatePdfButton = document.getElementById("generatePdf");
const capturedImageElement = document.getElementById("capturedImage");
// Variable use about condition if the image are capturated.
let capturedImage = null;

// Camera is configurated.
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// Charge a segmentation of human body.
async function loadBodyPix() {
    return await bodyPix.load();
}

// Process the video and remove background.
async function processVideo() {
    const net = await loadBodyPix();

    async function detect() {
        const segmentation = await net.segmentPerson(video, {
            internalResolution: 'medium',
            segmentationThreshold: 0.7
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            if (segmentation.data[i / 4] === 0) { // If px is not person.
                pixels[i] = 255; // Red
                pixels[i + 1] = 255; // Green
                pixels[i + 2] = 255; // Blue
                pixels[i + 3] = 255; // Opacity total
            }
        }

        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(detect);
    }
    detect();
}

// Capture the image.
captureButton.addEventListener("click", () => {
    const imageCaptured = document.getElementById("capturedImage");
    const image = canvas.toDataURL("image/jpeg", 1.0);
    imageCaptured.style="display: block";
    capturedImage = image;
    capturedImageElement.src = image; // Print the captured image.

    const link = document.createElement("a");
    link.href = image;
    link.download = "photo4x4.jpg";
    link.click();
});

// Create PDF
generatePdfButton.addEventListener("click", () => {
    if (!capturedImage) {
        alert("Primero captura una imagen.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add text with actuallity date.
    doc.text("Estas imágenes han sido diseñadas por PHOTO4X4", 10, 10);
    const date = new Date().toLocaleString();
    doc.text(`Fecha y Hora: ${date}`, 10, 20);

    // Inserte the image x 4 in PDF
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            doc.addImage(capturedImage, "JPEG", 10 + j * 45, 30 + i * 45, 40, 40);
            // Add border.
            doc.setLineWidth(0.5);
            doc.rect(10 + j * 45, 30 + i * 45, 40, 40);
        }
    }

    doc.save("photo4x4.pdf");
});

setupCamera().then(processVideo);