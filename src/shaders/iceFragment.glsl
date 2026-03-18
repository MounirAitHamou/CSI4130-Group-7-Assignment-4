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

uniform float time;
uniform bool enableFrostGrowth;
uniform float frostGrowthSpeed;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectCenter;

float hash3D(vec3 p){
    return fract(sin(dot(p,vec3(12.7,78.2,45.1)))*43758.5453123);
}

float noise3D(vec3 p){
    vec3 i=floor(p);
    vec3 f=fract(p);
    f=f*f*(3.0-2.0*f);

    return mix(
        mix(mix(hash3D(i+vec3(0,0,0)),hash3D(i+vec3(1,0,0)),f.x),
            mix(hash3D(i+vec3(0,1,0)),hash3D(i+vec3(1,1,0)),f.x),f.y),
        mix(mix(hash3D(i+vec3(0,0,1)),hash3D(i+vec3(1,0,1)),f.x),
            mix(hash3D(i+vec3(0,1,1)),hash3D(i+vec3(1,1,1)),f.x),f.y),f.z
    );
}

float fbm(vec3 p){
    float v=0.0;
    float a=0.5;
    for(int i=0;i<4;i++){
        v+=noise3D(p)*a;
        p*=2.0;
        a*=0.5;
    }
    return v;
}

