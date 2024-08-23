import BlockRenderType from "../../../../util/BlockRenderType.js";
import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";

export default class BlockOakSign extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

    }

    getRenderType() {
        return BlockRenderType.DECORATION;
    }

    isTranslucent() {
        return true;
    }
    
    isDecoration() {
        return true;
    }

    isSolid() {
        return false;
    }
}