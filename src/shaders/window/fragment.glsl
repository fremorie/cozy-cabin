precision mediump float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec3 color = vec3(1.0);

    float edge =
        smoothstep(0.0, 0.2, vUv.x) *
        smoothstep(1.0, 0.8, vUv.x) *
        smoothstep(0.0, 0.2, vUv.y) *
        smoothstep(1.0, 0.8, vUv.y);

    float flicker =
        0.9 +
        0.1 * sin(uTime * 3.0) +
        0.05 * sin(uTime * 11.0);

    vec3 warm = vec3(1.0, 0.6, 0.3);
    vec3 hot  = vec3(1.0, 0.96, 0.71);

    color = mix(warm, hot, vUv.y) * edge * flicker;

    float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898,78.233))) * 43758.5453);
    color *= 0.9 + 0.1 * noise;

    color *= 2.0;

    gl_FragColor = vec4(color, 1.0);
}