import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TaskForm = ({ onSubmit, loading, categorias = [] }) => {
  const initialState = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    categoria_id: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('El título es obligatorio.');
      return;
    }

    const success = await onSubmit(formData);

    if (success) setFormData(initialState);
  };

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' }
  ];

  const categoriaOptions = [
    { value: '', label: 'Sin categoría' },
    ...categorias.map(cat => ({
      value: cat.id,
      label: cat.nombre
    }))
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <Input
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <Input
        label="Vencimiento"
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <div className="grid grid-cols-3 gap-4">

        <Select
          label="Prioridad"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />

        <Select
          label="Estado"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />

        <Select
          label="Categoría"
          name="categoria_id"
          value={formData.categoria_id}
          onChange={handleChange}
          options={categoriaOptions}
        />

      </div>

      {formError && (
        <p className="text-xs text-[var(--accent-secondary)] font-bold uppercase">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Procesando...' : 'Crear Tarea'}
      </Button>

    </form>
  );
};

export default TaskForm;