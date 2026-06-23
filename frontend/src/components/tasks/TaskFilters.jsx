import Select from '../ui/Select';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

const TaskFilters = ({ filters, onFilterChange, categorias = [] }) => {

  const { user } = useAuth();

  const handleChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' }
  ];

  const priorityOptions = [
    { value: '', label: 'Todas' },
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

  const categoriaOptions = [
  { value: '', label: 'Todas las categorías' },
  { value: 'sin_categoria', label: 'Sin categoría' },
  ...categorias.map(cat => ({
    value: cat.id,
    label: cat.nombre
  }))
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <Select
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={statusOptions}
        label="Estado"
      />

      <Select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        options={priorityOptions}
        label="Prioridad"
      />

      <Select
        name="categoria_id"
        value={filters.categoria_id ?? ''}
        onChange={handleChange}
        options={categoriaOptions}
        label="Categoría"
      />


    </div>
  );
};

export default TaskFilters;