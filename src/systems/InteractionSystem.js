import * as THREE from 'three'
import * as dat from 'dat.gui'

export class InteractionSystem {
    constructor(camera, domElement, world) {
        this.camera = camera
        this.domElement = domElement
        this.world = world

        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        this.interactiveMeshes = []
        this.hovered = null
        this.hoveredEntity = null
        this.activeEntity = null

        this.mouseMoved = true
        this.gui = new dat.GUI()
        this.currentFolder = null

        this.init()
    }

    register(mesh) {
        this.interactiveMeshes.push(mesh)
    }

    init() {
        this.domElement.addEventListener("mousemove", (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
            this.mouseMoved = true
        })

        this.domElement.addEventListener("click", () => {
            if (!this.hoveredEntity) {
                this.closeGUI()
                return
            }

            this.hoveredEntity?.onClick?.(this.hovered)
            if (this.activeEntity === this.hoveredEntity) return

            this.openEntityGUI(this.hoveredEntity)
        })
    }

    removeFolder(folder) {
        if (!folder) return
        folder.close()
        this.gui.__ul.removeChild(folder.domElement.parentNode)
        delete this.gui.__folders[folder.name]
        this.gui.onResize()
    }

    openEntityGUI(entity) {
        if (this.currentFolder) {
            this.removeFolder(this.currentFolder)
            this.currentFolder = null
        }

        this.activeEntity = entity
        const options = entity.getGUIOptions?.()
        if (!options) return

        entity.guiControllers = {}

        const folderName = options._folderName || entity.constructor.name
        this.currentFolder = this.gui.addFolder(folderName)

        Object.entries(options).forEach(([name, config]) => {
            if (name.startsWith('_')) return

            let controller

            if (config.action) {
                controller = this.currentFolder
                    .add({ run: config.action }, "run")
                    .name(name)
            } else if (config.object && config.property) {
                if (config.options) {
                    controller = this.currentFolder.add(
                        config.object,
                        config.property,
                        config.options
                    )
                } else {
                    controller = this.currentFolder.add(
                        config.object,
                        config.property,
                        config.min ?? undefined,
                        config.max ?? undefined,
                        config.step ?? undefined
                    )
                }

                controller.name(name)
                if (config.onChange) controller.onChange(config.onChange)
                if (config.onFinishChange) controller.onFinishChange(config.onFinishChange)

                if (config.listen) {
                    entity.guiControllers[config.property] = controller
                }
            }
        })

        this.currentFolder.open()
    }

    closeGUI() {
        if (!this.currentFolder) return
        this.removeFolder(this.currentFolder)
        this.currentFolder = null
        this.activeEntity = null
    }

    update() {
        if (!this.mouseMoved) return
        this.mouseMoved = false


        const rayOrigin = document.pointerLockElement === this.domElement ? { x: 0, y: 0 } : this.mouse
        this.raycaster.setFromCamera(rayOrigin, this.camera)
        const hits = this.raycaster.intersectObjects(this.interactiveMeshes, true)
        const newHovered = hits.length ? hits[0].object : null

        if (newHovered !== this.hovered) {
            this.hoveredEntity?.onHoverEnd(this.hovered)
            if (newHovered) {
                const entity = newHovered.userData.entity
                entity?.onHoverStart(newHovered)
                this.hoveredEntity = entity
            } else {
                this.hoveredEntity = null
            }
            this.hovered = newHovered
        }
    }
}
