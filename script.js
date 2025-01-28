const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const generatePdfButton = document.getElementById('generatePdf');
const ctx = canvas.getContext('2d');

// Ajustar el canvas a 4x4 cm en píxeles (151x151 píxeles a 96 DPI)
canvas.width = 160;
canvas.height = 160;

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
    const ctx = canvas.getContext('2d');
    canvas.width = 160; // 4cm (ancho) para tamaño 4x4
    canvas.height = 160; // 4cm (alto)
  
    // Dibujar el frame del video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Procesar el fondo (cambiarlo a blanco)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
  
      // Detectar fondo claro y cambiarlo a blanco
      if (r > 200 && g > 200 && b > 200) { // Fondo claro
        data[i] = 255; // Blanco R
        data[i + 1] = 255; // Blanco G
        data[i + 2] = 255; // Blanco B
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  
    // Guardar automáticamente la imagen procesada
    const link = document.createElement('a');
    link.download = 'foto_fondo_blanco.png'; // Nombre del archivo
    link.href = canvas.toDataURL('image/png'); // Imagen procesada en formato PNG
    link.click(); // Simula un clic para descargar automáticamente
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

    // Agregar texto al PDF antes de las imágenes
    doc.setFontSize(12);
    doc.text('Estas imágenes fueron generadas desde "PHOTO4x4"', margin, y);
    doc.text('Fecha: ' + currentDate, margin, y + 10);

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
});