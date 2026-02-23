export class World {
    constructor(scene) {
        this.scene = scene;
        this.entities = [];
    }

    add(entity) {
        this.entities.push(entity);
        if (entity.model) this.scene.add(entity.model);
        else if (entity.add) this.scene.add(entity);
    }

    update(delta, elapsed, frameCount) {
        this.entities.forEach(entity => {
            if (typeof entity.update === "function") {
                entity.update(delta, elapsed, frameCount);
            } else if (entity.userData?.update) {
                entity.userData.update(delta, elapsed, frameCount);
            }
        });
    }
}