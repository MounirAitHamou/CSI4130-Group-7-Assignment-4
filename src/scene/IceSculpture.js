import * as THREE from 'three'
import { Entity } from './Entity.js'
import { createIceMaterial } from '../materials/IceMaterial.js'
import { addRimLighting } from './lights.js'

export class IceSculpture extends Entity {

    constructor(gltf, renderer, scene, camera, envMap, frostGrowth = false) {
        super()
        this.model = new THREE.LOD()
        this.originalScene = gltf.scene
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.envMap = envMap
        this.materials = null
        this.frostGrowth = frostGrowth
        this.hoverBox = null

        this.guiProxy = {
            frostEnabled: this.frostGrowth
        }

        this.guiControllers = {}
    }

    async init() {
        const { backMaterial, frontMaterial } = await createIceMaterial(this.envMap)
        addRimLighting(backMaterial)
        addRimLighting(frontMaterial)

        backMaterial.uniforms.enableFrostGrowth.value = this.frostGrowth
        frontMaterial.uniforms.enableFrostGrowth.value = this.frostGrowth

        this.materials = { back: backMaterial, front: frontMaterial }

        const lowDetailModel = this.setupLowDetail()

        this.setupHighDetail()

        this.model.addLevel(this.originalScene, 0)
        this.model.addLevel(lowDetailModel, 30)

        const placeholder = new THREE.Group()
        this.model.addLevel(placeholder, 70)

        this.computeBoundingSphere()
    }

    setupHighDetail() {
        const meshes = []
        this.originalScene.traverse(child => { if (child.isMesh) meshes.push(child) })

        const temp = new THREE.Vector3()

        meshes.forEach(child => {
            child.castShadow = false
            child.receiveShadow = true

            const frontMesh = child.clone()
            frontMesh.name = "ice_front_pass"

            const avgNormal = new THREE.Vector3()
            if (child.geometry.attributes.normal) {
                const normals = child.geometry.attributes.normal.array
                for (let i = 0; i < normals.length; i += 3) {
                    temp.set(normals[i], normals[i + 1], normals[i + 2])
                    avgNormal.add(temp)
                }
                avgNormal.divideScalar(normals.length / 3).normalize()
            }

            frontMesh.position.add(avgNormal.multiplyScalar(0.002))

            child.material = this.materials.back
            frontMesh.material = this.materials.front

            child.add(frontMesh)
            frontMesh.raycast = () => { }

            this.registerInteractive(child)
        })
    }

    setupLowDetail() {
        const lowDetailGroup = this.originalScene.clone(true)

        const simpleIceMaterial = new THREE.MeshStandardMaterial({
            color: 0x99ddee,
            metalness: 0.2,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6,
            envMap: this.envMap
        })

        lowDetailGroup.traverse(child => {
            if (child.isMesh) {
                child.material = simpleIceMaterial
            }
        })

        return lowDetailGroup
    }

    update(delta, elapsed, frameCount, frustum, camera) {
        if (!this.materials) return

        if (camera) {
            this.model.update(camera)
        }

        if (this.model.getCurrentLevel() === 0) {
            if (this.materials.front.uniforms.time) this.materials.front.uniforms.time.value += delta / 1000
            if (this.materials.back.uniforms.time) this.materials.back.uniforms.time.value += delta / 1000
        }

        if (this.hoverBox) this.hoverBox.update()
    }

    onHoverStart(mesh) {
        if (this.hoverBox) return
        this.hoverBox = new THREE.BoxHelper(mesh, 0x66ccff)
        const container = this.model.parent || this.scene
        container.add(this.hoverBox)
    }

    onHoverEnd(mesh) {
        if (!this.hoverBox) return
        if (this.hoverBox.parent) this.hoverBox.parent.remove(this.hoverBox)
        this.hoverBox.geometry.dispose()
        this.hoverBox.material.dispose()
        this.hoverBox = null
    }

    getGUIOptions() {
        if (!this.materials) return {}

        this.guiProxy = {
            frostEnabled: this.frostGrowth,
            frostAmount: this.materials.front.uniforms.frostAmount.value,
            frostGrowthSpeed: this.materials.front.uniforms.frostGrowthSpeed.value,
            baseColor: `#${this.materials.front.uniforms.baseColor.value.getHexString()}`,
            opacity: this.materials.front.uniforms.opacity.value,
            fresnelStrength: this.materials.front.uniforms.fresnelStrength.value,
            ior: this.materials.front.uniforms.ior.value,
            dispersionAmount: this.materials.front.uniforms.dispersionAmount.value,
        }

        return {
            "Frost Growth": {
                object: this.guiProxy,
                property: "frostEnabled",
                listen: true,
                onChange: (v) => this.setFrost(v)
            },

            "Frost Amount": {
                object: this.guiProxy,
                property: "frostAmount",
                min: 0,
                max: 2,
                step: 0.01,
                onChange: (v) => {
                    this.materials.front.uniforms.frostAmount.value = v
                    this.materials.back.uniforms.frostAmount.value = v
                }
            },

            "Frost Growth Speed": {
                object: this.guiProxy,
                property: "frostGrowthSpeed",
                min: 0,
                max: 5,
                step: 0.01,
                onChange: (v) => {
                    this.materials.front.uniforms.frostGrowthSpeed.value = v
                    this.materials.back.uniforms.frostGrowthSpeed.value = v
                }
            },

            "Base Color": {
                object: this.guiProxy,
                property: "baseColor",
                onChange: (v) => {
                    const color = new THREE.Color(v)
                    this.materials.front.uniforms.baseColor.value.copy(color)
                    this.materials.back.uniforms.baseColor.value.copy(color)
                }
            },

            "Opacity": {
                object: this.guiProxy,
                property: "opacity",
                min: 0,
                max: 1,
                step: 0.01,
                onChange: (v) => {
                    this.materials.front.uniforms.opacity.value = v
                    this.materials.back.uniforms.opacity.value = v
                }
            },

            "Fresnel Strength": {
                object: this.guiProxy,
                property: "fresnelStrength",
                min: 0,
                max: 5,
                step: 0.01,
                onChange: (v) => {
                    this.materials.front.uniforms.fresnelStrength.value = v
                    this.materials.back.uniforms.fresnelStrength.value = v
                }
            },

            "IOR": {
                object: this.guiProxy,
                property: "ior",
                min: 1.0,
                max: 2.0,
                step: 0.01,
                onChange: (v) => {
                    this.materials.front.uniforms.ior.value = v
                    this.materials.back.uniforms.ior.value = v
                }
            },

            "Dispersion Amount": {
                object: this.guiProxy,
                property: "dispersionAmount",
                min: 0,
                max: 0.02,
                step: 0.001,
                onChange: (v) => {
                    this.materials.front.uniforms.dispersionAmount.value = v
                    this.materials.back.uniforms.dispersionAmount.value = v
                }
            },

            "Reset Frost Growth": {
                action: () => this.resetFrostGrowth()
            }
        }
    }

    setFrost(enabled) {
        this.frostGrowth = enabled
        if (this.materials) {
            this.materials.front.uniforms.enableFrostGrowth.value = enabled
            this.materials.back.uniforms.enableFrostGrowth.value = enabled
        }
        this.guiProxy.frostEnabled = enabled
        this.guiControllers.frostEnabled?.updateDisplay()
    }

    resetFrostGrowth() {
        if (!this.materials) return
        this.materials.front.uniforms.time.value = 0
        this.materials.back.uniforms.time.value = 0
    }
}