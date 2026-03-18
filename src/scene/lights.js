import * as THREE from 'three'
import { loadTexture } from '../systems/AssetLoader'
import { CSM } from 'three/examples/jsm/csm/CSM.js'

let csm = null

export async function addLights(scene, camera) {

    const ambient = new THREE.AmbientLight(0x223344, 0.5)
    scene.add(ambient)

    csm = new CSM({
        maxFar: 300,
        cascades: 3,
        mode: 'practical',
        parent: scene,
        shadowMapSize: 2048,
        lightDirection: new THREE.Vector3(-1, -1, -0.5).normalize(),
        camera: camera
    })

    let moonTexture = null
    try {
        moonTexture = await loadTexture("moon.jpg")
        moonTexture.colorSpace = THREE.SRGBColorSpace
        moonTexture.flipY = false
    } catch (e) {
        console.error("Moon texture failed to load:", e)
    }

    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        emissiveMap: moonTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5,
    })

    const moonGeometry = new THREE.SphereGeometry(5, 32, 32)
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)

    const moonDir = new THREE.Vector3(1, 1, 0.5).normalize()
    moonMesh.position.copy(moonDir).multiplyScalar(200)

    scene.add(moonMesh)
}

export function getCSM() {
    return csm
}

export function updateCSM() {
    if (csm) csm.update()
}

export function addRimLighting(material) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.rimColor = { value: new THREE.Color(0xffffff) };
        shader.uniforms.rimPower = { value: 3.0 };
        shader.uniforms.rimStrength = { value: 0.6 };

        shader.fragmentShader = `
            uniform vec3 rimColor;
            uniform float rimPower;
            uniform float rimStrength;
            ${shader.fragmentShader}
        `;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <output_fragment>',
            `
            float rim = 1.0 - max(dot(normalize(vViewPosition), normal), 0.0);
            rim = pow(rim, rimPower);

            gl_FragColor.rgb += rimColor * rim * rimStrength;

            #include <output_fragment>
            `
        );
    };
}