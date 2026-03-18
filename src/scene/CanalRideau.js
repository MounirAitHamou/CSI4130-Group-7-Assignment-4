import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import { createGroundSnowMaterial } from '../materials/GroundSnowMaterial'
import { loadTexture, loadEnvironmentMap } from '../systems/AssetLoader.js'
import { FenceSegment } from './FenceSegment.js'
import { Lamppost } from './Lamppost.js'
import { createSnowMaterial } from '../materials/SnowMaterial.js'

await RAPIER.init()

export class CanalRideau {

    constructor(envMap, camera, scale = 1) {
        this.model = new THREE.Group()
        this.envMap = envMap
        this.camera = camera
        this.scale = scale

        this.snowMaterial = null
        this.balls = []
        this.physicsWorld = null
        this.hoverBox = null
        this.iceMesh = null
        this.boundingSphere = null
    }


    async init() {

        this.physicsWorld = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

        const diff = await loadTexture("concrete/textures/concrete_layers_diff_4k.jpg")
        const nor = await loadEnvironmentMap("concrete/textures/concrete_layers_nor_gl_4k.exr")
        const rough = await loadEnvironmentMap("concrete/textures/concrete_layers_rough_4k.exr")

        nor.mapping = THREE.UVMapping
        rough.mapping = THREE.UVMapping

        const configureConcrete = tex => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping
            tex.repeat.set(20, 1)
        }

            ;[diff, nor, rough].forEach(configureConcrete)

        const sideMat = new THREE.MeshStandardMaterial({
            map: diff,
            normalMap: nor,
            roughnessMap: rough,
            color: 0x444444,
            envMap: this.envMap,
            envMapIntensity: 0.2
        })

        const iceGeometry = new THREE.PlaneGeometry(
            200 * this.scale,
            20 * this.scale,
            40,
            8
        )

