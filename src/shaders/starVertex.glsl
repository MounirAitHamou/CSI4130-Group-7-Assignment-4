varying vec3 vColor;
varying float vBrightness;
attribute float brightness;
void main() {
    vColor = color;
    vBrightness = brightness;
    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}