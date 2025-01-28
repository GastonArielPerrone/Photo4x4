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
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

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

    // Calcular la posición del texto
    const currentDate = new Date().toLocaleString(); // Formato de fecha y hora
    let y = margin;

    // Cargar el logo como una imagen local (si el archivo está en el mismo directorio)
    const logo = new Image();
    logo.src = 'content/Photo4x4.png'; // Ruta del archivo del logo

    logo.onload = () => {
        // Agregar el logo al PDF
        doc.addImage(logo, 'PNG', margin, y, 40, 40); // Ajustar el tamaño del logo

        // Actualizar la posición para el texto debajo del logo
        y += 50; // Ajustamos la posición para no sobreponer el logo

        // Agregar texto después del logo
        doc.setFontSize(12);
        doc.text('Estas imágenes fueron generadas desde:', margin + 50, y);
        doc.text('Fecha: ' + currentDate, margin + 50, y + 10);

        // Ajustar la posición de las imágenes debajo del texto
        y += 30 + margin; // El texto ocupa 30 px de alto más el margen

        // Tomar la imagen del canvas
        const imgData = canvas.toDataURL('image/jpeg');

        // Generar una cuadrícula 4x4 en el PDF
        let x = margin;

        for (let col = 0; col < 4; col++) {
            // Agregar la imagen en la posición x
            doc.addImage(imgData, 'JPEG', x, y, imageWidth, imageHeight);

            // Actualizar la posición para la siguiente imagen
            x += imageWidth + margin;
        }

        // Guardar el PDF
        doc.save('my_photo.pdf');
    };
});