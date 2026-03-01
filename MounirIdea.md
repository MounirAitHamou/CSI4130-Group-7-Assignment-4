# Ice Sculpture Park Simulation – WebGL (Three.js)

## Project Goal

Design and implement a three-dimensional Winterlude-inspired ice sculpture park set at night. The project emphasizes physically motivated shading, procedural surface detail, GPU-driven animation, and cohesive scene composition. The focus is on depth of implementation, visual quality, and rendering sophistication rather than feature quantity.

---

# Scene Overview

The scene represents an outdoor winter festival environment containing:

- Snow-covered ground plane  
- Multiple ice sculptures (GLTF/OBJ)  
- Animated skinned character  
- Decorative elements (trees, lamps, benches)  
- Atmospheric snow particles  
- Night-time lighting environment  

Users can freely explore the environment using mouse and keyboard controls.

---

# Rendering and Shading

## Physically-Inspired Ice Material

All ice sculptures will use a custom `ShaderMaterial` written in GLSL. The shader will implement:

- Schlick-style Fresnel approximation  
- Environment-mapped reflection and refraction  
- Adjustable index of refraction (IOR)  
- Thickness-based color absorption  
- World-space 3D procedural noise for frost variation  
- Backface rendering pass to simulate volumetric depth  
- Specular reflection model  
- Angle-dependent opacity blending  

Optional refinements may include:

- Subtle chromatic dispersion approximation  
- Micro-surface roughness perturbation via noise  

The goal is to simulate the optical behavior of translucent ice rather than relying on built-in materials.

---

## Lighting Design

The lighting system will be carefully composed to support a night-time winter atmosphere:

- Directional light representing moonlight with tuned cold color temperature  
- Physically plausible attenuation for point lights placed near sculptures  
- Shadow mapping enabled for the primary directional light  
- Rim-lighting effects to enhance silhouette readability  
- Exposure and tone balance adjustments for night rendering  

Lighting placement and intensity will be designed to emphasize form and material response.

---

# Texturing and Procedural Detail

## Procedural Frost and Surface Variation

Surface detail will be generated procedurally in shader code:

- 3D world-space noise function  
- Frost accumulation based on view angle and surface orientation  
- Noise-driven blending between clear ice and frosted regions  
- Frost affecting both color and opacity  
- Stable sampling to avoid texture distortion  

Optional extension:

- Time-based frost growth toggle for demonstration purposes  

---

# Snow Particle System

A GPU-driven particle system will simulate falling snow:

- Single draw call using `BufferGeometry`  
- Per-particle position and velocity attributes stored on the GPU  
- Time-based vertex shader animation  
- Procedural horizontal drift using noise  
- Soft circular alpha mask for realistic flakes  
- Depth-based fade near the camera  
- Carefully tuned blending mode for night visibility  

The system will avoid CPU updates for performance efficiency.

---

# Animation

The animated character will use:

- GLTF skeletal animation  
- `AnimationMixer` for playback control  
- Smooth blending between animation states  
- Optional interaction-triggered animation changes  

---

# Interactivity

User interaction will include:

- Mouse-based camera rotation and movement (`PointerLockControls` or `OrbitControls`)  
- Raycasting for object selection  
- Emissive rim highlight effect on hover  
- Informational overlay displayed on click  
- Smooth visual transition when selecting objects  

Interaction effects will be integrated visually rather than appearing as separate UI elements.

---

# Performance Considerations

Rendering efficiency will be considered throughout development:

- Instanced rendering for repeated assets (e.g., trees, lamps)  
- Use of `THREE.LOD` for distant sculptures  
- Validation of frustum culling  
- Controlled texture resolutions  
- Limited draw calls for particle system  
- Performance profiling using browser tools  

The project will aim to maintain stable frame rates while preserving visual quality.

---

# Technical Stack

- Three.js (WebGL)  
- Custom GLSL vertex and fragment shaders  
- `GLTFLoader` / `OBJLoader`  
- `AnimationMixer`  
- `TextureLoader`  
- Optional: `lil-gui` for parameter adjustment  

---

# Team Roles

## Scene and Assets
- Scene layout and composition  
- Asset acquisition and preparation  
- Character rigging and integration  

## Shaders and Lighting
- Ice shader implementation  
- Procedural frost and noise logic  
- Lighting setup and shadow configuration  

## Particles and Interaction
- Snow particle system  
- Animation integration  
- Raycasting and interaction effects  

## Integration and Optimization
- System integration  
- Performance tuning  
- Testing and debugging  
- Demo recording  
- Documentation writing  

---

# Development Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Repository setup, base scene, camera system, model loading |
| Week 2 | Ice shader implementation and lighting configuration |
| Week 3 | Particle system and procedural frost integration |
| Week 4 | Interaction systems and animation integration |
| Week 5 | Optimization, polish, demo recording, documentation |

---

# Deliverables

## GitHub Repository
- Complete source code  
- Shader files  
- Assets and models  
- Clear project structure  
- Proper documentation  

## Demonstration Video (2 minutes)
- Camera navigation  
- Ice shader behavior  
- Snow particle system  
- Procedural frost detail  
- Interaction showcase  
- Final cinematic fly-through  

## PDF Submission (1–2 pages)
- Project description  
- List of implemented rendering techniques  
- GitHub link  
- Contribution table per group member  
- Acknowledgment of external resources  
- Usage instructions (controls and interaction)  