const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const generatePdfButton = document.getElementById('generatePdf');
const ctx = canvas.getContext('2d');

// Ajustar el canvas a 4x4 cm en píxeles (151x151 píxeles a 96 DPI)
canvas.width = 151;
canvas.height = 151;

// Acceder a la cámara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error al acceder a la cámara: ", err);
    });

// Capturar la imagen del video
captureButton.addEventListener('click', () => {
    // Dibujar la imagen del video en el canvas con las dimensiones de la vista previa
    ctx.drawImage(video,0,0,canvas.width, canvas.height);

    // Guardar la imagen automáticamente como .jpg
    const imgData = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'photo4x4.jpg'; // Nombre del archivo
    link.click();
});

// Generar el PDF con las imágenes capturadas
generatePdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Definir el tamaño de las imágenes (ajustable)
    const imageWidth = 30;
    const imageHeight = 30;
    const margin = 10;

    // Tomar la imagen del canvas y agregarla al PDF
    const imgData = canvas.toDataURL('image/jpeg');

    // Generar una cuadrícula 4x4 en el PDF
    let x = margin;
    let y = margin;
    let count = 0;

    for (let col = 0; col < 4; col++) {
        // Agregar la imagen en la posición x
        doc.addImage(imgData, 'JPEG', x, y, imageWidth, imageHeight);

        // Actualizar la posición para la siguiente imagen
        x += imageWidth + margin;

        count++;

        // Si ya se alcanzó el límite de 4x4, ir a la siguiente página
        if (count % 4 === 0 && count !== 16) {
            doc.addPage();
            x = margin;
            y = margin;
        }
    }

    // Calcular posición del texto justo debajo de las fotos
    y += imageHeight + margin;

    // Agregar texto al PDF
    const currentDate = new Date().toLocaleString(); // Formato de fecha y hora
    doc.setFontSize(12);
    doc.text('Estas imágenes fueron generadas desde "PHOTO4x4"', margin, y);
    doc.text('Fecha: ' + currentDate, margin, y + 10);

    // Guardar el PDF
    doc.save('my_photo.pdf');
});