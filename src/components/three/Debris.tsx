import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, MathUtils, Object3D } from 'three';
import { choreo } from './choreography';

const COUNT = 80;
const HORIZON_RADIUS = 1.2;

interface Crystal {
  orbitRadius: number;
  angle: number;
  speed: number;
  inclination: number;
  scale: number;
  wobble: number;
}

function easeIn(t: number): number {
  return t * t;
}

/**
 * 80 crystal shards orbiting the blackhole in one instanced draw call.
 * Scroll progress drags them toward the horizon, where they shrink to
 * nothing, consumed.
 */
export default function Debris() {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const crystals = useMemo<Crystal[]>(() => {
    const items: Crystal[] = [];
    let seed = 42;
    const random = () => {
      // Deterministic LCG so SSR snapshots and reloads look identical
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < COUNT; i += 1) {
      items.push({
        orbitRadius: 2.6 + random() * 4.4,
        angle: random() * Math.PI * 2,
        speed: 0.05 + random() * 0.25,
        inclination: (random() - 0.5) * 1.4,
        scale: 0.5 + random() * 1.1,
        wobble: random() * Math.PI * 2,
      });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const pull = easeIn(choreo.pull);
    const time = state.clock.elapsedTime;

    crystals.forEach((crystal, i) => {
      crystal.angle += crystal.speed * delta * (1 + choreo.pull * 4);

      const radius = MathUtils.lerp(crystal.orbitRadius, HORIZON_RADIUS, pull);
      const x = Math.cos(crystal.angle) * radius;
      const z = Math.sin(crystal.angle) * radius;
      // Orbits collapse toward the disk plane as they spiral in
      const y =
        Math.sin(crystal.angle * 2 + crystal.wobble) * crystal.inclination * (1 - pull * 0.85);

      // Shards shrink to nothing near the horizon
      const proximity = MathUtils.clamp((radius - HORIZON_RADIUS) / 1.5, 0, 1);
      const scale = 0.045 * crystal.scale * proximity;

      dummy.position.set(x, y, z);
      dummy.rotation.set(time * crystal.speed * 3, crystal.wobble + time * 0.4, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#5d5378"
        emissive="#ff9d3c"
        emissiveIntensity={0.1}
        flatShading
        roughness={0.35}
        metalness={0.7}
      />
    </instancedMesh>
  );
}
