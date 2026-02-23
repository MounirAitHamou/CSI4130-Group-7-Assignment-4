import * as THREE from 'three';
import { loadShader } from '../systems/ShaderLoader';
import { loadTexture } from '../systems/AssetLoader';

export async function createSnowMaterial() {
    const snowTexture = await loadTexture("snow.jpg");
    snowTexture.wrapS = snowTexture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uSnowColor: { value: new THREE.Color(0xffffff) },
            uShadowColor: { value: new THREE.Color(0xd0e0ff) },
            uSnowTexture: { value: snowTexture },
            side: { value: THREE.DoubleSide },
        },
        vertexShader: await loadShader('snowVertex.glsl'),
        fragmentShader: await loadShader('snowFragment.glsl'),
    });
    material.skinning = true;

    return material;
}