import React, { useState, useLayoutEffect } from "react";

export default function ModalImagen({ isOpen, imageUrl, closeModal }) {
  useLayoutEffect(() => {
    if (isOpen) {
      // Suspender actualizaciones mientras el modal esté abierto
      return () => {};
    }
  }, [isOpen]);

  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal__overlay">
      <div className="modal__content_img">
        <button className="modal__close" onClick={closeModal}>
          <i className="fa fa-times"></i>
        </button>

        <div
          className={`zoom-container ${isZoomed ? "zoomed" : ""} divwhite`}
       
          onClick={handleImageClick}
        >

          <img
            src={imageUrl}
            alt="Expanded"
          
          />
        </div>
      </div>
    </div>
  );
}
