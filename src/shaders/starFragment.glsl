varying vec3 vColor;
varying float vBrightness;
uniform float time;
vec3 shiftColor(vec3 color, float factor) {
    float r = clamp(color.r + factor * 0.05, 0.0, 1.0);
    float g = clamp(color.g + factor * 0.05, 0.0, 1.0);
    float b = clamp(color.b + factor * 0.05, 0.0, 1.0);
    return vec3(r, g, b);
}
void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if(dist > 0.5) discard;

    float twinkle = 0.7 + 0.3 * sin(time + gl_FragCoord.x * 0.01);
    float hueShift = sin(time + gl_FragCoord.x * 0.02) * 0.5;
    vec3 shiftedColor = shiftColor(vColor, hueShift);

    gl_FragColor = vec4(shiftedColor * vBrightness * twinkle, 1.0);
}