import React from 'react';
import './Button.css'; // Anda perlu membuat file CSS ini juga

function Button({ children, type, onClick, className }) {
  return (
    <button 
      className={`btn ${className || ''}`} 
      type={type || 'button'} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;