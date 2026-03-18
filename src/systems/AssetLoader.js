import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

const loader = new GLTFLoader()
const exrLoader = new EXRLoader()

const gltfCache = {}
const textureCache = {}
const envCache = {}

export function loadGLTF(path) {

    if (gltfCache[path])
        return Promise.resolve(gltfCache[path])

    return new Promise((resolve, reject) => {

        loader.load(
            "src/assets/models/" + path,
            (gltf) => {

                gltfCache[path] = gltf
                resolve(gltf)

            },
            undefined,
            reject
        )

    })
}

export function loadTexture(path) {

    if (textureCache[path])
        return Promise.resolve(textureCache[path])

    return new Promise((resolve, reject) => {

        const textureLoader = new THREE.TextureLoader()

        textureLoader.load(
            "src/assets/textures/" + path,
            (texture) => {

                textureCache[path] = texture
                resolve(texture)

            },
            undefined,
            reject
        )

    })
}

export function loadEnvironmentMap(path) {
    if (envCache[path]) return Promise.resolve(envCache[path])

    return new Promise((resolve, reject) => {
        exrLoader.load(
            "src/assets/textures/" + path,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping

                texture.minFilter = THREE.LinearFilter
                texture.magFilter = THREE.LinearFilter

                envCache[path] = texture
                resolve(texture)
            },
            undefined,
            reject
        )
    })
}