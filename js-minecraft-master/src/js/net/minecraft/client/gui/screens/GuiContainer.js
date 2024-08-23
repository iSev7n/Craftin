import GuiScreen from "../GuiScreen.js";
import Block from "../../world/block/Block.js";

export default class GuiContainer extends GuiScreen {

    constructor(container) {
        super();

        this.inventoryWidth = 176; // Total width of the inventory
        this.inventoryHeight = 166;

        this.container = container;

        this.hoverSlot = null;

        // Adjusting scrollbar properties
        this.scrollBarX = this.inventoryWidth - -1; // Push scrollbar to the right edge
        this.scrollBarY = 18; // Starting Y position
        this.scrollBarWidth = 8; // Width of the scrollbar handle
        this.scrollBarHeight = 110; // Height of the scrollbar
        this.scrollOffset = 0; // Scroll position (0 to 1)

        this.isScrolling = false;
        
    }

    init() {
        super.init();

        this.x = Math.floor((this.width - this.inventoryWidth) / 2);
        this.y = Math.floor((this.height - this.inventoryHeight) / 2);

        // Initialize scrollbar here if necessary
    }

drawScreen(stack, mouseX, mouseY, partialTicks) {
    this.drawDefaultBackground(stack);
    this.drawInventoryBackground(stack);

    // Draw the scrollbar background and handle
    this.drawRect(stack, this.x + this.scrollBarX, this.y + this.scrollBarY, 
                  this.x + this.scrollBarX + this.scrollBarWidth, this.y + this.scrollBarY + this.scrollBarHeight, 
                  '#a0a0a0');

    let handleHeight = Math.max(10, this.scrollBarHeight / (this.container.itemList.length / 9));
    let handleY = this.scrollBarY + this.scrollOffset * (this.scrollBarHeight - handleHeight);
    this.drawRect(stack, this.x + this.scrollBarX, this.y + handleY, 
                  this.x + this.scrollBarX + this.scrollBarWidth, this.y + handleY + handleHeight, 
                  '#ffffff');

    // Force re-render of items if the container is dirty
    if (this.container.dirty) {
        this.container.dirty = false; // Reset dirty flag
        this.minecraft.itemRenderer.destroy("inventory");
        this.minecraft.itemRenderer.scheduleDirty("hotbar");
    }

    // Draw slots
    this.hoverSlot = null;
    this.container.slots.forEach(slot => {
        this.drawSlot(stack, slot, mouseX, mouseY);
    });

    // Draw item in cursor
    let inventoryPlayer = this.minecraft.player.inventory;
    let typeId = inventoryPlayer.itemInCursor;
    if (typeId !== null && typeId !== 0) {
        let block = Block.getById(typeId);
        this.minecraft.itemRenderer.zIndex = 10;
        this.minecraft.itemRenderer.renderItemInGui(
            "inventory",
            "cursor",
            block,
            mouseX,
            mouseY
        );
        this.minecraft.itemRenderer.zIndex = 0;
    } else {
        this.minecraft.itemRenderer.destroy("inventory", "cursor");
    }

    // Draw title
    this.drawTitle(stack);

    super.drawScreen(stack, mouseX, mouseY, partialTicks);
}

    mouseClicked(mouseX, mouseY, mouseButton) {
        super.mouseClicked(mouseX, mouseY, mouseButton);

        if (this.isMouseOverScrollBar(mouseX, mouseY)) {
            this.isScrolling = true;
        }

        for (const slot of this.container.slots) {
            if (this.isMouseOverSlot(slot, mouseX, mouseY)) {
                this.container.onSlotClick(slot, this.minecraft.player);
            }
        }
    }

    mouseReleased(mouseX, mouseY, mouseButton) {
        super.mouseReleased(mouseX, mouseY, mouseButton);
        this.isScrolling = false;
    }

    mouseDragged(mouseX, mouseY, clickedMouseButton, timeSinceLastClick) {
        if (this.isScrolling) {
            // Calculate the new scroll offset
            let handleHeight = Math.max(10, this.scrollBarHeight / (this.container.itemList.length / 9));
            this.scrollOffset = (mouseY - this.y - this.scrollBarY) / (this.scrollBarHeight - handleHeight);
    
            // Clamp the scrollOffset between 0 and 1
            this.scrollOffset = Math.max(0, Math.min(1, this.scrollOffset));
    
            // Update the inventory slots based on the scroll position
            this.container.scrollTo(this.scrollOffset);
        }
    
        super.mouseDragged(mouseX, mouseY, clickedMouseButton, timeSinceLastClick);
    }

    isMouseOverScrollBar(mouseX, mouseY) {
        return mouseX >= this.x + this.scrollBarX && mouseX <= this.x + this.scrollBarX + this.scrollBarWidth &&
               mouseY >= this.y + this.scrollBarY && mouseY <= this.y + this.scrollBarY + this.scrollBarHeight;
    }

    keyTyped(key, character) {
        // Swap to slot
        for (let i = 1; i <= 9; i++) {
            if (key === 'Digit' + i && this.hoverSlot !== null) {
                this.container.swapWithHotbar(this.hoverSlot, this.minecraft.player.inventory, i - 1);
            }
        }

        return super.keyTyped(key, character);
    }

    drawSlot(stack, slot, mouseX, mouseY) {
        let x = this.x + slot.x;
        let y = this.y + slot.y;

        let inventory = slot.inventory;
        let typeId = inventory.getItemInSlot(slot.index);
        let isMouseOver = this.isMouseOverSlot(slot, mouseX, mouseY);

        // Render item
        if (typeId !== null && typeId !== 0) {
            let block = Block.getById(typeId);
            this.minecraft.itemRenderer.renderItemInGui(
                "inventory",
                inventory.name + ":" + slot.index,
                block,
                x + 8,
                y + 8,
                isMouseOver ? 1.5 : 1
            );
        }

        // Hover rectangle
        if (isMouseOver) {
            this.drawRect(stack, x, y, x + 16, y + 16, '#ffffff', 0.5);

            this.hoverSlot = slot;
        }
    }

    onClose() {
        super.onClose();

        this.minecraft.player.inventory.itemInCursor = null;
        this.minecraft.itemRenderer.destroy("inventory");
    }

    drawTitle(stack) {
        // Implement as needed
    }

    drawInventoryBackground(stack) {
        // Implement as needed
    }

    isMouseOverSlot(slot, mouseX, mouseY) {
        let x = this.x + slot.x;
        let y = this.y + slot.y;
        return mouseX >= x && mouseX <= x + 16 && mouseY >= y && mouseY <= y + 16;
    }
}