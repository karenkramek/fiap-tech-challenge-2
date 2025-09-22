import { Download, Eye, File, Image } from 'lucide-react';
import React, { useState } from 'react';
import { FileUploadService } from '../services/FileUploadService';
import FilePreviewModal from './FilePreviewModal';

interface AttachmentDisplayProps {
  attachmentPath: string;
  transactionType?: string;
  className?: string;
  showLabel?: boolean;
  showPreviewButton?: boolean;
}

const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  attachmentPath,
  transactionType,
  className = '',
  showLabel = true,
  showPreviewButton = true
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileName = FileUploadService.getFileName(attachmentPath, transactionType);
  const downloadUrl = FileUploadService.getDownloadUrl(attachmentPath);
  const isImage = FileUploadService.isImage(attachmentPath);

  const handleDownload = () => {
    // Abre o arquivo em uma nova aba para download/visualização
    window.open(downloadUrl, '_blank');
  };

  const handlePreview = () => {
    if (isImage || showPreviewButton) {
      setIsPreviewOpen(true);
    } else {
      handleDownload();
    }
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {isImage ? (
          <Image className="h-4 w-4 text-primary-600" />
        ) : (
          <File className="h-4 w-4 text-primary-600" />
        )}

        <div className="flex items-center space-x-2">
          {/* Nome do arquivo clicável */}
          <button
            onClick={handlePreview}
            className="text-primary-600 hover:text-primary-700 transition-colors text-sm hover:underline"
            title={isImage ? `Visualizar: ${fileName}` : `Abrir: ${fileName}`}
          >
            {showLabel && (
              <span className="truncate max-w-32">{fileName}</span>
            )}
          </button>

          {/* Botão de preview (se habilitado) */}
          {showPreviewButton && (
            <button
              onClick={handlePreview}
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors p-1 hover:bg-primary-50 rounded"
              title="Visualizar"
            >
              <Eye className="h-3 w-3" />
            </button>
          )}

          {/* Botão de download */}
          <button
            onClick={handleDownload}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors p-1 hover:bg-primary-50 rounded"
            title="Download"
          >
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Modal de preview */}
      <FilePreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attachmentPath={attachmentPath}
      />
    </>
  );
};

export default AttachmentDisplay;
