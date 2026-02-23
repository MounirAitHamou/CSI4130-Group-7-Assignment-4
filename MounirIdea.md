# Ice Sculpture Park Simulation – WebGL (Three.js) Plan

## Goal
3D Winterlude-style park with ice sculptures, snow, lights, and simple interactivity. Users can explore with the mouse and see dynamic effects like falling snow, procedural variation, and animated skinned objects.

---

# Scene Setup
- **Ground plane:** snow/ice textured plane  
- **Ice sculptures:** GLTF / OBJ models  
- **Animated ice character (skinned mesh):** GLTF with skeletal animation  
- **Optional props:** trees, lamps, benches  
- **Camera:** free camera (WASD + mouse) or orbit camera  
- **Controls:** PointerLockControls or OrbitControls  

---

# Mandatory Features

## Lighting & Shading
- **Directional light:** moonlight
- **Point lights:** around sculptures  
- **Custom shaders:**  
  - ShaderMaterial or NodeMaterial  
  - Ice shading with fresnel-like edge highlights
- **Optional:** transparency/refraction approximation  

---

## Textures
- Ice textures for sculptures  
- Snow texture for ground  
- **Optional / Advanced:**  
  - Procedural snow/ice variation using Perlin noise (JS or GLSL)  
  - Noise blended in fragment shader for realism  

---

## Dynamic Elements

### Snow Particle System
- GPU-based using `BufferGeometry` + custom shaders  
- Animated in vertex shader (time uniform)  
- Optional Perlin-based drift motion  

### Skeletal Animation (NEW CORE FEATURE)
- At least one **skinned GLTF model** (rigged mesh)
- Use `THREE.AnimationMixer` for playback
- Demonstrates:
  - Bone hierarchy
  - Skin weights
  - GPU skinning
  - Vertex deformation
- Optional:
  - Procedural bone animation (e.g., sine-based motion)
  - Perlin-driven bone motion
  - Subtle idle animation for realism

### Optional Enhancements
- Flickering lights on sculptures  
- Subtle object movement (shader-based)  
- Snow visually accumulating on animated mesh  

---

## Interactivity
- Mouse camera movement (rotate, pan, zoom)  
- Raycasting for clickable sculptures  
  - Highlight on hover  
  - Display info overlay on click  
- Optional:
  - Click animated character to trigger animation change  

---

# Optional Features (Bonus)
- Procedural ice/snow shaders  
- Physics for small objects (Rapier.js / Ammo.js)  
- Level-of-detail (THREE.LOD) for distant sculptures  
- Perlin noise for textures, particles, or animation  
- Multiple animation states (idle, wave, rotate, etc.)  

---

# Technical Stack
- Three.js (WebGL)  
- GLSL vertex + fragment shaders  
- GLTFLoader / OBJLoader  
- AnimationMixer (skeletal animation system)  
- TextureLoader  
- Optional:  
  - Rapier.js / Ammo.js (physics)  
  - dat.GUI or lil-gui (parameter tuning)  

---

# Team Roles

## 1. Scene & Assets
- Ground, sculptures, props, textures  
- Acquire or rig animated GLTF character  

## 2. Lighting & Shaders
- Directional + point lights  
- Ice shaders
- Perlin noise for texture variation  

## 3. Particles, Animation & Interactivity
- Snow particle system  
- Skeletal animation system  
- AnimationMixer integration  
- Procedural bone motion (optional)  
- Raycasting & click interactions  
- Perlin-based particle motion  

## 4. Integration & Demo
- Combine systems  
- Testing & polish  
- Performance optimization  
- Record demo video  
- Write usage instructions  

---

# Milestones

| Week  | Tasks |
|-------|--------|
| Week 1 | GitHub setup, basic Three.js scene, camera, load models |
| Week 2 | Lighting, shaders, textures, integrate skinned GLTF model |
| Week 3 | Snow particle system, skeletal animation system, raycasting |
| Week 4 | Polish, procedural bone animation, performance tweaks, record demo |
| Week 5 | Peer review & final PDF |

---

# Deliverables
- **GitHub repository:** source code, shaders, animated models, assets  
- **2-min demo video:**  
  - Camera movement  
  - Lighting  
  - Snow particle system  
  - Procedural shader effects  
  - Skinned mesh animation  
- **1–2 page PDF:**  
  - Description  
  - Skeletal animation explanation  
  - Shader techniques  
  - GitHub link  
  - Contribution table  
  - Usage instructions  
