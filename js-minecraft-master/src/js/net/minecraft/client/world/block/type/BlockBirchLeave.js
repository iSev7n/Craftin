import Block from "../Block.js";

export default class BlockBirchLeave extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.dirt;
    }

    // TODO fix transparency of leaves
    /*isTranslucent() {
        return true;
    }*/

    // TODO fix transparency of leaves
    /*shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAtFace(x, y, z, face);
        return typeId === 0 || typeId === this.id;
    }*/

    getOpacity() {
        return 0.3;
    }
}