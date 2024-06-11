import {
    _decorator,
    Component,
    EventTouch,
    Node,
    UITransform,
    Vec2,
    Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Draggable")
export class Draggable extends Component {
    @property({ tooltip: "Drag the trigger threshold" })
    protected dragThreshold: number = 1;

    /**
     * Touch starting position
     */
    protected touchStartPos: Vec2 = null!;

    /**
     * Drag position offset
     */
    protected dragOffset: Vec3 = null!;

    /**
     * Drag position offset
     */
    protected isDragging: boolean = false;

    /**
     * Drag
     */
    public static get EventType() {
        return EventType;
    }

    /**
     *Life cycle: load
     */
    protected onLoad() {
        this.registerEvent();
    }

    /**
     * Life cycle: destruction
     */
    protected onDestroy() {
        this.unregisterEvent();
    }

    /**
     * Registration issue
     */
    protected registerEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * Anti -registration
     */
    protected unregisterEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * Touch began to call back
     * @param event
     */

    protected onTouchStart(event: EventTouch) {
        // Record starting position
        this.touchStartPos = event.getUILocation();
        // Record center offset
        const touchPosInNode = this.node
            .getParent()
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(
                new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
            )!;

        this.dragOffset = touchPosInNode.subtract(this.node.getPosition());

        console.log({
            touchStartPos: this.touchStartPos,
            touchPosInNode,
            dragOffset: this.dragOffset,
        });
    }

    /**
     * Touch mobile callback
     * @param event
     */
    protected onTouchMove(event: EventTouch) {
        if (!this.dragOffset) {
            return;
        }
        // Touch position
        const touchPosInWorld = event.getUILocation();
        const touchPosInNode = this.node
            .getParent()
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(
                new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
            );
        // Touch the moving distance (judge whether to trigger drag and drag)
        if (!this.isDragging && this.dragThreshold !== 0) {
            const distance = Vec2.distance(this.touchStartPos, touchPosInWorld);
            if (distance < this.dragThreshold) {
                return;
            }
            // Calculate the center offset
            this.dragOffset = touchPosInNode?.subtract(
                this.node.getPosition()
            )!;
        }
        // Mobile node
        this.node.setPosition(touchPosInNode?.subtract(this.dragOffset)!);
        // Trigger callback
        if (!this.isDragging) {
            this.isDragging = true;
            this.onDragStart();
        } else {
            this.onDragMove();
        }
    }

    /**
     * Touch cancel
     * @param event
     */
    protected onTouchCancel(event: EventTouch) {
        this.onTouchEnd(event);
    }

    /**
     * Touch end
     * @param event
     */
    protected onTouchEnd(event: EventTouch) {
        if (!this.dragOffset) {
            return;
        }
        // Reset
        this.touchStartPos = null!;
        this.dragOffset = null!;
        // Trigger callback
        if (this.isDragging) {
            this.isDragging = false;
            this.onDragEnd();
        }
    }

    /**
     * Drag and drag start to call back
     */
    protected onDragStart() {}

    /**
     * Drag and pull back
     */
    protected onDragMove() {}

    /**
     * Drag and dragging the recovery
     */
    protected onDragEnd() {}
}

/**
 * Drag
 */
enum EventType {
    /** Drag down */
    DRAG_START = "drag-start",
    /** Drag */
    DRAG_MOVE = "drag-move",
    /** Drag down */
    DRAG_END = "drag-end",
}
