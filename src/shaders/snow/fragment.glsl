uniform sampler2D uTexture;

varying float vRotation;

vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);

    uv -= 0.5;
    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;

    return uv;
}

void main() {
    vec2 uv = gl_PointCoord;
    uv = rotate(uv, vRotation);

    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;
}