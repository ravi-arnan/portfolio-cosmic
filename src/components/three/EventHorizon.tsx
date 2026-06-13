import { AdditiveBlending, BackSide, Color } from 'three';

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
    gl_FragColor = vec4(uColor, fresnel * 0.9);
  }
`;

/** Pure black sphere plus a thin ember rim where light grazes the edge. */
export default function EventHorizon() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={{ uColor: { value: new Color('#ff9d3c') } }}
          transparent
          blending={AdditiveBlending}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
