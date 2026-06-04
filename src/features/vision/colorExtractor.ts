export interface WardrobeColor {
  name: string;
  hex: string;
  type: 'neutral' | 'earthy' | 'accent';
}

export class ColorExtractor {
  public static standardColors: WardrobeColor[] = [
    // Neutrals
    { name: 'Pitch Black', hex: '#000000', type: 'neutral' },
    { name: 'Minimalist White', hex: '#FFFFFF', type: 'neutral' },
    { name: 'Oatmeal Beige', hex: '#E5D3C3', type: 'neutral' },
    { name: 'Silver Gray', hex: '#C0C0C0', type: 'neutral' },
    // Earthy Accents
    { name: 'Olive Drab', hex: '#556B2F', type: 'earthy' },
    { name: 'Dry Sage', hex: '#87AE73', type: 'earthy' },
    { name: 'Warm Rust', hex: '#B7410E', type: 'earthy' },
    { name: 'Navy Blue', hex: '#000080', type: 'earthy' },
    // Bright Accents
    { name: 'Crimson Red', hex: '#DC143C', type: 'accent' },
    { name: 'Mustard Yellow', hex: '#FFDB58', type: 'accent' },
    { name: 'Forest Green', hex: '#228B22', type: 'accent' }
  ];

  /**
   * Samples a base64 image data-url using HTML Canvas to find the most dominant color.
   * Maps pixel RGB values to our standard wardrobe colors list.
   */
  static async extractDominantColorsFromCanvas(base64DataUrl: string): Promise<{ primary: string; secondary: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 50; // Tiny canvas for fast sampling
          canvas.height = 50;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ primary: 'Oatmeal Beige', secondary: 'Minimalist White' });
            return;
          }

          ctx.drawImage(img, 0, 0, 50, 50);
          const imgData = ctx.getImageData(0, 0, 50, 50);
          const data = imgData.data;

          // Simple average RGB of entire image
          let rSum = 0, gSum = 0, bSum = 0;
          let count = 0;

          // Also track quadrant averages to guess a secondary color
          let q1R = 0, q1G = 0, q1B = 0, q1Count = 0;
          let q4R = 0, q4G = 0, q4B = 0, q4Count = 0;

          for (let i = 0; i < data.length; i += 16) { // step 4 pixels (16 values) for efficiency
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 50) continue; // Skip transparency

            rSum += r;
            gSum += g;
            bSum += b;
            count++;

            const pixelIndex = i / 4;
            if (pixelIndex < 625) { // Upper half
              q1R += r;
              q1G += g;
              q1B += b;
              q1Count++;
            } else if (pixelIndex > 1875) { // Lower half
              q4R += r;
              q4G += g;
              q4B += b;
              q4Count++;
            }
          }

          if (count === 0) {
            resolve({ primary: 'Oatmeal Beige', secondary: 'Minimalist White' });
            return;
          }

          const avgR = rSum / count;
          const avgG = gSum / count;
          const avgB = bSum / count;

          const primaryColor = this.findClosestStandardColor(avgR, avgG, avgB);

          // Find secondary color from one of the quadrants (preferably different)
          let secondaryColor = 'Minimalist White';
          if (q4Count > 0) {
            const secR = q4R / q4Count;
            const secG = q4G / q4Count;
            const secB = q4B / q4Count;
            secondaryColor = this.findClosestStandardColor(secR, secG, secB);
          }

          // If primary and secondary are identical, try setting secondary to white/black contrasts
          if (primaryColor === secondaryColor) {
            secondaryColor = primaryColor === 'Pitch Black' ? 'Minimalist White' : 'Pitch Black';
          }

          resolve({ primary: primaryColor, secondary: secondaryColor });
        } catch (e) {
          console.error("Canvas pixel parsing failed, utilizing default colors:", e);
          resolve({ primary: 'Oatmeal Beige', secondary: 'Minimalist White' });
        }
      };

      img.onerror = () => {
        resolve({ primary: 'Oatmeal Beige', secondary: 'Minimalist White' });
      };

      img.src = base64DataUrl;
    });
  }

  /**
   * Helper to find standard color closest to custom RGB values using Euclidean distance
   */
  private static findClosestStandardColor(r: number, g: number, b: number): string {
    let minDistance = Infinity;
    let closestColor = 'Oatmeal Beige';

    for (const color of this.standardColors) {
      // Decode HEX to RGB
      const hex = color.hex.replace('#', '');
      const cR = parseInt(hex.substring(0, 2), 16);
      const cG = parseInt(hex.substring(2, 4), 16);
      const cB = parseInt(hex.substring(4, 6), 16);

      const distance = Math.sqrt(
        Math.pow(r - cR, 2) +
        Math.pow(g - cG, 2) +
        Math.pow(b - cB, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }

    return closestColor;
  }
}
