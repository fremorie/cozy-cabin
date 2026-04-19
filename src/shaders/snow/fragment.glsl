uniform sampler2D uTexture;

void main() {
    vec2 uv = gl_PointCoord;
    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;
}