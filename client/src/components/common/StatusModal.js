import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../../styles/Modal.css';

function StatusModal({ isOpen, onClose, status, message, autoClose = true }) {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      
      // Auto close after 3 seconds if autoClose is true
      let timer;
      if (autoClose) {
        timer = setTimeout(() => {
          onClose();
        }, 3000);
      }
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        if (timer) clearTimeout(timer);
      };
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, autoClose]);
  
  if (!isOpen) return null;
  
  // Determine icon and style based on status
  const isSuccess = status === 'success';
  const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;
  const statusClass = isSuccess ? 'success' : 'error';
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${statusClass}`}>
          <div className={`modal-icon ${statusClass}`}>
            <Icon />
          </div>
          <h3>{isSuccess ? 'Success' : 'Error'}</h3>
        </div>
        <div className="modal-body">
          <p>{message || (isSuccess ? 'Operation completed successfully!' : 'An error occurred. Please try again.')}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusModal;