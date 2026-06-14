import { SegmentMask, IngestionPipelineResponse } from './visionContracts';

export class GarmentMapping {
  /**
   * Translates 2D garment coordinates to body boundary spaces.
   */
  static calculateTransform(mask: SegmentMask, garmentWidth: number, garmentHeight: number) {
    if (mask.status === 'UNSUPPORTED') {
      console.warn(`[GarmentMapping] Zone ${mask.zone} is UNSUPPORTED. Overlays are disabled.`);
      return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, possible: false };
    }

    if (mask.polygon.length < 2) {
      return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, possible: false };
    }

    // Determine span widths between boundary coordinates
    const p1 = mask.polygon[0];
    const p2 = mask.polygon[1];
    const targetWidth = Math.abs(p2.x - p1.x);

    const scaleX = targetWidth / garmentWidth;
    const scaleY = scaleX; // Preserve aspect ratio by default

    return {
      scaleX,
      scaleY,
      translateX: p1.x,
      translateY: p1.y,
      possible: true
    };
  }

  /**
   * Returns progress status updates across the visual pose pipeline.
   */
  static estimatePipelineStatus(): IngestionPipelineResponse[] {
    return [
      {
        step: 'Post Image Upload Ingestion',
        status: 'SUPPORTED',
        isCompleted: true,
        notes: 'File systems and image caching buffers are active.'
      },
      {
        step: 'Static Feature Polygon Alignment',
        status: 'SUPPORTED',
        isCompleted: true,
        notes: 'Anchors align dynamically on primary canvas zones.'
      },
      {
        step: 'Joint Coordinate Detection',
        status: 'UNSUPPORTED',
        isCompleted: false,
        notes: 'MediaPipe pose models require standard Node package installations.'
      },
      {
        step: '3D Mesh Draping Fitting',
        status: 'EXPERIMENTAL',
        isCompleted: false,
        notes: 'WebGPU tension calculations are active under trial flags.'
      }
    ];
  }
}
