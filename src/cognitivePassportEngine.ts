export interface StylePassport {
  passportId: string;
  colorAffinityVector: number[];
  preferredFabricTones: string[];
  globalStyleMatchScore: number;
  lastUpdatedEpoch: number;
}

export interface FeedbackPayload {
  itemColorHex: string;
  interactionType: 'try_on' | 'save' | 'discard';
  brandAffinity: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  if (isNaN(bigint)) {
    return [0.5, 0.5, 0.5];
  }
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

function extract8DColorVector(hex: string): number[] {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = (max + min) / 2;
  const saturation = max === min ? 0 : (max - min) / (1 - Math.abs(2 * brightness - 1));
  const warmCool = r - b;
  const earthness = (r + g) / 2 - b;
  const contrast = max - min;

  return [r, g, b, brightness, saturation, warmCool, earthness, contrast];
}

export function mutateStylePassportVector(
  currentPassport: StylePassport,
  feedbackPayload: FeedbackPayload
): StylePassport {
  try {
    const vectorLength = 8;
    const currentVector = Array.isArray(currentPassport.colorAffinityVector) && currentPassport.colorAffinityVector.length === vectorLength
      ? [...currentPassport.colorAffinityVector]
      : Array(vectorLength).fill(0.5);

    const inputVector = extract8DColorVector(feedbackPayload.itemColorHex || '#6366f1');

    let multiplier = 0.05;
    let scoreDelta = 0.5;

    if (feedbackPayload.interactionType === 'save') {
      multiplier = 0.15;
      scoreDelta = 2.0;
    } else if (feedbackPayload.interactionType === 'try_on') {
      multiplier = 0.05;
      scoreDelta = 0.5;
    } else if (feedbackPayload.interactionType === 'discard') {
      multiplier = -0.08;
      scoreDelta = -1.5;
    }

    const newVector = currentVector.map((val, idx) => {
      const target = inputVector[idx] ?? 0.5;
      const updated = val + (target - val) * multiplier;
      return Math.min(1.0, Math.max(0.0, Number(updated.toFixed(4))));
    });

    const updatedScore = Math.min(100, Math.max(0, Number((currentPassport.globalStyleMatchScore + scoreDelta).toFixed(2))));

    const updatedFabricTones = [...(currentPassport.preferredFabricTones || [])];
    if (feedbackPayload.brandAffinity && !updatedFabricTones.includes(feedbackPayload.brandAffinity)) {
      updatedFabricTones.push(feedbackPayload.brandAffinity);
    }

    return {
      passportId: currentPassport.passportId || `pass_${Math.random().toString(36).substring(2, 10)}`,
      colorAffinityVector: newVector,
      preferredFabricTones: updatedFabricTones,
      globalStyleMatchScore: updatedScore,
      lastUpdatedEpoch: Date.now()
    };
  } catch {
    return {
      ...currentPassport,
      lastUpdatedEpoch: Date.now()
    };
  }
}

export async function saveCognitivePassportToStore(
  userId: string,
  updatedPassport: StylePassport
): Promise<boolean> {
  try {
    const response = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        cognitivePassport: updatedPassport,
        updatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
