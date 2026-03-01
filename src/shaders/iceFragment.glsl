precision highp float;

uniform vec3 baseColor;       
uniform float fresnelStrength;
uniform float opacity;
uniform samplerCube envMap;
uniform float ior;
uniform vec3 lightDir;
uniform float frostAmount;
uniform bool uIsBackside; 
uniform float dispersionAmount;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectCenter;

float hash3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.7, 78.2, 45.1))) * 43758.5453123);
}

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
    if (uIsBackside) normal = -normal;

    float roughNoiseA = noise3D(vWorldPosition * 12.0);
    float roughNoiseB = noise3D(vWorldPosition * 18.0);
    float roughStrength = 0.08;

    vec3 tangent = normalize(vec3(normal.y, normal.z, -normal.x));
    vec3 bitangent = normalize(cross(normal, tangent));

    vec3 perturb = (tangent * (roughNoiseA - 0.5) +
                    bitangent * (roughNoiseB - 0.5)) * roughStrength;

    normal = normalize(normal + perturb);

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(lightDir);

    float dotNV = clamp(abs(dot(normal, viewDir)), 0.0, 1.0);

    float dispersionStrength = dispersionAmount * pow(1.0 - dotNV, 2.0);

    float iorR = ior * (1.0 - dispersionStrength);
    float iorG = ior;
    float iorB = ior * (1.0 + dispersionStrength);

    vec3 refractR = refract(-viewDir, normal, 1.0 / iorR);
    vec3 refractG = refract(-viewDir, normal, 1.0 / iorG);
    vec3 refractB = refract(-viewDir, normal, 1.0 / iorB);

    if (length(refractR) == 0.0) refractR = reflect(-viewDir, normal);
    if (length(refractG) == 0.0) refractG = reflect(-viewDir, normal);
    if (length(refractB) == 0.0) refractB = reflect(-viewDir, normal);

    float r = textureCube(envMap, refractR).r;
    float g = textureCube(envMap, refractG).g;
    float b = textureCube(envMap, refractB).b;

    vec3 refraction = vec3(r, g, b);

    float thickness = pow(1.0 - dotNV, 2.0);
    vec3 absorption = mix(vec3(1.0), vec3(0.1, 0.6, 1.0), thickness);
    refraction *= absorption;

    float distFromCenter = length(vWorldPosition - vObjectCenter);
    float coreMask = exp(-distFromCenter * 2.5); 
    float glowMult = uIsBackside ? 0.8 : 1.0; 
    vec3 internalGlow = baseColor * coreMask * glowMult;

    float F0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - dotNV, 5.0);

    fresnel *= fresnelStrength;
    fresnel = clamp(fresnel, 0.0, 1.0);

    vec3 reflection = textureCube(envMap, reflect(-viewDir, normal)).rgb;

    vec3 finalColor = mix(refraction, reflection, fresnel);
    finalColor += internalGlow * 0.5;
    finalColor += baseColor * 0.05;

    float fNoise = noise3D(vWorldPosition * 4.0);
    float frost = smoothstep(0.1, 0.5, frostAmount * (1.1 - dotNV + fNoise * 0.5));
    vec3 iceWhite = vec3(0.9, 0.95, 1.0);

    float frostVisibility = uIsBackside ? 0.5 : 0.7;
    finalColor = mix(finalColor, iceWhite, frost * frostVisibility);

    float specWeight = uIsBackside ? 0.1 : 0.5;
    float spec = pow(max(dot(reflect(-L, normal), viewDir), 0.0), 64.0);
    finalColor += vec3(1.0) * spec * specWeight;

    float baseAlpha = uIsBackside ? (opacity * 0.8) : opacity;
    float finalOpacity = mix(baseAlpha, 0.95, frost + coreMask * 0.2);

    gl_FragColor = vec4(finalColor, finalOpacity);
}