        const iceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd8f4ff,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 0.9,
            ior: 1.31,
            thickness: 1.5,
            specularIntensity: 1.0,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
            envMap: this.envMap,
            envMapIntensity: 1.5,
            transparent: true,
            opacity: 1.0
        });

        const ice = new THREE.Mesh(iceGeometry, iceMaterial)

        ice.rotation.x = -Math.PI / 2
        ice.receiveShadow = true

        this.model.add(ice)

        this.iceMesh = ice
        this.iceMesh.userData.entity = this

        const iceBody = this.physicsWorld.createRigidBody(
            RAPIER.RigidBodyDesc.fixed()
        )

        this.physicsWorld.createCollider(
            RAPIER.ColliderDesc.cuboid(
                100 * this.scale,
                0.1 * this.scale,
                10 * this.scale
            ),
            iceBody
        )

        this.snowMaterial = await createGroundSnowMaterial()

        const bankMaterials = [
            sideMat,
            sideMat,
            this.snowMaterial,
            sideMat,
            sideMat,
            sideMat
        ]

        const snowGeo = new THREE.BoxGeometry(
            200 * this.scale,
            1 * this.scale,
            2 * this.scale
        )

        const leftBank = new THREE.Mesh(snowGeo, bankMaterials)
        leftBank.position.set(0, 0.5 * this.scale, -11 * this.scale)
        leftBank.receiveShadow = true
        this.model.add(leftBank)

        const rightBank = new THREE.Mesh(snowGeo, bankMaterials)
        rightBank.position.set(0, 0.5 * this.scale, 11 * this.scale)
        rightBank.receiveShadow = true
        this.model.add(rightBank)

        const leftBankBody = this.physicsWorld.createRigidBody(
            RAPIER.RigidBodyDesc.fixed().setTranslation(
                0,
                0.5 * this.scale,
                -11 * this.scale
            )
        )

        this.physicsWorld.createCollider(
            RAPIER.ColliderDesc.cuboid(
                100 * this.scale,
                0.5 * this.scale,
                1 * this.scale
            ),
            leftBankBody
        )

        const rightBankBody = this.physicsWorld.createRigidBody(
            RAPIER.RigidBodyDesc.fixed().setTranslation(
                0,
                0.5 * this.scale,
                11 * this.scale
            )
        )

        this.physicsWorld.createCollider(
            RAPIER.ColliderDesc.cuboid(
                100 * this.scale,
                0.5 * this.scale,
                1 * this.scale
            ),
            rightBankBody
        )

        await this.createBalls(8)

        this.boundingSphere = new THREE.Sphere(
            new THREE.Vector3(0, 0, 0),
            120 * this.scale
        )

        const segmentLength = 5 * this.scale
        const canalLength = 200 * this.scale
        const segmentCount = Math.floor(canalLength / segmentLength)

        for (let i = 0; i < segmentCount; i++) {

            const fence = new FenceSegment(segmentLength, this.scale, this.envMap, diff, nor, rough)

            const x = -canalLength / 2 + i * segmentLength + segmentLength / 2

            fence.model.position.set(x, 1 * this.scale, -10.2 * this.scale)

            this.model.add(fence.model)
            this.enableShadows(fence.model)
        }

        for (let i = 0; i < segmentCount; i++) {

            const fence = new FenceSegment(segmentLength, this.scale, this.envMap, diff, nor, rough)

            const x = -canalLength / 2 + i * segmentLength + segmentLength / 2

            fence.model.position.set(x, 1 * this.scale, 10.2 * this.scale)

            this.model.add(fence.model)
            this.enableShadows(fence.model)
        }


        await Lamppost.load()

        const lampSpacing = 15 * this.scale
        const lampCount = Math.floor(canalLength / lampSpacing)

        for (let i = 0; i < lampCount; i++) {

            const lamp = Lamppost.create(this.scale)

            const x = -canalLength / 2 + i * lampSpacing

            const z = (i % 2 === 0)
                ? -11.5 * this.scale
                : 11.5 * this.scale

            lamp.position.set(x, 1, z)
            this.model.add(lamp)
            this.enableShadows(lamp)
        }

        this.enableShadows(this.model)
        this.enableShadows(this.iceMesh)
        this.enableShadows(leftBank)
        this.enableShadows(rightBank)

    }

    enableShadows(object) {

        object.traverse(child => {

            if (!child.isMesh) return

            child.castShadow = true
            child.receiveShadow = true

        })

    }

    async createBalls(count) {

        const radius = 0.15 * this.scale
        const spawnAreaX = 100 * this.scale
        const spawnAreaZ = 20 * this.scale
        const height = 0.5 * this.scale + 3

        for (let i = 0; i < count; i++) {

            const x = (Math.random() - 0.5) * spawnAreaX
            const z = (Math.random() - 0.5) * spawnAreaZ
            const y = height

            const body = this.physicsWorld.createRigidBody(
                RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z)
            )

            this.physicsWorld.createCollider(
                RAPIER.ColliderDesc.ball(radius)
                    .setRestitution(0.8)
                    .setFriction(0.02),
                body
            )
            const snowMaterial = await createSnowMaterial()

            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                snowMaterial
            )
            mesh.castShadow = true
            mesh.receiveShadow = true

            mesh.position.set(x, y, z)

            const ballObj = {
                body,
                mesh,
                initialPosition: new THREE.Vector3(x, y, z)
            }

            mesh.userData.entity = this
            mesh.userData.ballRef = ballObj

            this.model.add(mesh)
            this.balls.push(ballObj)
        }
    }

    getInteractiveMeshes() {
        const meshes = [this.iceMesh]
        this.balls.forEach(b => meshes.push(b.mesh))
        return meshes
    }

    onClick(mesh) {

        const ball = mesh.userData.ballRef
        if (!ball) return

        const impulseStrength = 0.1 * this.scale

        const ballPos = new THREE.Vector3()
        mesh.getWorldPosition(ballPos)

        const camPos = new THREE.Vector3()
        this.camera.getWorldPosition(camPos)

        const dir = ballPos.sub(camPos)
        dir.y = 0
        dir.normalize()

        const impulse = {
            x: dir.x * impulseStrength,
            y: 0,
            z: dir.z * impulseStrength
        }

        ball.body.applyImpulse(impulse, true)
    }

    update(delta, elapsed, frameCount, frustum) {

        if (this.snowMaterial)
            this.snowMaterial.uniforms.uTime.value = elapsed

        this.physicsWorld.step()

        this.balls.forEach(ball => {

            if (frustum) {
                const meshBox = new THREE.Box3().setFromObject(ball.mesh)
                if (!frustum.intersectsBox(meshBox)) return
            }

            const pos = ball.body.translation()
            const rot = ball.body.rotation()

            ball.mesh.position.set(pos.x, pos.y, pos.z)
            ball.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w)
        })

        if (this.hoverBox) this.hoverBox.update()
    }

    sendBallsRandom() {

        const impulseScale = 0.5 * this.scale

        this.balls.forEach(ball => {

            const impulse = {
                x: (Math.random() - 0.5) * impulseScale,
                y: 0,
                z: (Math.random() - 0.5) * impulseScale
            }

            ball.body.applyImpulse(impulse, true)
        })
    }

    resetBalls() {

        this.balls.forEach(ball => {

            const p = ball.initialPosition

            ball.body.setTranslation(
                { x: p.x, y: p.y, z: p.z },
                true
            )

            ball.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
            ball.body.setAngvel({ x: 0, y: 0, z: 0 }, true)
        })
    }

    onHoverStart(mesh) {
        if (this.hoverBox) return
        this.hoverBox = new THREE.BoxHelper(mesh, 0x66ccff)
        this.model.add(this.hoverBox)
    }

    onHoverEnd(mesh) {
        if (!this.hoverBox) return
        this.hoverBox.parent.remove(this.hoverBox)
        this.hoverBox.geometry.dispose()
        this.hoverBox.material.dispose()
        this.hoverBox = null
    }

    getGUIOptions() {
        return {
            "Launch Balls": { action: () => this.sendBallsRandom() },
            "Reset Balls": { action: () => this.resetBalls() }
        }
    }
}
