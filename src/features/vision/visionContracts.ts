export type PipelineStatus = 'SUPPORTED' | 'UNSUPPORTED' | 'EXPERIMENTAL' | 'DEPRECATED';

export interface Point2D {
  x: number;
  y: number;
  confidence: number;
}

export interface BoundingBox2D {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface PoseKeypoint {
  name: 'nose' | 'leftShoulder' | 'rightShoulder' | 'leftElbow' | 'rightElbow' | 'leftWrist' | 'rightWrist' | 'leftHip' | 'rightHip';
  coords: Point2D;
}

export interface PoseEstimationResult {
  status: PipelineStatus;
  keypoints: PoseKeypoint[];
  bbox: BoundingBox2D;
  error?: string;
}

export interface SegmentMask {
  zone: 'upper-chest' | 'torso' | 'left-sleeve' | 'right-sleeve' | 'waistline' | 'lower-body';
  status: PipelineStatus;
  polygon: Point2D[];
  pixelCount: number;
}

export interface IngestionPipelineResponse {
  step: string;
  status: PipelineStatus;
  isCompleted: boolean;
  notes: string;
}
