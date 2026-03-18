import * as THREE from 'three'
import { loadGLTF } from '../systems/AssetLoader.js'

export class Lamppost {

    static model = null

    static async load() {

        if (this.model) return

        const gltf = await loadGLTF("lamppost/street_lamp_01_4k.gltf")
        this.model = gltf.scene
    }

    static create(scale = 1) {

        const lamp = this.model.clone(true)
        lamp.scale.setScalar(scale)

        let glass = null
        let bulb = null

        lamp.traverse(obj => {
            // Had to identify each mesh using distinct colors
            if (obj.name === "street_lamp_01_post_mesh_1") glass = obj
            if (obj.name === "street_lamp_01_post_mesh_2") bulb = obj
        })

        const light = new THREE.PointLight(0xffe8aa, 2, 12)
        light.position.set(0, 3.3 * scale, 0)

        lamp.add(light)

        lamp.userData.light = light
        lamp.userData.glass = glass
        lamp.userData.bulb = bulb


        if (glass?.material) {

            glass.material = glass.material.clone()

            glass.material.transparent = true
            glass.material.opacity = 0.35

            if ("transmission" in glass.material) {
                glass.material.transmission = 1
                glass.material.ior = 1.45
                glass.material.thickness = 0.1
                glass.material.opacity = 1
            }

            glass.material.roughness = 0.05
            glass.material.metalness = 0
        }

        if (bulb?.material) {
            bulb.material = bulb.material.clone()
        }

        this.setLampOn(lamp, true)

        return lamp
    }

    static setLampOn(lamp, on) {

        const light = lamp.userData.light
        const glass = lamp.userData.glass
        const bulb = lamp.userData.bulb

        light.visible = on

        if (bulb?.material) {

            bulb.material.emissive.set(on ? 0xfff4c2 : 0x000000)
            bulb.material.emissiveIntensity = on ? 6 : 0
        }

        if (glass?.material) {

            glass.material.emissive.set(on ? 0xffe8aa : 0x000000)
            glass.material.emissiveIntensity = on ? 1.5 : 0
        }
    }
}
