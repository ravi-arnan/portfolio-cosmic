import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Color, Group, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { scrollState } from '../../lib/scrollState';
import { choreo, updateChoreo } from './choreography';
import { pointer, ensurePointerListener } from './pointer';
import EventHorizon from './EventHorizon';
import AccretionDisk from './AccretionDisk';
import PhotonRing from './PhotonRing';
import Debris from './Debris';
import Planet from './Planet';
import AsteroidField from './AsteroidField';

/* Vista anchors: scenery the camera turns to when it leaves the hole */
const PLANET_POSITION: [number, number, number] = [-18, 4, -12];
const FIELD_POSITION: [number, number, number] = [20, 2, -6];

const VOID = '#030014';
const DAMP = 2.2;

/** Samples the chapter choreography once per frame for every rig below. */
function Choreographer() {
  useFrame(() => {
    updateChoreo(scrollState.pageProgress);
  });
  return null;
}

/** Camera flies between chapter positions and pans between vistas. */
function CameraRig() {
  const lookTarget = useRef(new Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    camera.position.x = MathUtils.damp(camera.position.x, choreo.camX, DAMP, delta);
    camera.position.y = MathUtils.damp(camera.position.y, choreo.camY, DAMP, delta);
    camera.position.z = MathUtils.damp(camera.position.z, choreo.camZ, DAMP, delta);
    camera.fov = MathUtils.damp(camera.fov, choreo.fov, DAMP, delta);
    camera.updateProjectionMatrix();

    const look = lookTarget.current;
    look.x = MathUtils.damp(look.x, choreo.lookX, DAMP, delta);
    look.y = MathUtils.damp(look.y, choreo.lookY, DAMP, delta);
    look.z = MathUtils.damp(look.z, choreo.lookZ, DAMP, delta);
    camera.lookAt(look);
  });
  return null;
}

/** The blackhole drifts around the composition as chapters change. */
function BlackholeGroup() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // At the finale the horizon leans with the cursor, weighted by presence
    const sway = choreo.finale;
    const targetX = choreo.holeX + pointer.x * 0.45 * sway;
    const targetY = choreo.holeY + pointer.y * 0.25 * sway;
    group.position.x = MathUtils.damp(group.position.x, targetX, DAMP, delta);
    group.position.y = MathUtils.damp(group.position.y, targetY, DAMP, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, choreo.yaw, DAMP, delta);
    const scale = MathUtils.damp(group.scale.x, choreo.holeScale, DAMP, delta);
    group.scale.setScalar(scale);
    // Slow idle breathing so the scene never feels frozen between scrolls
    group.position.y += Math.sin(state.clock.elapsedTime * 0.4) * 0.0015;
  });

  return (
    <group ref={groupRef}>
      <EventHorizon />
      <AccretionDisk />
      <PhotonRing />
      <Debris />
    </group>
  );
}

/** Starfield parallax: the universe drifts as chapters pass. */
function StarsRig() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = MathUtils.damp(group.rotation.y, choreo.spin * 0.22, DAMP, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, choreo.spin * 0.06, DAMP, delta);
  });

  return (
    <group ref={groupRef}>
      <Stars radius={150} depth={60} count={4500} factor={3} fade speed={0.3} />
    </group>
  );
}

/** Bloom calms down at the finale so the horizon rim stays a crisp line. */
function BloomRig({ target }: { target: React.RefObject<{ intensity: number } | null> }) {
  useFrame(() => {
    if (target.current) target.current.intensity = 1.3 - choreo.finale * 0.55;
  });
  return null;
}

function fadeOutPoster() {
  document.getElementById('hero-poster')?.classList.add('opacity-0');
}

export default function Scene() {
  useEffect(ensurePointerListener, []);
  const bloomRef = useRef<{ intensity: number } | null>(null);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, position: [0, 1.2, 8] }}
      scene={{ background: new Color(VOID) }}
      onCreated={fadeOutPoster}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0.5, 2.5]} intensity={3} color="#ff9d3c" />
      {/* Vista lights, parented to their scenery */}
      <pointLight position={[-13, 7, -7]} intensity={5} color="#3ce0ff" />
      <pointLight position={[15.5, 4.5, -2]} intensity={4} color="#ff9d3c" />

      <Choreographer />
      <BlackholeGroup />
      <Planet position={PLANET_POSITION} />
      <AsteroidField position={FIELD_POSITION} />
      <StarsRig />
      <CameraRig />

      <BloomRig target={bloomRef} />
      <EffectComposer multisampling={0}>
        <Bloom
          ref={bloomRef}
          mipmapBlur
          intensity={1.3}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
        />
      </EffectComposer>
    </Canvas>
  );
}
