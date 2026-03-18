import * as THREE from 'three'

export class FenceSegment {

    constructor(length = 5, scale = 1, envMap = null, diff = null, nor = null, rough = null) {

        this.model = new THREE.Group()

        const postHeight = 1.2 * scale
        const postRadius = 0.12 * scale
        const barRadius = 0.03 * scale

        const barOffsets = [
            postHeight * 0.3,
            postHeight * 0.55,
            postHeight * 0.8
        ]

        const stoneMat = new THREE.MeshStandardMaterial({
            map: diff,
            normalMap: nor,
            roughnessMap: rough,
            color: 0x444444
        })

        const metalMat = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.4,
            metalness: 1,
            envMap
        })

        const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 16)

        const leftPost = new THREE.Mesh(postGeo, stoneMat)
        leftPost.position.set(-length / 2, postHeight / 2, 0)

        const rightPost = new THREE.Mesh(postGeo, stoneMat)
        rightPost.position.set(length / 2, postHeight / 2, 0)

        this.model.add(leftPost)
        this.model.add(rightPost)

        const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, length, 12)

        barGeo.rotateZ(Math.PI / 2)

        for (let y of barOffsets) {

            const bar = new THREE.Mesh(barGeo, metalMat)

            bar.position.set(0, y, 0)

            this.model.add(bar)
        }
    }

}
