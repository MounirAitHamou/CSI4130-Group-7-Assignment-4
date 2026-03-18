import * as THREE from 'three'
import { loadShader } from '../systems/ShaderLoader.js'
import { Entity } from './Entity.js'

export class SnowParticles extends Entity {

    constructor({ count = 2000, areaSize = 50, height = 20, wind = { x: 0.05, z: 0.02 } } = {}) {
        super()
        this.count = count
        this.areaSize = areaSize
        this.height = height
        this.wind = wind
        this.material = null
    }

    async init() {
        const geometry = new THREE.BufferGeometry()
        const positions = []
        const speeds = []
        const offsets = []
        const driftScale = []

        for (let i = 0; i < this.count; i++) {
            positions.push((Math.random() - 0.5) * this.areaSize)
            positions.push(Math.random() * this.height)
            positions.push((Math.random() - 0.5) * this.areaSize)

            speeds.push(0.5 + Math.random() * 1.5)
            offsets.push(Math.random() * 1000)
            driftScale.push(0.5 + Math.random())
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1))
        geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1))
        geometry.setAttribute('driftScale', new THREE.Float32BufferAttribute(driftScale, 1))

        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
            uniforms: {
                time: { value: 0 },
                areaSize: { value: this.areaSize },
                height: { value: this.height },
                windX: { value: this.wind.x },
                windZ: { value: this.wind.z },
                baseSize: { value: 6.0 },
                baseOpacity: { value: 0.6 }
            },
            vertexShader: await loadShader('snowFlakeVertex.glsl'),
            fragmentShader: await loadShader('snowFlakeFragment.glsl')
        })

        this.model = new THREE.Points(geometry, this.material)
    }

    update(delta) {
        if (!this.material) return
        this.material.uniforms.time.value += delta
    }
}