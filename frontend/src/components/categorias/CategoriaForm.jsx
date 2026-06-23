import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
const CategoriaForm = ({
    categoria,
    onGuardar,
    onCancelar
}) => {

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [color, setColor] = useState('#00ffff');

    useEffect(() => {
        if (categoria) {
            setNombre(categoria.nombre || '');
            setDescripcion(categoria.descripcion || '');
            setColor(categoria.color || '#00ffff');
        }
    }, [categoria]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onGuardar({
            nombre,
            descripcion,
            color
        });
    };

    return (
        <form onSubmit={handleSubmit}>

            <h3>
                {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            <Input
                label="Nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />

            <textarea
                className="cyber-input min-h-[100px]"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />

            <div className="flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    Color
                </label>

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                />

                <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                />
            </div>

        <div className="flex gap-4 mt-6">

  <div className="flex gap-4 mt-6">

  <Button
    type="submit"
    variant="cyan"
    className="flex-1"
  >
    Guardar
  </Button>

  <Button
    type="button"
    variant="ghost"
    className="flex-1"
    onClick={onCancelar}
  >
    Cancelar
  </Button>

</div>

</div>

  </form>
    );
};

export default CategoriaForm;