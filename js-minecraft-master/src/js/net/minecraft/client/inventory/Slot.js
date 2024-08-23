export default class Slot {
    constructor(inventory, index, x, y) {
        this.inventory = inventory;
        this.index = index;
        this.x = x;
        this.y = y;
    }

    getHasStack() {
        return this.inventory.getItemInSlot(this.index) != null;
    }

    getStack() {
        return this.inventory.getItemInSlot(this.index);
    }

    putStack(itemStack) {
        this.inventory.setItem(this.index, itemStack);
        this.onSlotChanged();
    }

    onSlotChanged() {
        // Example: Call a method that might be equivalent to marking the inventory as dirty
        if (this.inventory && typeof this.inventory.updateInventory === 'function') {
            this.inventory.updateInventory();  // Replace with the correct method
        }
    }

    decrStackSize(amount) {
        let itemStack = this.getStack();
        if (itemStack != null) {
            if (itemStack.stackSize <= amount) {
                this.putStack(null);
            } else {
                itemStack.splitStack(amount);
                this.onSlotChanged();
            }
        }
        return itemStack;
    }

    isHere(inventory, index) {
        return inventory == this.inventory && index == this.index;
    }
}