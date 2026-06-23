import Button from '../ui/Button';

const CategoriaTable = ({
  categorias,
  onEditar,
  onEliminar
}) => {

  if (!categorias.length) {
    return (
      <div className="text-center py-10">
        <p className="text-[var(--text-secondary)] font-mono text-sm">
          No existen categorías registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>
          <tr className="border-b border-[var(--border-color)]">

            <th className="text-left py-4 px-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Color
            </th>

            <th className="text-left py-4 px-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Nombre
            </th>

            <th className="text-left py-4 px-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Descripción
            </th>

            <th className="text-center py-4 px-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          {categorias.map((categoria) => (

            <tr
              key={categoria.id}
              className="border-b border-[var(--border-color)]/30 hover:bg-[var(--bg-secondary)]/40 transition-colors"
            >

              <td className="py-4 px-2">

                <div
                  className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                  style={{
                    backgroundColor: categoria.color
                  }}
                />

              </td>

              <td className="py-4 px-2">

                <span className="font-bold text-[var(--text-primary)]">
                  {categoria.nombre}
                </span>

              </td>

              <td className="py-4 px-2">

                <span className="text-[var(--text-secondary)] text-sm">
                  {categoria.descripcion || '-'}
                </span>

              </td>

              <td className="py-4 px-2">

                <div className="flex justify-center gap-2">

                  <Button
                    variant="cyan"
                    className="!py-1 !px-3 text-[10px]"
                    onClick={() => onEditar(categoria)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="fuchsia"
                    className="!py-1 !px-3 text-[10px]"
                    onClick={() => onEliminar(categoria)}
                  >
                    Eliminar
                  </Button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CategoriaTable;