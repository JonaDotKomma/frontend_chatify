import React, { useState } from 'react';
const Tooltip = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Función para agregar saltos de línea cada 8 palabras
  const formatText = (text) => {
    return text.split(' ').reduce((acc, word, index) => {
      if (index % 8 === 0 && index !== 0) return `${acc}<br/>${word}`;
      return `${acc} ${word}`;
    });
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="tooltip-text"
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
        ></div>
      )}
    </div>
  );
};

export default Tooltip;
