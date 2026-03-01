precision highp float;

uniform vec3 baseColor;       
uniform float fresnelStrength;
uniform float opacity;
uniform samplerCube envMap;
uniform float ior;
uniform vec3 lightDir;
uniform float frostAmount;
uniform bool uIsBackside; 

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectCenter;
// 3D hash function for noise generation
float hash3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.7, 78.2, 45.1))) * 43758.5453123);
}
// Perlin-like noise function for subtle surface variation
float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash3D(i + vec3(0,0,0)), hash3D(i + vec3(1,0,0)), f.x),
            mix(hash3D(i + vec3(0,1,0)), hash3D(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash3D(i + vec3(0,0,1)), hash3D(i + vec3(1,0,1)), f.x),
            mix(hash3D(i + vec3(0,1,1)), hash3D(i + vec3(1,1,1)), f.x), f.y), f.z
    );
}

void main() {
    vec3 normal = normalize(vWorldNormal);
    // Flip normal for internal shading calculation
    if (uIsBackside) normal = -normal; 

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(lightDir);
    
    // Using absolute dot product makes the edge-glow (Fresnel) 
    // behave the same whether looking at the front or through the back.
    float dotNV = clamp(abs(dot(normal, viewDir)), 0.0, 1.0);

    // 2. Refraction & Absorption
    vec3 refractDir = refract(-viewDir, normal, 1.0/ior);
    vec3 env = textureCube(envMap, refractDir).rgb;
    vec3 refraction = max(env, baseColor * 0.2);

    float thickness = pow(1.0 - dotNV, 2.0);
    vec3 absorption = mix(vec3(1.0), vec3(0.1, 0.6, 1.0), thickness);
    refraction *= absorption;

    // 3. Stabilized Internal Glow
    float distFromCenter = length(vWorldPosition - vObjectCenter);
    float coreMask = exp(-distFromCenter * 2.5); 
    float glowMult = uIsBackside ? 0.8 : 1.0; 
    vec3 internalGlow = baseColor * coreMask * glowMult;

    // 4. Fresnel Reflection
    float fresnel = pow(1.0 - dotNV, 3.0) * fresnelStrength;
    vec3 reflection = textureCube(envMap, reflect(-viewDir, normal)).rgb;

    // 5. Final Color Mix
    vec3 finalColor = mix(refraction, reflection, clamp(fresnel, 0.0, 1.0));
    finalColor += internalGlow * 0.5;
    finalColor += baseColor * 0.05;

    // 6. Stabilized Frost
    float fNoise = noise3D(vWorldPosition * 4.0);
    float frost = smoothstep(0.1, 0.5, frostAmount * (1.1 - dotNV + fNoise * 0.5));
    vec3 iceWhite = vec3(0.9, 0.95, 1.0);
    
    float frostVisibility = uIsBackside ? 0.5 : 0.7;
    finalColor = mix(finalColor, iceWhite, frost * frostVisibility);

    // 7. Specular
    float specWeight = uIsBackside ? 0.1 : 0.5;
    float spec = pow(max(dot(reflect(-L, normal), viewDir), 0.0), 64.0);
    finalColor += vec3(1.0) * spec * specWeight;

    // 8. Opacity Stabilization
    float baseAlpha = uIsBackside ? (opacity * 0.8) : opacity;
    float finalOpacity = mix(baseAlpha, 0.95, frost + coreMask * 0.2);

    gl_FragColor = vec4(finalColor, finalOpacity);
}