import * as THREE from 'three';

export type FabricType = 'velvet' | 'silk' | 'carbon_fiber';

export function createPremiumFabricMaterial(
  fabricType: FabricType
): THREE.MeshStandardMaterial {
  try {
    switch (fabricType) {
      case 'velvet': {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x3b0764),
          roughness: 0.78,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.45,
          sheen: 1.0,
          sheenColor: new THREE.Color(0xa855f7),
          sheenRoughness: 0.6
        });
      }

      case 'silk': {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x0284c7),
          roughness: 0.12,
          metalness: 0.35,
          anisotropy: 0.8,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          specularIntensity: 1.0
        });
      }

      case 'carbon_fiber': {
        const normalMap = createCarbonFiberNormalTexture();
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x18181b),
          roughness: 0.25,
          metalness: 0.90,
          normalMap,
          normalScale: new THREE.Vector2(1.5, 1.5),
          clearcoat: 0.5,
          clearcoatRoughness: 0.2
        });
      }

      default: {
        return createFallbackWireframeMaterial();
      }
    }
  } catch {
    return createFallbackWireframeMaterial();
  }
}

function createCarbonFiberNormalTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    throw new Error('DOM Document is required for canvas texture generation');
  }

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context creation failed');
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const cellX = Math.floor(x / 8) % 2;
      const cellY = Math.floor(y / 8) % 2;
      const isShifted = (cellX ^ cellY) === 1;

      const angle = isShifted ? 0.785398 : -0.785398;
      const nx = Math.cos(angle) * 0.6;
      const ny = Math.sin(angle) * 0.6;
      const nz = Math.sqrt(Math.max(0, 1 - (nx * nx + ny * ny)));

      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor(nz * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.needsUpdate = true;
  return texture;
}

function createFallbackWireframeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x6366f1),
    emissive: new THREE.Color(0x6366f1),
    emissiveIntensity: 0.8,
    wireframe: true,
    roughness: 0.5,
    metalness: 0.1
  });
}
