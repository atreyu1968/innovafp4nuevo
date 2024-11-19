// Previous imports remain the same...

const EnhancedFormList: React.FC<EnhancedFormListProps> = ({
  forms,
  isAdmin,
  onFormClick,
  onDeleteForm,
  onDuplicateForm,
  onToggleStatus,
  onToggleResponses,
  onViewResponses,
}) => {
  // Previous code remains the same...

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {forms.map((form) => {
          // Previous code remains the same until the delete button...

          <button
            onClick={() => onDeleteForm(form.id)}
            className="p-2 text-red-400 hover:text-red-500 transition-colors group relative"
            title="Eliminar formulario"
          >
            <Trash2 className="h-5 w-5" />
            <span className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Doble confirmación requerida
            </span>
          </button>

          // Rest of the component remains the same...
        })}
      </ul>
    </div>
  );
};

export default EnhancedFormList;