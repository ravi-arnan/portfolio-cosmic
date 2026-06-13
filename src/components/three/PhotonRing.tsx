import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import { AdditiveBlending, Color, ShaderMaterial } from 'three';
import { choreo } from './choreography';
import { ringVertexShader, ringFragmentShader } from './shaders/ring';

export default function PhotonRing() {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uScrollProgress.value = choreo.ring;
  });

  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[3.6, 3.6]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={ringVertexShader}
          fragmentShader={ringFragmentShader}
          uniforms={{
            uScrollProgress: { value: 0 },
            uColor: { value: new Color('#ffb866') },
          }}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}
