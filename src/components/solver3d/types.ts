export type AvatarType = 'RUNWAY_F' | 'ATHLETIC_M' | 'CYBORG_X' | 'MANNEQUIN_D';
export type PoseKinematics = 'T_POSE' | 'RUNWAY_STRIDE' | 'CONTORTED_DRAFT' | 'SEATED_CAD';

export type GarmentMesh = 'ARCHITECTURAL_GOWN' | 'TECH_PARKA' | 'DECONSTRUCTED_BLAZER' | 'BIOMORPHIC_VEST' | 'PLEATED_KINETIC_SKIRT';
export type PolygonDensity = 'LOW_30K' | 'MID_60K' | 'QUAD_120K' | 'ULTRA_250K';

export type DrapePhysics = 'LOW' | 'MEDIUM' | 'HIGH' | 'ZERO_G' | 'KINETIC';
export type RenderEngine = 'UNREAL_5' | 'CLO3D' | 'MARVELOUS' | 'OCTANE';
export type ShaderPreset = 'Cyberpunk' | 'Minimalist' | 'Avant-Garde' | 'Desert' | 'Future-Punk' | 'Liquid Silk';

export interface CADMeshSpecification {
  // Avatar Kinematics
  avatarType: AvatarType;
  poseKinematics: PoseKinematics;
  heightCm: number;
  waistRatio: number;

  // Topology Meshes
  garmentMesh: GarmentMesh;
  polygonDensity: PolygonDensity;
  subdivisionLevels: number;

  // Drape Physics
  drapePhysics: DrapePhysics;
  fiberTensionPa: number;
  shearStiffness: number;
  bendResistance: number;
  gravitationalAcceleration: number;

  // Surface Shader Matrices
  renderEngine: RenderEngine;
  roughnessValue: number;
  normalDisplacementMm: number;
  specularIOR: number;
  subsurfaceScattering: number;
  shaderPreset: ShaderPreset;

  // Vertex Details
  customVertexNotes: string;
}

export interface RenderResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  title: string;
  specification: CADMeshSpecification;
  executionTimeMs: number;
  polygonCount: number;
  normalMapStatus: string;
}
