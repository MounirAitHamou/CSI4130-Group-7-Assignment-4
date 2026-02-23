precision highp float;

uniform vec3 uSnowColor;
uniform vec3 uShadowColor;
uniform float uTime;
uniform sampler2D uSnowTexture;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

float hash(vec3 p) {
    p = fract(p * 0.78583846 + 0.1);
    p *= 24.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));

    float dotNL = dot(normal, lightDir);
    float wrap = 0.5;
    float lightIntensity = max(0.0, (dotNL + wrap) / (1.0 + wrap));
    
    vec3 baseColor = mix(uShadowColor, uSnowColor, lightIntensity);
    
    float sparkleNoise = hash(vWorldPosition * 150.0);
    
    float twinkle = sin(uTime * 5.0 + sparkleNoise * 10.0) * 0.5 + 0.5;
    
    float threshold = 0.997;
    float sparkle = 0.0;
    
    if (sparkleNoise > threshold) {
        float reflection = max(0.0, dot(normal, viewDir));
        sparkle = pow(reflection, 20.0) * twinkle;
    }
    vec3 texColor = texture2D(uSnowTexture, vUv).rgb;

    vec3 finalBase = baseColor * texColor;

    vec3 finalColor = finalBase + (sparkle * 1.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
}