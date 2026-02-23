import * as THREE from 'three';
import { createSnowMaterial } from '../materials/SnowMaterial.js';

export class SnowCharacter {
    constructor(gltf) {
        this.model = gltf.scene;
        this.animations = gltf.animations;
        this.mixer = new THREE.AnimationMixer(this.model);
        this.material = null;
    }

    async init() {
        this.material = await createSnowMaterial();

        this.model.traverse(child => {
            if (child.isMesh) {
                child.material = this.material;
                child.castShadow = true;
                child.receiveShadow = true;
                child.frustumCulled = false;
                child.geometry.computeBoundingSphere();
                child.geometry.boundingSphere.radius *= 1.5;
            }
        });

        if (this.animations.length > 0) {
            this.mixer.clipAction(this.animations[0]).play();
        }
    }

    update(delta, elapsed) {
        this.mixer.update(delta);
        if (this.material) {
            this.material.uniforms.uTime.value = elapsed;
        }
    }
}