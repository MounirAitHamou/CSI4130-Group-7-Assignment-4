import * as THREE from 'three'

export class FirstPersonController {

    constructor(camera, domElement) {

        this.camera = camera
        this.domElement = domElement

        this.moveSpeed = 8
        this.lookSpeed = 0.002

        this.enabled = false

        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()
        this.tempMove = new THREE.Vector3()

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        }

        this.euler = new THREE.Euler(0, 0, 0, 'YXZ')

        this.init()
    }

    init() {

        this.domElement.addEventListener('click', () => {
            this.domElement.requestPointerLock()
        })

        document.addEventListener('pointerlockchange', () => {
            this.enabled = document.pointerLockElement === this.domElement
        })

        document.addEventListener('mousemove', (event) => {

            if (!this.enabled) return

            this.euler.setFromQuaternion(this.camera.quaternion)

            this.euler.y -= event.movementX * this.lookSpeed
            this.euler.x -= event.movementY * this.lookSpeed

            this.euler.x = Math.max(
                -Math.PI / 2,
                Math.min(Math.PI / 2, this.euler.x)
            )

            this.camera.quaternion.setFromEuler(this.euler)

        })

        document.addEventListener('keydown', (e) => this.onKey(e, true))
        document.addEventListener('keyup', (e) => this.onKey(e, false))
    }

    onKey(event, pressed) {

        switch (event.code) {

            case 'KeyW': this.keys.forward = pressed; break
            case 'KeyS': this.keys.backward = pressed; break
            case 'KeyA': this.keys.left = pressed; break
            case 'KeyD': this.keys.right = pressed; break
            case 'Space': this.keys.up = pressed; break
            case 'ShiftLeft': this.keys.down = pressed; break

        }
    }

    update(delta) {

        if (!this.enabled) return

        this.direction.set(0, 0, 0)

        if (this.keys.forward) this.direction.z -= 1
        if (this.keys.backward) this.direction.z += 1
        if (this.keys.left) this.direction.x -= 1
        if (this.keys.right) this.direction.x += 1
        if (this.keys.up) this.direction.y += 1
        if (this.keys.down) this.direction.y -= 1

        this.direction.normalize()

        this.tempMove.copy(this.direction)

        this.tempMove
            .applyQuaternion(this.camera.quaternion)
            .multiplyScalar(this.moveSpeed * delta)

        this.camera.position.add(this.tempMove)
    }
}