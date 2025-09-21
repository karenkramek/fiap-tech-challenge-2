import { File, Image, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { FileUploadService } from '../services/FileUploadService';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
  existingFilePath?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  disabled = false,
  existingFilePath,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    processFile(file);
  };

  const processFile = (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      setError(null);
      return;
    }

    const validation = FileUploadService.validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentFile = selectedFile || (existingFilePath ? { name: FileUploadService.getFileName(existingFilePath) } as File : null);
  const isImage = currentFile && FileUploadService.isImage(currentFile.name);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-lg font-bold text-primary-700 mb-1">
        Anexo <span className="text-sm font-medium text-white-800">(opcional)</span>
      </label>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-white-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500 hover:bg-primary-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt"
        />

        {currentFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isImage ? (
                <Image className="h-8 w-8 text-primary-600" />
              ) : (
                <File className="h-8 w-8 text-primary-600" />
              )}
              <div>
                <p className="text-sm font-medium text-primary-700 truncate max-w-48">
                  {currentFile.name}
                </p>
                {selectedFile && (
                  <p className="text-xs text-white-800">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
              disabled={disabled}
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-white-700" />
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-700">
                Clique para selecionar ou arraste um arquivo
              </p>
              <p className="text-xs text-white-800 mt-1">
                PDF e imagens (PNG, JPG, GIF) - Máx. 2MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Existing file info */}
      {existingFilePath && !selectedFile && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm">
          <p>Arquivo atual: {FileUploadService.getFileName(existingFilePath)}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
