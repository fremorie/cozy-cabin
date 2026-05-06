uniform sampler2D uBakedTexture;
uniform sampler2D uAlphaTexture;
uniform sampler2D uPerlinNoise;
uniform vec3 uLightColor;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 bakedColor = texture2D(uBakedTexture, vUv);
    float alpha = texture2D(uAlphaTexture, vUv).r;
    float noise = texture2D(uPerlinNoise, vUv).r;

    vec3 color = bakedColor.rgb;

    color += uLightColor * 0.5;
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
}