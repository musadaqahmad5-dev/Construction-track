import { PoseEstimationResult, Point2D } from './visionContracts';

export class PoseExtraction {
  /**
   * Evaluates image files or canvases to calculate human skeleton posture coordinates.
   * NOTE: Large deep learning weight execution (TensorFlow MediaPipe Model Core) 
   * is UNSUPPORTED on client-side sandboxed iframes.
   */
  static extractPose(imageSource: HTMLImageElement | HTMLCanvasElement): PoseEstimationResult {
    // 1. Mark phase as Unsupported/Inactive due to missing WebGL runtime inside iframe context
    console.warn('[PoseExtraction] MediaPipe/PoseNet pose model is currently UNSUPPORTED in local browser sandboxes. Running skeleton mockup fallback.');

    // 2. Returns empty, structured keypoint templates with zero-confidence bounds
    const defaultCoords: Point2D = { x: 0, y: 0, confidence: 0 };
    const keypointNames: Array<'leftShoulder' | 'rightShoulder' | 'leftElbow' | 'rightElbow' | 'leftWrist' | 'rightWrist' | 'leftHip' | 'rightHip'> = [
      'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist', 'leftHip', 'rightHip'
    ];

    return {
      status: 'UNSUPPORTED',
      keypoints: keypointNames.map(name => ({
        name,
        coords: { ...defaultCoords }
      })),
      bbox: {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0
      },
      error: 'MediaPipe / Tensorflow framework layers are unbooted in client container.'
    };
  }
}
