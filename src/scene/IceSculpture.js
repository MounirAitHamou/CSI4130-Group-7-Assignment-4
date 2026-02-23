import * as THREE from 'three'
import { createIceMaterial } from '../materials/IceMaterial.js'

export class IceSculpture {
    constructor(gltf, renderer, scene, camera) {
        this.model = gltf.scene
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.materials = null

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
            magFilter: THREE.LinearFilter,
            encoding: THREE.sRGBEncoding
        });
        this.cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    }

    async init() {
        const { backMaterial, frontMaterial } = await createIceMaterial(this.cubeCamera.renderTarget.texture)
        this.materials = { back: backMaterial, front: frontMaterial }

        const meshes = []
        this.model.traverse(child => {
            if (child.isMesh) meshes.push(child)
        })

        meshes.forEach(child => {
            child.castShadow = false;
            child.receiveShadow = true;

            const frontMesh = child.clone();
            frontMesh.name = "ice_front_pass";

            const normalMatrix = new THREE.Matrix3().getNormalMatrix(child.matrixWorld);
            const avgNormal = new THREE.Vector3(0, 0, 0);
            if (child.geometry.attributes.normal) {
                const normals = child.geometry.attributes.normal.array;
                for (let i = 0; i < normals.length; i += 3) {
                    avgNormal.add(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]));
                }
                avgNormal.divideScalar(normals.length / 3).normalize();
            }
            frontMesh.position.add(avgNormal.multiplyScalar(0.002));

            child.material = this.materials.back;
            frontMesh.material = this.materials.front;
            child.add(frontMesh);
        });
    }

    update(elapsed) {
        if (!this.model || !this.cubeCamera || !this.scene || !this.renderer) return;

        this.cubeCamera.position.copy(this.model.position);

        if (this.lastCubeUpdate === undefined) this.lastCubeUpdate = 0;
        if ((elapsed - this.lastCubeUpdate) > 0.1) {
            this.model.visible = false;
            this.cubeCamera.update(this.renderer, this.scene);
            this.model.visible = true;
            this.lastCubeUpdate = elapsed;
        }
    }
}