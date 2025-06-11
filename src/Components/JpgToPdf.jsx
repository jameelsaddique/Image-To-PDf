import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './imageTopdf.css';

const ImageToPDF = () => {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('a4');
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleConvert = () => {
    if (!images.length) return;

    const pdf = new jsPDF({ format: pageSize });
    let count = 0;

    images.forEach(({ file }, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgData = e.target.result;

        const img = new Image();
        img.onload = function () {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const imgWidth = img.width * ratio;
          const imgHeight = img.height * ratio;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          if (index > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

          count++;
          if (count === images.length) {
            pdf.save('converted.pdf');
          }
        };
        img.src = imgData;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <div className="wrapper">
        <h1 className="heading">Image to PDF Converter</h1>

        <div className="input-group">
          <label>Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="select"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </div>

        <div className="input-group">
          <label>Dark Mode:</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="checkbox"
          />
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="dropzone"
        >
          Drag and drop images here
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="image-preview">
          {images.map(({ preview }, index) => (
            <img key={index} src={preview} alt={`preview-${index}`} />
          ))}
        </div>

        <button onClick={handleConvert} className="convert-button">
          Convert to PDF
        </button>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Design and Developed by Jameel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ImageToPDF;
