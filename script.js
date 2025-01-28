const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const generatePdfButton = document.getElementById('generatePdf');
const ctx = canvas.getContext('2d');

// Ajustar el tamaño del canvas
canvas.width = 160;  // 4 cm de ancho a 96 DPI
canvas.height = 160; // 4 cm de alto a 96 DPI

// Capturar la imagen al hacer clic en el botón
captureButton.addEventListener('click', () => {
    // Dibujar el frame del video en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Descargar la imagen capturada con el fondo original
    const link = document.createElement('a');
    link.download = 'myPhoto4x4.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Función para generar el PDF con la imagen capturada
generatePdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Definir el tamaño de la imagen en el PDF
    const imageWidth = 30;
    const imageHeight = 30;
    const margin = 10;

    // Calcular la posición del texto
    const currentDate = new Date().toLocaleString();
    let y = margin;

    // Agregar texto al PDF
    doc.setFontSize(12);
    doc.text('Estas imágenes fueron generadas desde "PHOTO4x4"', margin, y);
    doc.text('Fecha: ' + currentDate, margin, y + 10);

    // Ajustar la posición de las imágenes debajo del texto
    y += 30 + margin;

    // Tomar la imagen del canvas
    const imgData = canvas.toDataURL('image/jpeg');

    // Generar una cuadrícula 4x4 en el PDF
    let x = margin;
    for (let col = 0; col < 4; col++) {
        // Agregar la imagen al PDF
        doc.addImage(imgData, 'JPEG', x, y, imageWidth, imageHeight);

        // Actualizar la posición para la siguiente imagen
        x += imageWidth + margin;
    }

    // Guardar el PDF
    doc.save('myPhoto4x4.pdf');
});

// Acceder a la cámara del usuario
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error al acceder a la cámara: ", err);
    });