import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ErrorMessage from '../components/common/ErrorMessage';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    setLoading(true);
    const result = await register(name, email, password, avatar);
    
    if (result.success) {
      // Opcional: Mostrar mensaje de éxito antes de redirigir
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="cyber-card">
        <h2 className="text-2xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-fuchsia uppercase tracking-tighter italic">
          Nuevo Registro
        </h2>
        
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Alias / Nombre Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="User Alpha"
            required
          />

          <Input
            label="Enlace de Red (Email)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="node@taskflow.sys"
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="Verificación"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Input
            label="Avatar Vector (URL)"
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://gravatar.com/..."
          />
          
          <Button
            type="submit"
            variant="primary"
            className="w-full !py-3 mt-4"
            disabled={loading}
          >
            {loading ? 'Procesando Datos...' : 'Inicializar Cuenta'}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            ¿Ya eres parte del sistema?{' '}
            <Link to="/login" className="text-cyber-cyan hover:text-cyber-fuchsia transition-colors font-bold uppercase text-xs tracking-widest">
              Identificarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
