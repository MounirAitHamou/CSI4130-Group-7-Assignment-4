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

float hash3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.7, 78.2, 45.1))) * 43758.5453123);
}

float noise3D(vec3 p) {
    // Based on classic Perlin-style lattice noise concept
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

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(lightDir);
    float dotNV = max(dot(normal, viewDir), 0.0);

    // Refraction using Snell's Law
    // GLSL refract() implements Snell's law for dielectrics
    vec3 refractDir = refract(-viewDir, normal, 1.0/ior);
    vec3 env = textureCube(envMap, refractDir).rgb;
    
    vec3 refraction = max(env, baseColor * 0.2);

    // Thickness glow inspired by Beer-Lambert absorption law:
    // I = I0 * exp(-sigma * distance)
    float distFromCenter = length(vWorldPosition - vObjectCenter);
    float coreMask = exp(-distFromCenter * (uIsBackside ? 3.0 : 2.0)); 
    vec3 internalGlow = baseColor * coreMask * (uIsBackside ? 0.5 : 1.0);


    // Thickness-based spectral absorption inspired by Beer–Lambert law in participating media
    float thickness = pow(1.0 - dotNV, 2.0);
    vec3 absorption = mix(vec3(1.0), vec3(0.1, 0.6, 1.0), thickness); // Blue tint for thicker areas
    refraction *= absorption;


    // Fresnel Reflection using Schlick's approximation
    float fresnel = pow(1.0 - dotNV, 3.0) * fresnelStrength;
    vec3 reflection = textureCube(envMap, reflect(-viewDir, normal)).rgb;

    // Final color mix with Fresnel effect
    vec3 finalColor = mix(refraction, reflection, clamp(fresnel, 0.0, 1.0));
    
    // Additive internal scattering boost
    // Artistic enhancement (not physically accurate)
    finalColor += internalGlow * 0.4;
    finalColor += baseColor * 0.1; // Ambient floor


    // Procedural Frost Layer
    // Uses value noise + view-angle bias
    // Frost appears stronger at grazing angles
    float fNoise = noise3D(vWorldPosition * 4.0);
    float frost = smoothstep(0.2, 0.6, frostAmount * (1.2 - dotNV + fNoise));
    vec3 iceWhite = vec4(0.9, 0.95, 1.0, 1.0).rgb;
    finalColor = mix(finalColor, iceWhite, frost * (uIsBackside ? 0.1 : 0.6));


    // Specular highlight (Blinn-Phong style)
    // Classic Phong reflection model
    // exponent = 64 → sharp glossy highlight
    if (!uIsBackside) {
        float spec = pow(max(dot(reflect(-L, normal), viewDir), 0.0), 64.0);
        finalColor += vec3(1.0) * spec * 0.5;
    }

    // Opacity blending
    // Frost and thickness increase opacity
    float finalOpacity = uIsBackside ? opacity * 0.6 : mix(opacity, 0.9, frost + coreMask * 0.2);

    gl_FragColor = vec4(finalColor, finalOpacity);
}