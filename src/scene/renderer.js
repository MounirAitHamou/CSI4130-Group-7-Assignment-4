import * as THREE from 'three'

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    renderer.physicallyCorrectLights = true
    renderer.outputColorSpace = THREE.SRGBColorSpace

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    document.body.appendChild(renderer.domElement)

    return renderer
}