void main(){
    vec3 normal=normalize(vWorldNormal);
    if(uIsBackside) normal=-normal;

    vec3 viewDir=normalize(cameraPosition-vWorldPosition);
    vec3 L=normalize(lightDir);

    // calculate how aligned the view direction is with the normal, which will be used for various effects
    // dotNV = cosine of angle between normal and view direction, clamped to [0,1]
    float dotNV=clamp(abs(dot(normal,viewDir)),0.0,1.0);

    // add some normal perturbation to break up the refraction and make it look more like ice
    float roughA=noise3D(vWorldPosition*12.0);
    float roughB=noise3D(vWorldPosition*18.0);

    float roughStrength=0.07;

    // create vector tangent that is not parallel to the normal, then use it to create a bitangent, bitangent will always be perpendicular to normal and tangent
    vec3 tangent=normalize(vec3(normal.y,normal.z,-normal.x));
    vec3 bitangent=normalize(cross(normal,tangent));

    vec3 perturb=
        (tangent*(roughA-0.5)+
         bitangent*(roughB-0.5))*roughStrength;

    // Perturb the normal to point in a slightly different direction, creating a frosted effect on the refraction and reflection
    normal=normalize(normal+perturb);

    // Calculate the thickness of the ice based on the angle between the view direction and the normal,
    // creating a stronger effect at glancing angles
    float thickness=pow(1.0-dotNV,2.0);

    float dispersionStrength=dispersionAmount*thickness;

    // Simulate chromatic dispersion by using slightly different IOR
    // values for each color channel, creating a subtle rainbow effect
    // on the refraction, more visible at glancing angles
    float iorR=ior*(1.0-dispersionStrength);
    float iorG=ior;
    float iorB=ior*(1.0+dispersionStrength);

    // Calculate the refraction vector for each color channel using Snell's law
    vec3 refractR=refract(-viewDir,normal,1.0/iorR);
    vec3 refractG=refract(-viewDir,normal,1.0/iorG);
    vec3 refractB=refract(-viewDir,normal,1.0/iorB);

    // If the refraction vector is zero, it means total internal reflection is occurring, so we use the reflection vector instead
    if(length(refractR)==0.0) refractR=reflect(-viewDir,normal);
    if(length(refractG)==0.0) refractG=reflect(-viewDir,normal);
    if(length(refractB)==0.0) refractB=reflect(-viewDir,normal);

    vec3 refraction;

    // Sample the environment map using the refraction vectors to get the refracted color for each channel
    refraction.r=textureCube(envMap,refractR).r;
    refraction.g=textureCube(envMap,refractG).g;
    refraction.b=textureCube(envMap,refractB).b;

    vec3 absorption=mix(
        vec3(1.0),
        vec3(0.15,0.55,1.0),
        thickness
    );

    refraction*=absorption;

    float distFromCenter=length(vWorldPosition-vObjectCenter);
    float coreMask = exp(-distFromCenter * 1.8);

    vec3 iceCoreColor = mix(baseColor, vec3(0.35,0.65,1.0), thickness * 0.6);
    vec3 internalGlow = iceCoreColor * coreMask * (uIsBackside ? 0.8 : 1.0);

    float F0=pow((1.0-ior)/(1.0+ior),2.0);

    float fresnel=
        F0+(1.0-F0)*pow(1.0-dotNV,5.0);

    fresnel*=fresnelStrength;

    float frostGrowth=frostAmount;

    if(enableFrostGrowth)
        frostGrowth=clamp(time*frostGrowthSpeed,0.0,frostAmount);

    vec3 worldUp=vec3(0.0,1.0,0.0);

    // orientationMask makes frost more likely to grow on surfaces facing upwards, simulating how frost forms in real life
    float orientationMask=
        pow(clamp(dot(normal,worldUp),0.0,1.0),2.0);

    float viewFrost=thickness;

    float edgeMask=
        pow(1.0-abs(dot(normal,viewDir)),3.0);

    float crystalLarge=fbm(vWorldPosition*3.0);
    float crystalFine=fbm(vWorldPosition*15.0);

    float frostNoise=
        crystalLarge*0.6+
        crystalFine*0.4;

    float frostBase=
        orientationMask*frostGrowth;

    float frost=
        smoothstep(
            0.2,
            0.8,
            frostBase+
            frostNoise*0.6+
            viewFrost*0.4+
            edgeMask*0.3
        );

    float surfaceRoughness=mix(0.02,0.35,frost);

    vec3 roughReflect=
        normalize(
            reflect(-viewDir,normal)+
            surfaceRoughness*vec3(
                noise3D(vWorldPosition*30.0),
                noise3D(vWorldPosition*31.0),
                noise3D(vWorldPosition*32.0)
            )
        );

    vec3 reflection=
        textureCube(envMap,roughReflect).rgb;

    vec3 finalColor=
        refraction*(1.0-fresnel)+
        reflection*fresnel;

    finalColor+=internalGlow*0.5;

    float NdotL=max(dot(normal,L),0.0);

    float backScatter=
        pow(max(dot(-viewDir,L),0.0),2.0);

    float thicknessSSS=
        (1.0-dotNV)*0.6 +
        coreMask*0.4;

    vec3 iceScatterColor=
        vec3(0.4,0.7,1.0);

    vec3 subsurface=
        iceScatterColor *
        thicknessSSS *
        backScatter *
        (1.0-frost);

    finalColor+=subsurface;

    vec3 iceWhite=vec3(0.92,0.96,1.0);

    float frostVisibility=
        uIsBackside?0.5:0.75;

    finalColor=
        mix(finalColor,iceWhite,frost*frostVisibility);

    float sparkle=
        pow(max(dot(reflect(-L,normal),viewDir),0.0),200.0);

    float sparkleNoise=
        step(0.97,noise3D(vWorldPosition*50.0));

    finalColor+=sparkle*sparkleNoise*0.6*frost;

    float alpha=surfaceRoughness*surfaceRoughness;
    vec3 H = normalize(L + viewDir);

    float NdotV = max(dot(normal, viewDir), 0.0);
    float NdotH = max(dot(normal, H), 0.0);

    float denom = NdotH*NdotH*(alpha*alpha-1.0)+1.0;
    float D = alpha*alpha/(3.14159*denom*denom);

    float k = (alpha+1.0)*(alpha+1.0)/8.0;

    float Gv = NdotV/(NdotV*(1.0-k)+k);
    float Gl = NdotL/(NdotL*(1.0-k)+k);

    float G = Gv*Gl;

    float spec = (D*G*fresnel)/(4.0*NdotV*NdotL+0.001);

    finalColor += vec3(spec);

    float baseAlpha=
        uIsBackside ? opacity*0.8 : opacity;

    float finalOpacity=
        mix(baseAlpha,0.95,frost+coreMask*0.2);

    gl_FragColor=vec4(finalColor,finalOpacity);
}