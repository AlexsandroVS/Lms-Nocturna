/* eslint-disable react/prop-types */
// src/components/files/PDFPreviewModal.jsx
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PDFPreviewModal({ isOpen, onClose, fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    if (!isOpen) setNumPages(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col transform transition-all">
        <div className="flex justify-between items-center px-6 py-5 bg-gray-50/50">
          <h2 className="text-2xl font-medium text-gray-900">Vista Previa del PDF</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon 
              icon={faTimes} 
              className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            />
          </button>
        </div>

        <div className="overflow-y-scroll p-6 flex-1 bg-gradient-to-b from-gray-50/50 to-white">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-1 border-blue-500 border-t-transparent"></div>
              </div>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="mb-6 mx-auto border-[0.1px] border-slate-200"
                loading=""
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}