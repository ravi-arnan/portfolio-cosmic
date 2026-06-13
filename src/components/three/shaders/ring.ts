export const ringVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fake gravitational lensing on a single camera-facing quad:
 * a hot photon ring at the horizon edge plus two faint arcs above and
 * below, standing in for the disk light bent over the blackhole.
 */
export const ringFragmentShader = /* glsl */ `
  uniform float uScrollProgress;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float dist = length(centered);

    // Photon ring: thin, hot circle just outside the horizon
    float ring = smoothstep(0.045, 0.0, abs(dist - 0.62)) * 1.6;

    // Lensed disk arcs: vertical lobes hugging the sphere
    float lobe = exp(-pow((dist - 0.72) * 6.0, 2.0));
    float vertical = pow(abs(centered.y) / max(dist, 0.001), 2.0);
    float arcs = lobe * vertical * 0.85;

    float intensity = (ring + arcs) * (0.7 + uScrollProgress * 0.9);
    if (intensity < 0.01) discard;

    gl_FragColor = vec4(uColor * intensity, intensity);
  }
`;
