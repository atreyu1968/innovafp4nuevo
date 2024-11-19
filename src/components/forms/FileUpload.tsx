import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { FileResponse } from '../../types/form';

interface FileUploadProps {
  value?: FileResponse[];
  onChange: (files: FileResponse[]) => void;
  fileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  fileTypes = ['image/*', 'application/pdf'],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Validate file types
    const invalidType = files.find(
      (file) => !fileTypes.some((type) => file.type.match(type))
    );
    if (invalidType) {
      setError('Tipo de archivo no permitido');
      return;
    }

    // Validate file size
    const oversizedFile = files.find((file) => file.size > maxFileSize);
    if (oversizedFile) {
      setError(`El archivo no debe superar ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    // Convert files to base64 for preview
    const fileResponses = await Promise.all(
      files.map(async (file) => {
        return new Promise<FileResponse>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result as string,
              uploadedAt: new Date().toISOString(),
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onChange(multiple ? [...value, ...fileResponses] : fileResponses);
  };

  const removeFile = (fileId: string) => {
    onChange(value.filter((file) => file.id !== fileId));
  };

  const renderFilePreview = (file: FileResponse) => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="h-20 w-20 object-cover rounded"
        />
      );
    }
    return (
      <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded">
        {file.type === 'application/pdf' ? (
          <FileText className="h-8 w-8 text-gray-400" />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar archivo{multiple ? 's' : ''}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={fileTypes.join(',')}
          multiple={multiple}
          required={required && value.length === 0}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-sm text-gray-500">
          {fileTypes.includes('image/*') && 'Imágenes'}
          {fileTypes.includes('image/*') && fileTypes.includes('application/pdf') && ' y '}
          {fileTypes.includes('application/pdf') && 'PDF'}
          {` (máx. ${maxFileSize / (1024 * 1024)}MB)`}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((file) => (
            <div
              key={file.id}
              className="relative group border rounded-lg p-2"
            >
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
              <div className="flex flex-col items-center">
                {renderFilePreview(file)}
                <p className="mt-2 text-sm text-gray-500 truncate w-full text-center">
                  {file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;