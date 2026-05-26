
/**
 * Botón reutilizable con estilos que se adaptan al tema.
 */
const Button = ({ children, variant = 'cyan', type = 'button', disabled, onClick, className = '' }) => {
  const variants = {
    cyan: 'cyber-button',
    primary: 'cyber-button-primary',
    fuchsia: 'cyber-button-fuchsia',
    outline: 'px-4 py-2 bg-transparent border border-slate-500 text-slate-500 rounded-md hover:bg-slate-500/10 transition-all duration-300 uppercase tracking-wider text-xs font-bold',
    ghost: 'px-4 py-2 bg-transparent text-slate-500 rounded-md hover:bg-slate-500/10 transition-all duration-300 uppercase tracking-wider text-xs font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant] || variants.cyan} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
