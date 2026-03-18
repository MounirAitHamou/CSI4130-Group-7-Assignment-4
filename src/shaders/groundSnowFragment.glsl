varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uShadowColor;
uniform vec3 uSunDirection;
uniform float uNoiseScale;
uniform float uBumpStrength;
uniform float uSparkleStrength;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 23.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
               mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
           mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
               mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

void main() {
    vec3 pos = vWorldPosition * uNoiseScale;
    
    float h1 = noise(pos);
    float h2 = noise(pos + vec3(0.02, 0.0, 0.0));
    float h3 = noise(pos + vec3(0.0, 0.0, 0.02));

    vec3 slope = vec3((h1 - h2), 1.0, (h1 - h3));
    vec3 perturbedNormal = normalize(vec3(slope.x * uBumpStrength * 10.0, 1.0, slope.z * uBumpStrength * 10.0));

    float diff = max(dot(perturbedNormal, normalize(uSunDirection)), 0.0);
    
    vec3 lighting = mix(uShadowColor, uBaseColor, diff * 0.8 + 0.2);

    float sparkle = pow(hash(vWorldPosition * 100.0 + sin(uTime * 0.5)), 50.0) * uSparkleStrength;
    
    gl_FragColor = vec4(lighting + vec3(sparkle), 1.0);
}