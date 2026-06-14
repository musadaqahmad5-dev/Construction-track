import { BodyDimensions } from './bodyMapper';

export interface AlignmentAnatomy {
  anchorJoints: string[];
  shoulderDrapeOffsetMm: number;
  waistEaseOffsetMm: number;
  contactResistanceFactor: number; // 0.1 to 1.0 (friction coefficient)
}

export class GarmentAligner {
  /**
   * Aligns material properties to skeletal benchmarks
   */
  static alignAnchors(dims: BodyDimensions, segment: string): AlignmentAnatomy {
    const isLoose = segment.toLowerCase() === 'outerwear' || segment.toLowerCase() === 'casual';
    
    let joints = ['Neck Line Base', 'Left Acromion Joint', 'Right Acromion Joint'];
    let shoulderOffset = 8; // mm drape float gap
    let waistOffset = 18; 
    let friction = 0.4;

    if (segment.toLowerCase() === 'outerwear') {
      joints.push('Chest Contour Apex', 'Midline Lumbar Anchor');
      shoulderOffset = 15;
      waistOffset = 30;
      friction = 0.25;
    } else if (segment.toLowerCase().includes('trouser') || segment.toLowerCase().includes('pants') || segment.toLowerCase().includes('bottom')) {
      joints = ['Hip Joint Left', 'Hip Joint Right', 'Patella Left Knee', 'Patella Right Knee'];
      shoulderOffset = 0;
      waistOffset = 8;
      friction = 0.6;
    } else if (segment.toLowerCase().includes('sportswear')) {
      shoulderOffset = 3;
      waistOffset = 5;
      friction = 0.8; // compression fit
    }

    return {
      anchorJoints: joints,
      shoulderDrapeOffsetMm: shoulderOffset,
      waistEaseOffsetMm: waistOffset,
      contactResistanceFactor: friction
    };
  }
}
