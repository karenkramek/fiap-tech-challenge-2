
export class FileUploadService {
  private static readonly UPLOAD_PATH = '/uploads';
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Valida se o arquivo atende aos critérios de upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'Nenhum arquivo selecionado' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'Arquivo muito grande. Máximo permitido: 5MB' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
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
  static async uploadFile(file: File, transactionType: string): Promise<string> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('transactionType', transactionType);

    try {
      // Upload real para o servidor
      const response = await fetch('http://localhost:3035/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload do arquivo');
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      throw new Error('Falha no upload do arquivo. Tente novamente.');
    }
  }

  /**
   * Remove um arquivo do servidor
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      // Extrai apenas o nome do arquivo do caminho
      const fileName = filePath.split('/').pop();
      if (!fileName) return false;

      const response = await fetch(`http://localhost:3035/api/upload/${fileName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log(`Arquivo removido: ${filePath}`);
        return true;
      }

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
    // URL real do servidor de upload para acessar os arquivos
    return `http://localhost:3035${filePath}`;
  }

  /**
   * Extrai nome do arquivo do caminho
   */
  static getFileName(filePath: string, transactionType?: string): string {
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];

    console.log('FileUploadService.getFileName - Processing:', fileName);
    console.log('FileUploadService.getFileName - TransactionType provided:', transactionType);

    // PRIORIDADE 1: Se temos transactionType, sempre usar ele
    if (transactionType) {
      const timestampMatch = fileName.match(/^(\d+)_/);
      const extensionMatch = fileName.match(/\.([^.]+)$/);

      if (timestampMatch && extensionMatch) {
        const timestamp = timestampMatch[1];
        const extension = extensionMatch[1];

        // Mapeia o tipo da transação para display
        const typeMapping: Record<string, string> = {
          'DEPOSIT': 'deposito',
          'WITHDRAWAL': 'saque',
          'TRANSFER': 'transferencia',
          'PAYMENT': 'pagamento'
        };

        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        console.log('🎯 Generated display name with transaction type:', result);
        return result;
      }
    }

    // PRIORIDADE 2: Extrai timestamp e extensão do arquivo se não temos transactionType

    // Formato: timestamp_tipo_nomeoriginal.extensao
    // Exemplo: 1758482214299_transacao_kowalski-familia.gif
    const patternWithOriginal = fileName.match(/^(\d+)_([^_]+)_(.+)$/);
    if (patternWithOriginal) {
      const [, timestamp, type, originalNameWithExt] = patternWithOriginal;
      const extension = originalNameWithExt.split('.').pop();

      // Se temos transactionType, usa ele; senão usa o tipo do arquivo
      if (transactionType) {
        const typeMapping: Record<string, string> = {
          'DEPOSIT': 'deposito',
          'WITHDRAWAL': 'saque',
          'TRANSFER': 'transferencia',
          'PAYMENT': 'pagamento'
        };
        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        console.log('Generated display name from transaction type:', result);
        return result;
      }

      // Converte tipo interno para nome amigável
      const typeMapping: Record<string, string> = {
        'deposito': 'deposito',
        'saque': 'saque',
        'transferencia': 'transferencia',
        'pagamento': 'pagamento',
        'transacao': 'transacao'
      };

      const displayType = typeMapping[type] || type;
      const result = `${timestamp}_${displayType}.${extension}`;
      console.log('Generated display name:', result);
      return result;
    }

    // Formato: timestamp_tipo.extensao
    // Exemplo: 1758480895373_transacao.png
    const patternSimple = fileName.match(/^(\d+)_([^.]+)\.(.+)$/);
    if (patternSimple) {
      const [, timestamp, type, extension] = patternSimple;

      // Se temos transactionType, usa ele; senão usa o tipo do arquivo
      if (transactionType) {
        const typeMapping: Record<string, string> = {
          'DEPOSIT': 'deposito',
          'WITHDRAWAL': 'saque',
          'TRANSFER': 'transferencia',
          'PAYMENT': 'pagamento'
        };
        const displayType = typeMapping[transactionType] || 'transacao';
        const result = `${timestamp}_${displayType}.${extension}`;
        console.log('Generated display name from transaction type (simple):', result);
        return result;
      }

      // Converte tipo interno para nome amigável
      const typeMapping: Record<string, string> = {
        'deposito': 'deposito',
        'saque': 'saque',
        'transferencia': 'transferencia',
        'pagamento': 'pagamento',
        'transacao': 'transacao'
      };

      const displayType = typeMapping[type] || type;
      const result = `${timestamp}_${displayType}.${extension}`;
      console.log('Generated display name (simple):', result);
      return result;
    }

    // Fallback - retorna o nome original se não reconhecer o padrão
    console.log('No pattern matched, returning original:', fileName);
    return fileName;
  }  /**
   * Verifica se o arquivo é uma imagem
   */
  static isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }
}
