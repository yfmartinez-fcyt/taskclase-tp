import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TaskEditForm = ({ task, onSubmit, onCancel, loading, categorias = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    categoria_id: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        categoria_id: task.categoria_id || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task.id, formData);
  };

  const categoriaOptions = [
    { value: '', label: 'Sin categoría' },
    ...categorias.map(cat => ({
      value: cat.id,
      label: cat.nombre
    }))
  ];

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)]/80 flex items-center justify-center z-50">

      <form onSubmit={handleSubmit} className="cyber-card w-full max-w-lg p-6 space-y-4">

        <Input name="title" value={formData.title} onChange={handleChange} label="Título" />
        <Input name="description" value={formData.description} onChange={handleChange} label="Descripción" />
        <Input name="due_date" type="date" value={formData.due_date} onChange={handleChange} label="Vencimiento" />

        <Select
          label="Categoría"
          name="categoria_id"
          value={formData.categoria_id}
          onChange={handleChange}
          options={categoriaOptions}
        />

        <div className="flex gap-3">
          <Button type="button" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            Guardar
          </Button>
        </div>

      </form>

    </div>
  );
};

export default TaskEditForm;