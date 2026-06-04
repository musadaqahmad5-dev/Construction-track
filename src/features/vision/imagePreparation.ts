export interface PreparedImage {
  base64: string; // Base64 representation
  pureBase64: string; // Base64 without prefix
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export class ImagePreparation {
  /**
   * Validates and prepares an uploaded image file.
   * Compresses it if it exceeds certain dimensions to optimize transmission.
   */
  static async prepareImage(file: File): Promise<PreparedImage> {
    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    if (!validMimes.includes(file.type) && !isHeic) {
      throw new Error("Invalid image format. Supported formats: JPEG, PNG, WEBP.");
    }

    // Load into base64 initially
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Str = e.target?.result as string;
        if (!base64Str) {
          reject(new Error("Failed to read file as Base64"));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const maxDim = 800; // Limit long side to 800px for efficient processing
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            const mime = file.type || 'image/jpeg';
            const pure = base64Str.split(',')[1] || base64Str;
            resolve({
              base64: base64Str,
              pureBase64: pure,
              mimeType: mime,
              width: img.width,
              height: img.height,
              sizeBytes: file.size
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          const targetMime = 'image/jpeg';
          const downscaledBase64 = canvas.toDataURL(targetMime, 0.85);
          const pureBase64 = downscaledBase64.split(',')[1];
          const approxSizeBytes = Math.round((pureBase64.length * 3) / 4);

          resolve({
            base64: downscaledBase64,
            pureBase64,
            mimeType: targetMime,
            width,
            height,
            sizeBytes: approxSizeBytes
          });
        };

        img.onerror = () => {
          reject(new Error("Failed to parse image file."));
        };

        img.src = base64Str;
      };

      reader.onerror = () => reject(new Error("FileReader read failure."));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Utility to safely extract details from arbitrary base64 strings
   */
  static extractMimeTypeAndPureBase64(dataUrl: string): { mimeType: string, pureBase64: string } {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], pureBase64: match[2] };
    }
    return { mimeType: 'image/jpeg', pureBase64: dataUrl };
  }
}
