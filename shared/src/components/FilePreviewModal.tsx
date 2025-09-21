import { Download, File } from 'lucide-react';
import React from 'react';
import { FileUploadService } from '../services/FileUploadService';

interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  attachmentPath: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  onClose,
  attachmentPath
}) => {
  if (!open) return null;

  const fileName = FileUploadService.getFileName(attachmentPath);
  const downloadUrl = FileUploadService.getDownloadUrl(attachmentPath);
  const isImage = FileUploadService.isImage(attachmentPath);

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha o modal apenas se clicou no overlay, não no conteúdo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 modal-overlay flex items-center justify-center z-50 mt-0"
      onClick={handleOverlayClick}
    >
      <div className="modal-content max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header com título e botão fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="modal-title flex items-center space-x-2 flex-1">
            <File className="h-6 w-6" />
            <span className="truncate">Preview de Anexo</span>
          </h2>

          <button
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none ml-4 flex-shrink-0"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Preview Content */}
        <div className="border rounded-lg overflow-hidden bg-gray-50 max-h-[60vh]">
          {isImage ? (
            <div className="flex justify-center items-center min-h-[300px] p-4">
              <img
                src={downloadUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center text-gray-500 p-8">
                        <p class="text-lg mb-2">Não foi possível carregar a imagem</p>
                        <p class="text-sm">Clique em "Nova aba" para tentar visualizar</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <div className="mb-4">
                <File className="h-16 w-16 mx-auto text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">Preview não disponível</p>
              <p className="text-sm text-gray-500 mb-4">
                Este tipo de arquivo não pode ser visualizado diretamente.
              </p>
              <p className="text-xs text-gray-400">
                Use os botões acima para baixar ou abrir em nova aba.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
