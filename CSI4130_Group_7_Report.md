# CSI4130 Computer Graphics – Winter 2026
## Assignment 4 Submission Report
**Theme:** Winterlude in Ottawa

---

## 1. Project Description
This project is an **interactive fly-through 3D environment** built with Three.js and themed around Winterlude in Ottawa. The scene recreates a stylized winter festival atmosphere inspired by the Rideau Canal, featuring ice sculptures, snowy surroundings, decorative lighting, animated characters, and falling snow. The goal was to combine core computer graphics techniques with interactive and dynamic visual effects to create an immersive winter scene.

The project relates to Winterlude by focusing on visual elements strongly associated with the festival, including the Rideau Canal Skateway, illuminated winter scenery, ice-themed materials, snow-covered surfaces, and outdoor nighttime ambiance. The scene is designed as a navigable winter exhibition space where the user can move through the environment and observe various animated and interactive objects.

The environment is **real-time 3D**, with spatial depth, multiple objects, lighting and material effects, and dynamic elements such as snowfall, animated models, and physics-driven interactions.

---

## 2. Implemented Techniques

### Mandatory Techniques
- **3D Environment**: Multiple meshes and imported models placed to build a complete canal scene with banks, fences, lampposts, sculptures, characters, stars, fog, and background elements.
- **Lighting and Shading**: Ambient and directional lighting with shadows, physically-based materials, reflective/refractive ice surfaces, and dynamic lighting interactions.
- **Textures**: Diffuse, normal, roughness, emissive, and environment maps applied to scene assets; procedural snow and ice effects combined with textures.
- **Dynamic Scenes**: Particle-based snowfall, animated GLTF characters, physics-driven snowballs, and interactive object highlighting with click-based interactions.

### Extra Techniques
- **Custom GLSL Shaders**: Ice, snow, stars, and procedural ground snow using fragment and vertex shaders.
- **Procedural Noise**: Frost, snow sparkle, and irregular surface details created procedurally.
- **Fresnel, Refraction, and Dispersion Effects**: Ice shaders with Fresnel reflection, subtle chromatic dispersion, and stylized frost growth.
- **Particle System**: Snowfall implemented with `THREE.Points`, depth-based sizing, drift, speed, and opacity control.
- **Physics (Rapier)**: Snowballs with rigid bodies responding to gravity and impulses.
- **Mouse/Keyboard Navigation**: First-person movement, pointer lock, and camera control.
- **Raycasting & Object Interaction**: Hover and click detection, object highlighting, and GUI-based interaction.
- **Skeletal Animation**: Animated GLTF characters controlled via `THREE.AnimationMixer`.
- **Level of Detail (LOD)**: Ice sculptures switch detail levels based on distance.
- **View Frustum Culling**: Scene objects skipped if outside camera view.
- **Environment Mapping**: Cube map used for reflections/refractions on ice surfaces.

---

## 3. GitHub Link
[CSI4130-Group-7-Assignment-4](https://github.com/MounirAitHamou/CSI4130-Group-7-Assignment-4)

---

## 4. Work Distribution
| Group Member      | Student Number | Contribution                                                                 |
|------------------|----------------|-----------------------------------------------------------------------------|
| Mounir Ait Hamou | 300296173      | Completed all project components: scene design, shaders, textures, interactivity, animation, physics, testing, and documentation |

---

## 5. Acknowledgements
This project uses external resources and libraries for models, textures, and rendering support:

- **Three.js** – Main 3D library for rendering, materials, animation, and asset loading.
- **Rapier** – Physics engine for rigid body simulation.
- **dat.GUI** – Interactive parameter controls.
- **Imported 3D Models** – GLTF/GLB ice sculptures, characters, and decorative elements.
- **Textures** – Surfaces such as concrete, moon imagery, and snow.
- **Shader Concepts** – Fresnel reflection, refraction, procedural noise, PBR models.

*Acknowledgment for assets:*  
> Some models, textures, and supporting assets were obtained from external sources for educational use. Full credits and links are documented in the project asset source list.
> [AssetsSources.md](./AssetsSources.md)
> Fragment specific acknowledgment for shaders and techniques is included in the code comments.
---

## 6. Usage Instructions

### Installation and Running
```bash
npm install
npx vite
o
```
### Controls
- **W / A / S / D / Space / Left Shift**: Move forward, left, backward, right, upward, downward

- **Mouse / Click / Esc**: Look around, interact with objects, and trigger pointer lock for immersive navigation, or exit pointer lock.

### Exploring the Scene

- Navigate through the canal environment in first person.

- Observe snowfall, lighting, ice sculptures, and nighttime atmosphere.

- Approach interactive objects to highlight or select them.

- Trigger animations or physics interactions via scene interactions.

- View shader-based ice and snow materials from multiple angles.