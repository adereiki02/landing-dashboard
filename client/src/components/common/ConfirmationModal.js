import React, { useEffect } from 'react';
import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';
import '../../styles/Modal.css';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'warning' }) {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Determine icon based on type
  const getIcon = () => {
    if (type === 'delete') {
      return <FaTrashAlt />;
    }
    return <FaExclamationTriangle />;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${type}`}>
          <div className={`modal-icon ${type}`}>
            {getIcon()}
          </div>
          <h3>{title || 'Confirmation'}</h3>
        </div>
        <div className="modal-body">
          {typeof message === 'string' ? <p>{message || 'Are you sure you want to proceed with this action?'}</p> : message}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {cancelText || 'Cancel'}
          </button>
          <button className={`btn-${type === 'delete' ? 'danger' : 'primary'}`} onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;