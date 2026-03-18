import * as THREE from 'three';
import { loadTexture } from '../systems/AssetLoader.js';

export async function createSnowMaterial() {
    const snowTexture = await loadTexture("snow_02_diff_4k.jpg");

    snowTexture.wrapS = THREE.RepeatWrapping;
    snowTexture.wrapT = THREE.RepeatWrapping;
    snowTexture.repeat.set(32, 32);
    snowTexture.encoding = THREE.sRGBEncoding;

    const material = new THREE.MeshBasicMaterial({
        map: snowTexture,
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    return material;
}