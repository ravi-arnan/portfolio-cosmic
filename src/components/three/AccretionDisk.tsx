import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three';
import { choreo } from './choreography';
import { diskVertexShader, diskFragmentShader } from './shaders/disk';

const DISK_TILT = -Math.PI / 2.2;

export default function AccretionDisk() {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uScrollProgress.value = choreo.disk;
    // The disk recedes at the finale so the horizon rim stays crisp
    material.uniforms.uFade.value = 1 - choreo.finale * 0.85;
  });

  return (
    <mesh rotation-x={DISK_TILT}>
      <ringGeometry args={[1.4, 4.2, 128, 8]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={diskVertexShader}
        fragmentShader={diskFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScrollProgress: { value: 0 },
          uFade: { value: 1 },
          uColorInner: { value: new Color('#ff9d3c') },
          uColorOuter: { value: new Color('#3ce0ff') },
        }}
        transparent
        blending={AdditiveBlending}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
