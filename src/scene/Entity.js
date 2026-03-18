import * as THREE from 'three'

export class Entity {

    constructor(world = null) {
        this.world = world
        this.interactiveMeshes = []
        this.model = null

        this.boundingSphere = null
        this._tempSphere = new THREE.Sphere()
        this._tempCenter = new THREE.Vector3()
    }

    registerInteractive(mesh) {
        mesh.userData.entity = this
        this.interactiveMeshes.push(mesh)

        if (this.world?.interactionSystem) {
            this.world.interactionSystem.register(mesh)
        }
    }

    getInteractiveMeshes() {
        return this.interactiveMeshes
    }

    computeBoundingSphere() {
        if (!this.model) return

        const box = new THREE.Box3().setFromObject(this.model)
        this.boundingSphere = new THREE.Sphere()
        box.getBoundingSphere(this.boundingSphere)
    }

    isVisible(frustum) {

        if (!this.boundingSphere || !this.model) return true

        this._tempCenter.copy(this.boundingSphere.center)
        this.model.localToWorld(this._tempCenter)

        this._tempSphere.center.copy(this._tempCenter)
        this._tempSphere.radius = this.boundingSphere.radius

        return frustum.intersectsSphere(this._tempSphere)
    }

    update(delta, elapsed, frameCount, frustum, camera) { }

    getGUIOptions() { return null }

    onHoverStart(mesh) { }
    onHoverEnd(mesh) { }
    onClick(mesh) { }
}
