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
    float ring = smoothstep(0.04, 0.0, abs(dist - 0.6)) * 1.5;

    // Lensed accretion-disk arcs (the Gargantua signature): the disk image
    // bent up over the top and down under the bottom of the hole. Strong
    // top/bottom, only a faint side base so the silhouette stays readable.
    float band = exp(-pow((dist - 0.72) * 5.5, 2.0));
    float topBottom = pow(clamp(abs(centered.y) / max(dist, 0.001), 0.0, 1.0), 1.7);
    float arcs = band * (0.1 + 1.0 * topBottom);

    float intensity = (ring + arcs) * (0.7 + uScrollProgress * 0.9);
    if (intensity < 0.01) discard;

    // Hot ember core warming to a lighter gold along the wrap
    vec3 col = mix(uColor, vec3(1.0, 0.88, 0.62), smoothstep(0.6, 0.9, dist));
    gl_FragColor = vec4(col * intensity, intensity);
  }
`;
