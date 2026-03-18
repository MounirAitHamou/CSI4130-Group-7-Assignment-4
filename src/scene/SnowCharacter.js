import * as THREE from 'three'
import { Entity } from './Entity.js'
import { createSnowMaterial } from '../materials/SnowMaterial.js'

export class SnowCharacter extends Entity {

    constructor(gltf) {
        super()

        this.model = gltf.scene
        this.animations = gltf.animations
        this.mixer = new THREE.AnimationMixer(this.model)

        this.actions = {}
        this.currentAnimationName = 'None'
        this.isAutoPlaying = false

        this.baseMaterial = null
        this.hoverBox = null
        this.fadeDuration = 0.5

        this.guiProxy = {
            selection: this.currentAnimationName,
            autoPlayEnabled: this.isAutoPlaying
        }

        this.guiControllers = {}
    }

    async init() {

        this.baseMaterial = await createSnowMaterial()

        const meshes = []

        this.model.traverse(child => {

            if (!child.isMesh) return

            child.material = this.baseMaterial.clone()

            child.castShadow = true
            child.receiveShadow = true

            meshes.push(child)

        })

        meshes.forEach(mesh => this.registerInteractive(mesh))

        for (const animation of this.animations) {

            const action = this.mixer.clipAction(animation)
            this.actions[animation.name] = action

        }

        this.computeBoundingSphere()
    }

    setAnimation(name) {

        if (this.currentAnimationName === name) return

        const nextAction = this.actions[name]
        const currentAction = this.actions[this.currentAnimationName]

        if (nextAction) {
            nextAction.reset().fadeIn(this.fadeDuration).play()
        }

        if (currentAction) {
            currentAction.fadeOut(this.fadeDuration)
        }

        this.currentAnimationName = name

        this.guiProxy.selection = name
        this.guiProxy.autoPlayEnabled = this.isAutoPlaying

        this.guiControllers.selection?.updateDisplay()
        this.guiControllers.autoPlayEnabled?.updateDisplay()
    }

    handleAutoPlay() {

        if (!this.isAutoPlaying || Object.keys(this.actions).length === 0) return

        const currentAction = this.actions[this.currentAnimationName]

        if (!currentAction || (currentAction.time >= currentAction.getClip().duration - this.fadeDuration)) {

            const names = Object.keys(this.actions)

            let currentIndex = names.indexOf(this.currentAnimationName)
            let nextIndex = (currentIndex + 1) % names.length

            this.setAnimation(names[nextIndex])

        }
    }

    update(delta) {

        this.mixer.update(delta)

        if (this.isAutoPlaying) {
            this.handleAutoPlay()
        }

        if (this.hoverBox) this.hoverBox.update()
    }

    onHoverStart(mesh) {

        if (this.hoverBox) return

        this.hoverBox = new THREE.BoxHelper(mesh, 0xffcc66)
        this.model.parent.add(this.hoverBox)

    }

    onHoverEnd() {

        if (!this.hoverBox) return

        this.hoverBox.parent.remove(this.hoverBox)
        this.hoverBox.geometry.dispose()
        this.hoverBox.material.dispose()

        this.hoverBox = null
    }

    getGUIOptions() {

        const animationNames = ['None', ...Object.keys(this.actions)]

        return {

            "Select Animation": {
                object: this.guiProxy,
                property: "selection",
                options: animationNames,
                listen: true,
                onChange: (val) => {

                    this.isAutoPlaying = false
                    this.setAnimation(val)

                }
            },

            "Auto Play": {
                object: this.guiProxy,
                property: "autoPlayEnabled",
                listen: true,
                onChange: (v) => {

                    this.isAutoPlaying = v

                }
            },

            "Reset Character": {

                action: () => {

                    this.isAutoPlaying = false
                    this.setAnimation('None')

                }

            }

        }

    }

}