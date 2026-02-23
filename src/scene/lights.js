import * as THREE from 'three'

export function addLights(scene) {

    const ambient = new THREE.AmbientLight(0x223344, 0.9)
    scene.add(ambient)

    const moon = new THREE.DirectionalLight(0xbfdfff, 3.0)
    moon.position.set(6, 12, 4)
    moon.castShadow = true

    moon.shadow.mapSize.width = 2048
    moon.shadow.mapSize.height = 2048
    moon.shadow.camera.near = 0.5
    moon.shadow.camera.far = 60

    scene.add(moon)

    const point1 = new THREE.PointLight(0x88ccff, 4.5, 45)
    point1.position.set(0, 3, 0)
    point1.castShadow = true
    scene.add(point1)

    const point2 = new THREE.PointLight(0xaaddff, 4.0, 40)
    point2.position.set(-5, 3, -5)
    point2.castShadow = true
    scene.add(point2)

    point1.userData.update = () => {
        point1.intensity = 4.2 + Math.sin(Date.now() * 0.002) * 0.4
    }

    point2.userData.update = () => {
        point2.intensity = 3.8 + Math.sin(Date.now() * 0.0015 + 1) * 0.3
    }
}