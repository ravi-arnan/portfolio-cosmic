import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, InstancedMesh, MathUtils, Matrix4, Object3D, Ray, Raycaster, Vector2, Vector3 } from 'three';
import { pointer, ensurePointerListener } from './pointer';

const COUNT = 70;
/** how close the cursor ray must pass to push a shard, in field units */
const PUSH_RADIUS = 2.6;
const PUSH_STRENGTH = 1.6;

interface Shard {
  base: Vector3;
  offset: Vector3;
  scale: number;
  spin: number;
  phase: number;
}

/**
 * The crystal asteroid field vista, visited during the contributions
 * chapter. The shards are cursor-aware: the pointer ray pushes nearby
 * shards aside and they drift back when it leaves.
 */
export default function AsteroidField({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const motherRef = useRef<Group>(null);

  useEffect(ensurePointerListener, []);

  const shards = useMemo<Shard[]>(() => {
    const list: Shard[] = [];
    let seed = 7;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < COUNT; i += 1) {
      list.push({
        base: new Vector3((random() - 0.5) * 11, (random() - 0.5) * 5, (random() - 0.5) * 8),
        offset: new Vector3(),
        scale: 0.06 + random() * 0.22,
        spin: 0.2 + random() * 0.6,
        phase: random() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  const scratch = useMemo(
    () => ({
      dummy: new Object3D(),
      raycaster: new Raycaster(),
      ndc: new Vector2(),
      inverse: new Matrix4(),
      localRay: new Ray(),
      closest: new Vector3(),
      push: new Vector3(),
    }),
    []
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;

    group.rotation.y += delta * 0.02;
    if (motherRef.current) {
      motherRef.current.rotation.y += delta * 0.15;
      motherRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }

    // Cursor ray in the field's local space, so pushes follow the
    // rotating group correctly
    const { dummy, raycaster, ndc, inverse, localRay, closest, push } = scratch;
    raycaster.setFromCamera(ndc.set(pointer.x, pointer.y), state.camera);
    localRay.copy(raycaster.ray).applyMatrix4(inverse.copy(group.matrixWorld).invert());

    const time = state.clock.elapsedTime;
    shards.forEach((shard, i) => {
      localRay.closestPointToPoint(shard.base, closest);
      push.copy(shard.base).sub(closest);
      const distance = push.length();
      if (distance < PUSH_RADIUS && distance > 0.0001) {
        push.multiplyScalar(((PUSH_RADIUS - distance) / distance) * PUSH_STRENGTH);
      } else {
        push.set(0, 0, 0);
      }

      shard.offset.x = MathUtils.damp(shard.offset.x, push.x, 4, delta);
      shard.offset.y = MathUtils.damp(shard.offset.y, push.y, 4, delta);
      shard.offset.z = MathUtils.damp(shard.offset.z, push.z, 4, delta);

      dummy.position.copy(shard.base).add(shard.offset);
      dummy.rotation.set(time * shard.spin, shard.phase + time * shard.spin * 0.7, 0);
      dummy.scale.setScalar(shard.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position} ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#5d5378"
          emissive="#ff9d3c"
          emissiveIntensity={0.12}
          flatShading
          roughness={0.4}
          metalness={0.6}
        />
      </instancedMesh>

      {/* Mother crystal: the focal point of the field */}
      <group ref={motherRef}>
        <mesh scale={0.85}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#6e639c"
            emissive="#3ce0ff"
            emissiveIntensity={0.35}
            flatShading
            roughness={0.25}
            metalness={0.75}
          />
        </mesh>
      </group>
    </group>
  );
}
