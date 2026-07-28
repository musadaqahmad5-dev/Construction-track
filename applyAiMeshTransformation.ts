import * as THREE from "three";

export interface AiMeshPayload {
  primaryColorHex: string;
  recommendedScale: [number, number, number];
  materialTextureType: "matte" | "metallic" | "glossy";
}

export function applyAiMeshTransformation(
  mannequinMesh: THREE.Mesh,
  garmentMesh: THREE.Mesh,
  aiPayload: AiMeshPayload
): void {
  try {
    if (!aiPayload || typeof aiPayload !== "object") {
      return;
    }

    const { primaryColorHex, recommendedScale, materialTextureType } = aiPayload;

    if (
      typeof primaryColorHex !== "string" ||
      !Array.isArray(recommendedScale) ||
      recommendedScale.length !== 3 ||
      typeof materialTextureType !== "string"
    ) {
      return;
    }

    const [scaleX, scaleY, scaleZ] = recommendedScale;
    if (
      typeof scaleX !== "number" ||
      isNaN(scaleX) ||
      typeof scaleY !== "number" ||
      isNaN(scaleY) ||
      typeof scaleZ !== "number" ||
      isNaN(scaleZ)
    ) {
      return;
    }

    if (mannequinMesh && mannequinMesh.scale) {
      const lerpFactor = 0.1;
      mannequinMesh.scale.x += (scaleX - mannequinMesh.scale.x) * lerpFactor;
      mannequinMesh.scale.y += (scaleY - mannequinMesh.scale.y) * lerpFactor;
      mannequinMesh.scale.z += (scaleZ - mannequinMesh.scale.z) * lerpFactor;
    }

    if (!garmentMesh || !garmentMesh.material) {
      return;
    }

    const material = Array.isArray(garmentMesh.material)
      ? garmentMesh.material[0]
      : garmentMesh.material;

    if (!material) {
      return;
    }

    const isMeshStandard =
      material.type === "MeshStandardMaterial" ||
      (material as any).isMeshStandardMaterial === true ||
      (typeof THREE !== "undefined" && THREE.MeshStandardMaterial && material instanceof THREE.MeshStandardMaterial);

    if (!isMeshStandard) {
      return;
    }

    const standardMat = material as THREE.MeshStandardMaterial;

    if (typeof THREE !== "undefined" && THREE.Color) {
      standardMat.color = new THREE.Color(primaryColorHex);
    } else if (standardMat.color && typeof standardMat.color.set === "function") {
      standardMat.color.set(primaryColorHex);
    }

    switch (materialTextureType) {
      case "matte":
        standardMat.roughness = 0.9;
        standardMat.metalness = 0.1;
        break;
      case "metallic":
        standardMat.roughness = 0.2;
        standardMat.metalness = 0.9;
        break;
      case "glossy":
        standardMat.roughness = 0.05;
        standardMat.metalness = 0.3;
        break;
      default:
        break;
    }

    standardMat.needsUpdate = true;
  } catch {
    return;
  }
}
