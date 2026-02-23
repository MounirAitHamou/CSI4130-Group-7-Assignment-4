import * as THREE from 'three';
import { setupBackground } from './scene/background.js';
import { createGround } from './scene/ground.js';
import { createSnowParticles } from './scene/particles.js';
import { createCamera } from './scene/camera.js';
import { createRenderer } from './scene/renderer.js';
import { addLights } from './scene/lights.js';
import { loadGLTF } from './systems/AssetLoader.js';
import { FirstPersonController } from './controls/FirstPersonController.js';
import { World } from './systems/World.js';
import { IceSculpture } from './scene/IceSculpture.js';
import { SnowCharacter } from './scene/SnowCharacter.js';

let scene, camera, renderer, controller, timer, world;
let frameCount = 0;

async function init() {
    scene = new THREE.Scene();
    renderer = createRenderer();
    camera = createCamera();
    timer = new THREE.Timer();
    world = new World(scene);
    controller = new FirstPersonController(camera, renderer.domElement);

    addLights(scene);

    // Background
    const stars = await setupBackground(scene);
    const snow = await createSnowParticles(2000, 100, 30);
    const ground = createGround();
    world.add(stars);
    world.add(snow);
    scene.add(ground);

    // Ice Sculpture
    const gltf = await loadGLTF("sculpture.glb");
    const ice = new IceSculpture(gltf, renderer, scene, camera);
    await ice.init();
    ice.model.scale.set(0.01, 0.01, 0.01);
    world.add(ice);
    scene.add(ice.cubeCamera);

    const charGltf = await loadGLTF("drugdor_the_golem_animated.glb");
    const snowman = new SnowCharacter(charGltf);
    await snowman.init();
    snowman.model.position.set(5, 0, 5);
    snowman.model.scale.set(0.08, 0.08, 0.08);
    world.add(snowman);

    animate(ice);
}

function animate(ice) {
    requestAnimationFrame(() => animate(ice));
    timer.update();

    const delta = timer.getDelta();
    const elapsed = timer.getElapsed();

    controller.update(delta);
    world.update(delta, elapsed, frameCount);

    ice.update(elapsed);

    renderer.render(scene, camera);
    frameCount++;
}

init();