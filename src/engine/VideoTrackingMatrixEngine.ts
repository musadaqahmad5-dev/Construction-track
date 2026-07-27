/**
 * LOOK VISION OS - Universal AI Video Tracking Matrix Engine
 * Repurposed from legacy telemetry system to calculate frame-by-frame camera physics.
 */

export interface CameraVector {
  panX: number;
  tiltY: number;
  zoomZ: number;
  calculatedVelocity: number;
  suggestedFraming: string;
}

export interface VideoTimelinePayload {
  totalDurationSec: number;
  motionMultiplier: number;
  cameraTrack: CameraVector[];
}

/**
 * Legacy industrial matrix parser converted to compute AI Camera paths
 * @param coordinateCluster Array of legacy X, Y positional telemetry numbers
 * @returns Refined cinematic camera paths ready for AI Studio ingestion
 */
export function mapCoordinatesToVideoVectors(
  coordinateCluster: { x: number; y: number; density?: number }[]
): VideoTimelinePayload {
  
  if (!coordinateCluster || coordinateCluster.length === 0) {
    // Default safe fallback if data stream is empty
    return {
      totalDurationSec: 10,
      motionMultiplier: 5,
      cameraTrack: [{ panX: 0, tiltY: 0, zoomZ: 1.0, calculatedVelocity: 5, suggestedFraming: "Steady Medium Shot" }]
    };
  }

  const cameraTrack: CameraVector[] = [];
  let totalVelocityAccumulator = 0;

  // Process the legacy 450 lines mathematical density looping structure cleanly
  coordinateCluster.forEach((point, index) => {
    // 1. Map Horizontal translations (X-Axis) to Camera Panning limits (-100 to 100)
    const panX = Math.min(Math.max((point.x / 1000) * 100, -100), 100);

    // 2. Map Vertical translations (Y-Axis) to Camera Tilting limits (-100 to 100)
    const tiltY = Math.min(Math.max((point.y / 1000) * 100, -100), 100);

    // 3. Compute dynamic zoom level based on historical cluster points grouping density
    const clusterDensity = point.density || (index > 0 ? Math.abs(point.x - coordinateCluster[index - 1].x) : 10);
    const zoomZ = clusterDensity > 50 ? 1.5 : 1.0; // Higher density triggers dynamic zoom-in frames

    // 4. Calculate camera tracking acceleration speed (Motion Scale 1-10)
    const calculatedVelocity = Math.min(Math.max(Math.round(clusterDensity / 15), 1), 10);
    totalVelocityAccumulator += calculatedVelocity;

    // 5. Categorize mathematical curves into clean cinematography framing descriptions
    let suggestedFraming = "Medium Eye-Level Shot";
    if (tiltY > 45) {
      suggestedFraming = "Low-Angle Hero Upward Pan";
    } else if (tiltY < -45) {
      suggestedFraming = "High-Angle Dramatic Crane Descent";
    } else if (Math.abs(panX) > 50) {
      suggestedFraming = "Fast Side-to-Side Cinematic Tracking Shot";
    }

    cameraTrack.push({
      panX: parseFloat(panX.toFixed(2)),
      tiltY: parseFloat(tiltY.toFixed(2)),
      zoomZ,
      calculatedVelocity,
      suggestedFraming
    });
  });

  // Calculate the globally scaled motion intensity multiplier across all scenes
  const averageVelocity = totalVelocityAccumulator / coordinateCluster.length;
  const motionMultiplier = Math.min(Math.max(Math.round(averageVelocity), 1), 10);

  return {
    totalDurationSec: 10,
    motionMultiplier,
    cameraTrack: cameraTrack.slice(0, 5) // Cap vectors array to maximum 5 keyframe scenes for AI efficiency
  };
}

/**
 * Automates formatting of generated math vectors into a clean script text for Google AI Studio
 */
export function formatVectorsForAIStudio(payload: VideoTimelinePayload): string {
  return `MAPPED GEOMETRY CONTEXT:
  - Video Target Duration: ${payload.totalDurationSec}s
  - Global Motion Intensity: ${payload.motionMultiplier}/10
  - Calculated Camera Vectors count: ${payload.cameraTrack.length}
  - Primary Camera Framing Logic: "${payload.cameraTrack[0]?.suggestedFraming || "Cinematic Static"}"`;
}
