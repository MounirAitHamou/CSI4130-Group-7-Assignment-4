import * as THREE from 'three';
import { loadTexture } from '../systems/AssetLoader.js';

export async function createSnowMaterial() {
    const snowTexture = await loadTexture("176.jpg");

    snowTexture.wrapS = THREE.RepeatWrapping;
    snowTexture.wrapT = THREE.RepeatWrapping;
    snowTexture.repeat.set(16, 16);
    snowTexture.encoding = THREE.sRGBEncoding;

    const material = new THREE.MeshStandardMaterial({
        map: snowTexture,
        color: 0xabe8f5,
        side: THREE.DoubleSide
    });

    return material;
}