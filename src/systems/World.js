import { InteractionSystem } from "./InteractionSystem.js"
import { Entity } from "../scene/Entity.js"
import * as THREE from 'three'

export class World {

    constructor(scene, camera, domElement) {
        this.scene = scene
        this.camera = camera
        this.entities = []

        this.interactionSystem = new InteractionSystem(camera, domElement, this)

        this.frustum = new THREE.Frustum()
        this.projScreenMatrix = new THREE.Matrix4()
    }

    add(obj) {
        if (obj instanceof Entity) obj.world = this

        if (typeof obj.update === 'function') {
            this.entities.push(obj)
        }

        if (obj.model instanceof THREE.Object3D) {
            this.scene.add(obj.model)
        } else if (obj instanceof THREE.Object3D) {
            this.scene.add(obj)
        }

        if (typeof obj.getInteractiveMeshes === 'function') {
            obj.getInteractiveMeshes().forEach(mesh => {
                this.interactionSystem.register(mesh)
            })
        }
    }

    update(delta, elapsed, frameCount) {

        this.projScreenMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        )

        this.frustum.setFromProjectionMatrix(this.projScreenMatrix)

        for (let i = 0; i < this.entities.length; i++) {

            const e = this.entities[i]

            if (typeof e.isVisible === "function") {
                if (!e.isVisible(this.frustum)) continue
            }

            e.update(delta, elapsed, frameCount, this.frustum, this.camera)
        }

        this.interactionSystem.update()
    }


}
