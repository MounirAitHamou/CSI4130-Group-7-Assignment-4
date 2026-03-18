attribute float speed;
attribute float offset;
attribute float driftScale;

uniform float time;
uniform float areaSize;
uniform float height;
uniform float windX;
uniform float windZ;
uniform float baseSize;
uniform float baseOpacity;

varying float vOpacity;

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float noise(vec2 x) {

    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0;

    return mix(
        mix(hash(n+0.0), hash(n+1.0), f.x),
        mix(hash(n+57.0), hash(n+58.0), f.x),
        f.y
    );
}

void main() {

    vec3 pos = position;

    float fall = mod(pos.y - speed * time + offset, height);

    pos.y = fall;

    float n = noise(vec2(pos.x + time * 0.2, pos.z));

    float driftX = (n - 0.5) * driftScale;
    float driftZ = (noise(vec2(pos.z, pos.x + time * 0.2)) - 0.5) * driftScale;

    pos.x += driftX + windX * time;
    pos.z += driftZ + windZ * time;

    vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);

    float depthFade = 1.0 - clamp(abs(mvPosition.z) / 60.0,0.0,1.0);

    float nightBoost = 1.0 + (1.0-depthFade)*0.5;

    gl_PointSize = baseSize * depthFade * nightBoost;

    vOpacity = baseOpacity * depthFade * nightBoost;

    gl_Position = projectionMatrix * mvPosition;
}