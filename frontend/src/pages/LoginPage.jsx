import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="cyber-card">
        <h2 className="text-2xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-fuchsia uppercase tracking-tighter italic">
          Acceso al Sistema
        </h2>
        
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Identificador de Usuario (Email)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="terminal@taskflow.sys"
            required
          />
          
          <Input
            label="Código de Acceso"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            className="w-full !py-3"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            ¿No posees credenciales?{' '}
            <Link to="/register" className="text-cyber-cyan hover:text-cyber-fuchsia transition-colors font-bold uppercase text-xs tracking-widest">
              Solicitar Registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
