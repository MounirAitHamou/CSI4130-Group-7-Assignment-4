import * as THREE from 'three'

import { setupBackground } from './scene/background.js'
import { SnowParticles } from './scene/SnowParticles.js'
import { createCamera } from './scene/camera.js'
import { createRenderer, handleResize } from './scene/renderer.js'
import { addLights, updateCSM } from './scene/lights.js'

import { loadGLTF } from './systems/AssetLoader.js'
import { World } from './systems/World.js'

import { FirstPersonController } from './controls/FirstPersonController.js'

import { IceSculpture } from './scene/IceSculpture.js'
import { SnowCharacter } from './scene/SnowCharacter.js'
import { CanalRideau } from './scene/CanalRideau.js'

let scene, camera, renderer
let controller
let timer, world
let frameCount = 0

async function init() {
    scene = new THREE.Scene()
    renderer = createRenderer()
    camera = createCamera()
    timer = new THREE.Timer()
    world = new World(scene, camera, renderer.domElement)
    controller = new FirstPersonController(camera, renderer.domElement)


    await addLights(scene, camera)

    const stars = await setupBackground(scene)
    world.add(stars)

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512)
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)

    scene.add(cubeCamera)

    cubeCamera.update(renderer, scene)
    scene.environment = cubeRenderTarget.texture
    const envTexture = cubeRenderTarget.texture
    envTexture.mapping = THREE.CubeReflectionMapping


    const snow = new SnowParticles({ count: 200000, areaSize: 1000, height: 30 })
    await snow.init()
    world.add(snow)

    const canal = new CanalRideau(envTexture, camera)

    await canal.init()

    world.add(canal)

    const iceGltf = await loadGLTF("sculpture.glb")
    const ice1 = new IceSculpture(
        { scene: iceGltf.scene.clone(true) },
        renderer, scene, camera,
        envTexture,
        true
    )
    await ice1.init()
    ice1.model.position.set(0, 0, 0)
    ice1.model.scale.set(0.01, 0.01, 0.01)
    world.add(ice1)

    const dragonGltf = await loadGLTF("dragon_sculpture.glb")
    const dragon = new IceSculpture(
        { scene: dragonGltf.scene.clone(true) },
        renderer, scene, camera,
        envTexture,
        true
    )
    await dragon.init()
    dragon.model.position.set(-5, 0, -5)
    dragon.model.scale.set(0.1, 0.1, 0.1)
    world.add(dragon)

    const madonaGltf = await loadGLTF("madona_sculpture.glb")
    const madona = new IceSculpture(
        { scene: madonaGltf.scene.clone(true) },
        renderer, scene, camera,
        envTexture,
        true
    )
    await madona.init()
    madona.model.position.set(5, 0, -5)
    madona.model.scale.set(1, 1, 1)
    world.add(madona)

    const charGltf = await loadGLTF("drugdor_the_golem_animated.glb")
    const snowman = new SnowCharacter(charGltf)
    await snowman.init()
    snowman.model.position.set(5, 0, 5)
    snowman.model.scale.set(0.08, 0.08, 0.08)
    world.add(snowman)

    const triceratopsGltf = await loadGLTF("animated_triceratops_skeleton.glb")

    const triceratops = new SnowCharacter(triceratopsGltf)

    await triceratops.init()

    triceratops.model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })

    const box = new THREE.Box3().setFromObject(triceratops.model)
    triceratops.model.position.y -= box.min.y
    triceratops.model.position.set(-15, triceratops.model.position.y, 0)

    world.add(triceratops)

    handleResize(camera, renderer)

    animate()
}

function animate() {

    requestAnimationFrame(animate)

    timer.update()
    const delta = timer.getDelta()
    const elapsed = timer.getElapsed()

    controller.update(delta)
    world.update(delta, elapsed, frameCount)

    updateCSM()

    renderer.render(scene, camera)
    frameCount++
}

init()