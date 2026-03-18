import * as THREE from 'three'
import { loadShader } from '../systems/ShaderLoader.js'

export async function createIceMaterial(envTexture) {
    const vertex = await loadShader('iceVertex.glsl')
    const fragment = await loadShader('iceFragment.glsl')

    const baseUniforms = {
        baseColor: { value: new THREE.Color(0xccdce6) },
        fresnelStrength: { value: 1.5 },
        opacity: { value: 0.3 },
        envMap: { value: envTexture },
        ior: { value: 1.31 },
        lightDir: { value: new THREE.Vector3(1, 1, 1).normalize() },
        frostAmount: { value: 1 },
        dispersionAmount: { value: 0.005 },
        time: { value: 0 },
        enableFrostGrowth: { value: false },
        frostGrowthSpeed: { value: 1.2 }
    }

    const backMaterial = new THREE.ShaderMaterial({
        uniforms: { ...baseUniforms, uIsBackside: { value: true } },
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: true,
    });

    const frontMaterial = new THREE.ShaderMaterial({
        uniforms: { ...baseUniforms, uIsBackside: { value: false } },
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.FrontSide,
        transparent: true,
        depthWrite: true,
    });

    return {
        backMaterial,
        frontMaterial
    }
}