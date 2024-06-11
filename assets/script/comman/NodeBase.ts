import {
    Component,
    Node,
    Prefab,
    Sprite,
    SpriteFrame,
    UITransform,
    instantiate,
    math,
    warn,
} from "cc";

export class NodeBase {
    /**
     *
     * @param nodeRef Send Ref of node or prefab to instantiate node
     * @param name send node name to set it the same
     */
    constructor(nodeRef?: Prefab | Node | null, name?: string) {
        if (nodeRef) {
            this.node = <Node>instantiate(nodeRef);
        }
        this._node.name = name || "node";
    }
    private _node: Node = new Node();

    //Getter and setter and of node
    public get node(): Node {
        return this._node;
    }
    public set node(node: Node) {
        this._node = node;
    }

    //adding a component of a node
    public addComponent<T extends Component>(component: { new (): T }) {
        const componentInstance = this.node.addComponent(component);
        if (!componentInstance) {
            warn("Invlaid component you want to add");
            return;
        }
        return componentInstance;
    }

    public set spriteFrame(image: SpriteFrame | null) {
        const spriteComponent = this.node.getComponent(Sprite);
        if (spriteComponent && image) {
            spriteComponent.spriteFrame = image;
        } else {
            warn("Error while assiging image to it");
        }
    }

    public getComponent<T extends Component>(component: {
        new (): T;
    }): T | null {
        if (component) {
            return this.node.getComponent(component);
        } else return null;
    }

    //Getter and setters for content size and more
    public setContentSize(size: math.Size) {
        this.node.getComponent(UITransform)?.setContentSize(size);
    }

    public get widht() {
        return this.node.getComponent(UITransform)?.width || 0;
    }

    public set widht(widht: number) {
        const uiTransform = this.node.getComponent(UITransform);
        if (widht != null && widht != undefined)
            uiTransform && (uiTransform.width = widht);
        else warn("Null or undefined width");
    }

    public get height() {
        return this.node.getComponent(UITransform)?.height || 0;
    }
    public set height(height: number) {
        const uiTransform = this.node.getComponent(UITransform);
        if (height != null && height != undefined)
            uiTransform && (uiTransform.height = height);
        else warn("Null or undefined width");
    }

    //Getter and Setter for positions
    public get x() {
        return this.node.getPosition().x;
    }
    public get y() {
        return this.node.getPosition().y;
    }
    public get position() {
        return this.node.getPosition();
    }
    public set position(position: math.Vec3) {
        this.node.setPosition(position);
    }
}
