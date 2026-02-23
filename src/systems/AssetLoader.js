import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';

const loader = new GLTFLoader()

export function loadGLTF(path) {
    return new Promise((resolve, reject) => {

        loader.load(
            "src/assets/models/" + path,
            (gltf) => {
                resolve(gltf)
            },
            undefined,
            (error) => {
                reject(error)
            }
        )

    })
}

export function loadTexture(path) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(
            "src/assets/textures/" + path,
            (texture) => {
                resolve(texture)
            },
            undefined,
            (error) => {
                reject(error)
            }
        )
    })
}