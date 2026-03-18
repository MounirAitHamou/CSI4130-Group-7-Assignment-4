import * as THREE from 'three';
import { loadShader } from '../systems/ShaderLoader.js';

export async function createGroundSnowMaterial() {
    const vertex = await loadShader('groundSnowVertex.glsl');
    const fragment = await loadShader('groundSnowFragment.glsl');

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uBaseColor: { value: new THREE.Color(0xffffff) },
            uShadowColor: { value: new THREE.Color(0xd0e0ff) },
            uSunDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
            uNoiseScale: { value: 25.0 },
            uBumpStrength: { value: 0.8 },
            uSparkleStrength: { value: 0.8 }
        },
        vertexShader: vertex,
        fragmentShader: fragment,
    });

    return material;
}