export const diskVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const diskFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uFade;
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;
  varying vec2 vUv;

  // Cheap value noise, two octaves is enough under bloom
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // Rotating the domain between octaves kills the concentric grid
  // artifacts that plain stacked value noise produces on a polar ring
  float fbm(vec2 p) {
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    float value = 0.0;
    float amplitude = 0.6;
    for (int i = 0; i < 3; i += 1) {
      value += amplitude * noise(p);
      p = rot * p * 2.1 + vec2(7.3, 1.7);
      amplitude *= 0.45;
    }
    return value;
  }

  void main() {
    // RingGeometry UVs: convert to polar around the center
    vec2 centered = vUv - 0.5;
    float radius = length(centered) * 2.0;       // 0 inner .. 1 outer
    float angle = atan(centered.y, centered.x);

    // Keplerian shear: inner bands orbit faster
    float speed = (0.4 + uScrollProgress * 1.2) / max(radius, 0.15);
    float band = angle * 2.0 + uTime * speed;

    // Low-contrast streaks: smooth gas, not hard-edged rings
    float n = fbm(vec2(band, radius * 6.0));
    float streaks = mix(0.75, 1.25, n);

    // Radial falloff: hot inner edge, fading outer rim
    float falloff = smoothstep(1.0, 0.05, radius) * smoothstep(0.0, 0.18, radius);

    // Smooth haze base so the dim side never shows raw structure
    float haze = falloff * 0.4;

    // Doppler beaming cheat, gentler so the far side stays clean
    float doppler = 1.0 + 0.45 * sin(angle);

    float brightness = (haze + falloff * 0.65 * streaks) * doppler;
    brightness *= 1.0 + uScrollProgress * 1.4;   // disk feeds as you fall in

    vec3 color = mix(uColorInner, uColorOuter, smoothstep(0.1, 0.9, radius));
    gl_FragColor = vec4(color * brightness, brightness) * uFade;
  }
`;
