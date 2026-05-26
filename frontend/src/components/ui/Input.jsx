
/**
 * Campo de texto reutilizable que se adapta al tema.
 */
const Input = ({ label, name, value, onChange, placeholder, type = 'text', required = false, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">
          {label} {required && <span className="text-[var(--accent-secondary)]">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="cyber-input"
      />
    </div>
  );
};

export default Input;
