import * as THREE from 'three'
import { loadShader } from '../systems/ShaderLoader'

export async function createSnowParticles(
    count = 1000,
    areaSize = 50,
    height = 20,
    wind = { x: 0.05, z: 0.02 }
) {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const speeds = []
    const driftX = []
    const driftZ = []
    const swayOffset = []
    const twinkleOffset = []

    for (let i = 0; i < count; i++) {
        positions.push((Math.random() - 0.5) * areaSize)
        positions.push(Math.random() * height)
        positions.push((Math.random() - 0.5) * areaSize)

        speeds.push(1 + Math.random() * 2)
        driftX.push((Math.random() - 0.5) * 0.05)
        driftZ.push((Math.random() - 0.5) * 0.05)
        swayOffset.push(Math.random() * Math.PI * 2)
        twinkleOffset.push(Math.random() * Math.PI * 2)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1))
    geometry.setAttribute('driftX', new THREE.Float32BufferAttribute(driftX, 1))
    geometry.setAttribute('driftZ', new THREE.Float32BufferAttribute(driftZ, 1))
    geometry.setAttribute('swayOffset', new THREE.Float32BufferAttribute(swayOffset, 1))
    geometry.setAttribute('twinkleOffset', new THREE.Float32BufferAttribute(twinkleOffset, 1))

    const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            time: { value: 0 },
            delta: { value: 0 },
            windX: { value: wind.x },
            windZ: { value: wind.z },
            baseSize: { value: 0.1 },
            baseOpacity: { value: 0.8 }
        },
        vertexShader: await loadShader('snowFlakeVertex.glsl'),
        fragmentShader: await loadShader('snowFlakeFragment.glsl')
    })

    const snow = new THREE.Points(geometry, material)

    snow.userData.update = (deltaTime) => {
        material.uniforms.time.value += deltaTime
        material.uniforms.delta.value = deltaTime

        const pos = geometry.attributes.position.array
        const spd = geometry.attributes.speed.array
        const sway = geometry.attributes.swayOffset.array
        const tw = geometry.attributes.twinkleOffset.array
        const dx = geometry.attributes.driftX.array
        const dz = geometry.attributes.driftZ.array

        for (let i = 0; i < count; i++) {
            const idx = i * 3
            pos[idx + 1] -= spd[i] * deltaTime

            if (pos[idx + 1] < 0) {
                pos[idx + 1] = Math.random() * height * 0.5 + height * 0.5
                pos[idx] = (Math.random() - 0.5) * areaSize
                pos[idx + 2] = (Math.random() - 0.5) * areaSize
                sway[i] = Math.random() * Math.PI * 2
                tw[i] = Math.random() * Math.PI * 2
                dx[i] = (Math.random() - 0.5) * 0.05
                dz[i] = (Math.random() - 0.5) * 0.05
            }
        }

        geometry.attributes.position.needsUpdate = true
        geometry.attributes.driftX.needsUpdate = true
        geometry.attributes.driftZ.needsUpdate = true
        geometry.attributes.swayOffset.needsUpdate = true
        geometry.attributes.twinkleOffset.needsUpdate = true
    }

    return snow
}