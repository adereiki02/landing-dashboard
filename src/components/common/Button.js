
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