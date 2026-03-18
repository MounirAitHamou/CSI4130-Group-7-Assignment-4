import * as THREE from 'three'
import { loadShader } from '../systems/ShaderLoader'

export async function setupBackground(scene) {

    scene.background = new THREE.Color(0x0a1a3a)
    scene.fog = new THREE.FogExp2(0x0a1a3a, 0.002);

    const starCount = 2000
    const positions = []
    const colors = []
    const brightnesses = []

    const palette = [
        new THREE.Color(0xfff5e1),
        new THREE.Color(0xd0e0ff),
        new THREE.Color(0xffe1c1)
    ]

    for (let i = 0; i < starCount; i++) {

        positions.push((Math.random() - 0.5) * 500)
        positions.push(Math.random() * 200 + 50)
        positions.push((Math.random() - 0.5) * 500)

        const baseColor = palette[Math.floor(Math.random() * palette.length)]

        const brightness = 0.4 + Math.random() * 0.6
        brightnesses.push(brightness)

        colors.push(baseColor.r, baseColor.g, baseColor.b)

    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
    )

    geometry.setAttribute(
        'brightness',
        new THREE.Float32BufferAttribute(brightnesses, 1)
    )

    const material = new THREE.ShaderMaterial({

        vertexColors: true,

        uniforms: {
            time: { value: 0 }
        },

        vertexShader: await loadShader('starVertex.glsl'),
        fragmentShader: await loadShader('starFragment.glsl'),

        transparent: true

    })

    const stars = new THREE.Points(geometry, material)

    stars.userData.update = (delta) => {
        material.uniforms.time.value += delta
    }

    scene.add(stars)

    return stars

}