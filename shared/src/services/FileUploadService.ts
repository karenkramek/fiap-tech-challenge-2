import { TransactionType, TRANSACTION_TYPE_FILENAME } from '../types/TransactionType';
import { AppConfig } from '../config/app.config';

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface UploadApiResponse {
  filePath: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export class FileUploadService {
  private static readonly ALLOWED_TYPES = AppConfig.ALLOWED_FILE_TYPES;
  private static readonly MAX_FILE_SIZE = AppConfig.MAX_FILE_SIZE;

  /**
   * Valida se o arquivo atende aos critérios de upload
   */
  static validateFile(file: File | null): FileValidationResult {
    if (!file) {
      return { isValid: false, error: 'Nenhum arquivo selecionado' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'Arquivo muito grande. Máximo permitido: 5MB' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo não permitido. Permitidos: PDF, Word, Excel, imagens (PNG, JPG, GIF) e texto'
      };
    }

    return { isValid: true };
  }

  /**
   * Faz upload do arquivo para o servidor
   */
  static async uploadFile(file: File, transactionType: TransactionType): Promise<string> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Arquivo inválido');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('transactionType', transactionType);

    try {
      const response = await fetch(`${AppConfig.UPLOAD_SERVICE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro no upload' }));
        throw new Error(errorData.error || `Erro no upload: ${response.status}`);
      }

      const data: UploadApiResponse = await response.json();

      if (!data.filePath) {
        throw new Error('Resposta inválida do servidor: caminho do arquivo não retornado');
      }

      return data.filePath;
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha no upload do arquivo. Tente novamente.');
    }
  }

  /**
   * Remove um arquivo do servidor
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    if (!filePath || filePath.trim().length === 0) {
      console.warn('Caminho do arquivo não fornecido para exclusão');
      return false;
    }

    try {
      const fileName = filePath.split('/').pop();
      if (!fileName) {
        console.warn('Nome do arquivo não pôde ser extraído do caminho:', filePath);
        return false;
      }

      const response = await fetch(`${AppConfig.UPLOAD_SERVICE_URL}/api/upload/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        return true;
      }

      console.warn(`Falha ao remover arquivo: ${response.status} - ${response.statusText}`);
      return false;
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      return false;
    }
  }

  /**
   * Gera URL para download do arquivo
   */
  static getDownloadUrl(filePath: string): string {
    if (!filePath) {
      throw new Error('Caminho do arquivo não fornecido');
    }
    return `${AppConfig.UPLOAD_SERVICE_URL}${filePath}`;
  }

  /**
   * Extrai nome do arquivo do caminho
   */
  static getFileName(filePath: string, transactionType?: TransactionType): string {
    if (!filePath) {
      return 'arquivo_desconhecido';
    }

    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    const typeMapping: Record<TransactionType, string> = TRANSACTION_TYPE_FILENAME;

    // PRIORIDADE 1: Se temos transactionType, sempre usar ele
    if (transactionType) {
      const timestampMatch = fileName.match(/^(\d+)_/);
      const extensionMatch = fileName.match(/\.([^.]+)$/);

      if (timestampMatch && extensionMatch) {
        const timestamp = timestampMatch[1];
        const extension = extensionMatch[1];
        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        return result;
      }
    }

    // PRIORIDADE 2: Extrai timestamp e extensão do arquivo
    const patternWithOriginal = fileName.match(/^(\d+)_([^_]+)_(.+)$/);
    if (patternWithOriginal) {
      const [, timestamp, type, originalNameWithExt] = patternWithOriginal;
      const extension = originalNameWithExt.split('.').pop();

      if (transactionType) {
        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        return result;
      }

      const internalTypeMapping: Record<string, string> = {
        'deposito': 'deposito',
        'saque': 'saque',
        'transferencia': 'transferencia',
        'pagamento': 'pagamento',
        'transacao': 'transacao'
      };

      const displayType = internalTypeMapping[type] || type;
      const result = `${timestamp}_${displayType}.${extension}`;
      return result;
    }

    // Formato simples: timestamp_tipo.extensao
    const patternSimple = fileName.match(/^(\d+)_([^.]+)\.(.+)$/);
    if (patternSimple) {
      const [, timestamp, type, extension] = patternSimple;

      if (transactionType) {
        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        return result;
      }

      const internalTypeMapping: Record<string, string> = {
        'deposito': 'deposito',
        'saque': 'saque',
        'transferencia': 'transferencia',
        'pagamento': 'pagamento',
        'transacao': 'transacao'
      };

      const displayType = internalTypeMapping[type] || type;
      const result = `${timestamp}_${displayType}.${extension}`;
      return result;
    }

    return fileName;
  }

  /**
   * Verifica se o arquivo é uma imagem
   */
  static isImage(filePath: string): boolean {
    if (!filePath) return false;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'] as const;
    const lowerPath = filePath.toLowerCase();
    return imageExtensions.some(ext => lowerPath.endsWith(ext));
  }

  /**
   * Obtém o tipo MIME do arquivo baseado na extensão
   */
  static getMimeType(filePath: string): string {
    if (!filePath) return 'application/octet-stream';

    const extension = filePath.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'txt': 'text/plain',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Formata o tamanho do arquivo para exibição
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
