import Badge from '../ui/Badge';
import {
  translateStatus,
  translatePriority,
  getStatusStyles,
  getPriorityStyles,
  formatDate
} from '../../utils/formatters';

const TaskCard = ({ task, onEdit, onDelete }) => {

  const categoriaName = task.categoria || 'Sin categoría';

  const categoriaColor = task.categoria_color || 'var(--accent-primary)';

  return (
    <div className=" bg-[var(--bg-primary)]/40 border hover:border-[var(--accent-primary)]/40  p-4 rounded-lg transition-all  group flex flex-col h-full shadow-sm hover:shadow-cyber-cyan/10"
  style={{borderLeft: `4px solid ${categoriaColor}` }}>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-2 h-14">
        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 overflow-hidden">
          {task.title}
        </h3>

        <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 ml-2">
          ID: #{task.id}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 overflow-hidden flex-grow">
        {task.description || 'Sin descripción'}
      </p>

      {/* CATEGORY  */}
      <div className="mb-4">
        <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">
          Categoría
        </span>

        <span
          className=" inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase  tracking-widest border"
          style={{
            color: categoriaColor,
            borderColor: categoriaColor
          }}
        >

          {categoriaName}
        </span>
      </div>

      {/* BADGES */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={getStatusStyles(task.status)}>
          {translateStatus(task.status)}
        </Badge>

        <Badge className={getPriorityStyles(task.priority)}>
          {translatePriority(task.priority)}
        </Badge>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-2 gap-y-2 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-tighter mb-4">
        <div>
          <span className="block opacity-70">Usuario</span>
          <span className="text-[var(--text-secondary)]">
            USR_{task.user_id?.toString().padStart(3, '0')}
          </span>
        </div>

        <div>
          <span className="block opacity-70">Vencimiento</span>
          <span className="text-[var(--text-secondary)]">
            {formatDate(task.due_date)}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
        <button
          onClick={() => onEdit(task)}
          className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest px-2 py-1"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="text-[10px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest px-2 py-1"
        >
          Eliminar
        </button>
      </div>

    </div>
  );
};

export default TaskCard;