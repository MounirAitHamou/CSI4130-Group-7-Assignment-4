attribute float twinkleOffset;
attribute float speed;
attribute float driftX;
attribute float driftZ;
attribute float swayOffset;
varying float vOpacity;
uniform float time;
uniform float delta;
uniform float baseSize;
uniform float baseOpacity;
uniform float windX;
uniform float windZ;

void main() {
    vec3 pos = position;

    pos.x += driftX + windX * delta + sin(time + swayOffset) * 0.4;
    pos.z += driftZ + windZ * delta + cos(time + swayOffset) * 0.4;
    pos.y -= speed * delta;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = baseSize * (1.0 + 0.5 * sin(time * 3.0 + twinkleOffset));
    vOpacity = baseOpacity + 0.2 * sin(time * 2.0 + twinkleOffset);
}