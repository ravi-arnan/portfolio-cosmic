import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import { pointer, ensurePointerListener } from './pointer';

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.5);
    gl_FragColor = vec4(uColor, fresnel * 0.7);
  }
`;

/** Bakes the hover caption into a glowing canvas texture, no font deps. */
function makeCaptionTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '700 92px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#3ce0ff';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#bdf3ff';
    ctx.fillText('i use zorin os', 512, 128);
    // Second pass tightens the core glyphs over the glow
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eafcff';
    ctx.fillText('i use zorin os', 512, 128);
  }
  return new CanvasTexture(canvas);
}

/** screen-space distance below which the planet counts as hovered */
const HOVER_RADIUS = 0.3;

/**
 * The ringed planet vista, seen during the education and certifications
 * chapters. Hovering it reveals a glowing confession: i use zorin os.
 */
export default function Planet({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  const moonsRef = useRef<Group>(null);
  const captionRef = useRef<MeshBasicMaterial>(null);
  const hoverAmount = useRef(0);
  const projected = useMemo(() => new Vector3(), []);
  const captionTexture = useMemo(makeCaptionTexture, []);

  useEffect(ensurePointerListener, []);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
    if (moonsRef.current) moonsRef.current.rotation.y = state.clock.elapsedTime * 0.18;

    // Hover: planet center projected to screen space vs the pointer
    projected.set(position[0], position[1], position[2]).project(state.camera);
    const onScreen = projected.z < 1;
    const hovered =
      onScreen &&
      Math.hypot(projected.x - pointer.x, projected.y - pointer.y) < HOVER_RADIUS;
    hoverAmount.current = MathUtils.damp(hoverAmount.current, hovered ? 1 : 0, 5, delta);

    const caption = captionRef.current;
    if (caption) caption.opacity = hoverAmount.current;
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2.2, 48, 48]} />
          <meshStandardMaterial color="#3d4d7a" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Atmosphere rim */}
        <mesh scale={1.05}>
          <sphereGeometry args={[2.2, 48, 48]} />
          <shaderMaterial
            vertexShader={atmosphereVertex}
            fragmentShader={atmosphereFragment}
            uniforms={{ uColor: { value: new Color('#3ce0ff') } }}
            transparent
            blending={AdditiveBlending}
            side={BackSide}
            depthWrite={false}
          />
        </mesh>
        {/* Rings */}
        <mesh rotation-x={-Math.PI / 2.6} rotation-z={0.2}>
          <ringGeometry args={[3.1, 4.6, 96]} />
          <meshBasicMaterial
            color="#1f5a6e"
            transparent
            opacity={0.55}
            blending={AdditiveBlending}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Hover caption: glows in over the planet, bloom does the rest */}
      <Billboard position={[0, 3.6, 0]}>
        <mesh>
          <planeGeometry args={[6.4, 1.6]} />
          <meshBasicMaterial
            ref={captionRef}
            map={captionTexture}
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      <group ref={moonsRef}>
        <mesh position={[5.6, 0.6, 0]} scale={0.28}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color="#8a8aa8" roughness={0.9} />
        </mesh>
        <mesh position={[-4.2, -0.9, 3.2]} scale={0.18}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color="#6e6e8c" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
