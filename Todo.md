# ❄️ Ice Sculpture Park – Full To-Do List

## 1️⃣ Core Scene & Setup
- [✅] Initialize Three.js scene  
- [✅] Add **camera** (free WASD + mouse OR OrbitControls)  
- [✅] Set up **renderer** with `alpha: true` and `antialias: true`  
- [✅] Add **pointer/mouse controls**  
- [✅] Set **scene background** (skybox or solid color)  
- [⚠️] Add **ground plane** with snow texture  
- [✅] Set **directional moonlight** and basic **point lights**  
- [⚠️] Set up **shadow maps** for ground and sculptures  

## 2️⃣ Ice Sculptures
- [✅] Load static **GLTF/OBJ models** for ice sculptures  
- [✅] Apply **ice shader** to static sculptures only  
- [✅] Test **frost, Fresnel, absorption, sparkle effects**  
- [✅] Tweak shader parameters (frostAmount, ior, etc.)  
- [✅] Optional: procedural **ice variation via noise**  

## 3️⃣ Skinned Mesh / Animated Ice Character
- [⬜] Load **skinned GLTF model**  
- [⬜] Apply **standard or physical material** (no ice shader)  
- [⬜] Set up **AnimationMixer**  
- [⬜] Play **idle animation**  
- [⬜] Optional: procedural bone motion (sine or Perlin-based)  
- [⬜] Test **interaction with lights, shadows, and camera**  

## 4️⃣ Snow Particle System
- [✅] Create **BufferGeometry-based particle system**  
- [⚠️] Animate particles in **vertex shader** with `uTime`  
- [⬜] Optional: add **Perlin drift motion**  
- [⚠️] Test particle blending with scene and lighting  

## 5️⃣ Interactivity
- [⬜] Implement **raycasting** for sculptures  
- [⬜] Highlight sculpture **on hover**  
- [⬜] Display **info overlay on click**  
- [⬜] Optional: **trigger animation** when clicking skinned mesh  
- [⚠️] Optional: camera **zoom/pan/rotate** with interaction  

## 6️⃣ Optional Features (Polish / Bonus)
- [⬜] Flickering lights on sculptures  
- [⬜] Subtle object movement (shader-based)  
- [⬜] Snow visually accumulating on animated mesh  
- [⬜] Multiple animation states for skinned mesh (idle, wave, rotate)  
- [⬜] Level-of-detail for distant sculptures (`THREE.LOD`)  
- [⬜] Physics for small objects (Rapier.js / Ammo.js)  
- [✅] Procedural ice/snow shaders (advanced GLSL)  

## 7️⃣ Integration & Testing
- [⬜] Combine **scene, shaders, particles, skinned mesh, interactivity**  
- [⬜] Optimize **performance** (shaders, particles, textures)  
- [⬜] Test on **different devices/browsers**  
- [⬜] Record **demo video**  
- [⬜] Prepare **1–2 page PDF documentation**  

## 8️⃣ Deliverables
- [✅] GitHub repo: code, assets, shaders, models  
- [⬜] 2-minute demo video  
- [⬜] PDF: description, skeletal animation, shader techniques, usage instructions