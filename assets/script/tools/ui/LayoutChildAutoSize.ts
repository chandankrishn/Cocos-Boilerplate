import {
    _decorator,
    Component,
    Layout,
    isValid,
    Node,
    CCFloat,
    NodeEventType,
    UITransform,
} from "cc";

const { ccclass, property, menu, executeInEditMode } = _decorator;

@ccclass
@menu("Custom UI/Layout Child Auto Size")
@executeInEditMode
export class LayoutChildAutoSize extends Component {
    @property(Layout) layout: Layout | null = null;

    @property({
        type: Node,
        tooltip:
            "If component is added on ScrollView then this should be the Content",
    })
    maxSizeAs: Node | null = null;

    @property({
        type: CCFloat,
        visible: function (this: LayoutChildAutoSize) {
            return (
                this.layout != null &&
                this.layout.resizeMode == Layout.ResizeMode.CONTAINER &&
                this.layout.type == Layout.Type.VERTICAL
            );
        },
    })
    maxHeight: number = 0;

    @property({
        type: CCFloat,
        visible: function (this: LayoutChildAutoSize) {
            return (
                this.layout != null &&
                this.layout.resizeMode == Layout.ResizeMode.CONTAINER &&
                this.layout.type == Layout.Type.HORIZONTAL
            );
        },
    })
    maxWidth: number = 0;

    private editorFocus: boolean = false;

    protected onEnable(): void {
        this.onLayoutSizeChanged();

        if (isValid(this.layout, true)) {
            if (this.layout?.resizeMode == Layout.ResizeMode.NONE)
                this.layout.node.on(
                    NodeEventType.SIZE_CHANGED,
                    this.onLayoutSizeChanged,
                    this
                );
            this.layout?.node.on(
                NodeEventType.CHILD_ADDED,
                this.onLayoutSizeChanged,
                this
            );
            this.layout?.node.on(
                NodeEventType.CHILD_REMOVED,
                this.onLayoutSizeChanged,
                this
            );
            //   this.layout.node.on(NodeEventType.CHILD_REORDER, this.onLayoutSizeChanged, this);
        }

        if (isValid(this.maxSizeAs, true)) {
            this.maxSizeAs?.on(
                NodeEventType.SIZE_CHANGED,
                this.onLayoutSizeChanged,
                this
            );
        }
    }

    protected onDisable(): void {
        if (isValid(this.layout, true)) {
            if (this.layout?.resizeMode == Layout.ResizeMode.NONE)
                this.layout.node.off(
                    Node.EventType.SIZE_CHANGED,
                    this.onLayoutSizeChanged,
                    this
                );
            this.layout?.node.off(
                Node.EventType.CHILD_ADDED,
                this.onLayoutSizeChanged,
                this
            );
            this.layout?.node.off(
                Node.EventType.CHILD_REMOVED,
                this.onLayoutSizeChanged,
                this
            );
            //   this.layout.node.off(Node.EventType.CHILD_REORDER, this.onLayoutSizeChanged, this);
        }

        if (isValid(this.maxSizeAs, true)) {
            this.maxSizeAs?.off(
                Node.EventType.SIZE_CHANGED,
                this.onLayoutSizeChanged,
                this
            );
        }
    }

    public onFocusInEditor(): void {
        this.editorFocus = true;
    }

    public onLostFocusInEditor(): void {
        this.editorFocus = false;
    }

    protected update(dt: number): void {
        if (this.editorFocus) {
            this.onLayoutSizeChanged();
        }
    }

    onLayoutSizeChanged(): void {
        if (!isValid(this.layout, true)) return;

        if (
            this.layout?.type == Layout.Type.NONE ||
            this.layout?.type == Layout.Type.GRID
        )
            return;

        let childrens: Node[] | undefined = this.layout?.node.children;
        let childrensSize: number = 0;
        const UiTransform = this.node?.getComponent(UITransform);
        switch (this.layout?.type) {
            case Layout.Type.VERTICAL:
                {
                    for (
                        let i: number = 0, len: number = childrens?.length || 0;
                        i < len;
                        i++
                    ) {
                        if (
                            childrens &&
                            childrens[i] &&
                            childrens[i].uuid != this.node.uuid &&
                            childrens[i].active
                        ) {
                            childrensSize +=
                                (childrens[i]?.getComponent(UITransform)
                                    ?.height || 0) + this.layout.spacingY;
                        }
                    }
                    childrensSize +=
                        this.layout.paddingTop +
                        this.layout.paddingBottom +
                        0.01;

                    let maxSize: number = 0;
                    if (this.layout.resizeMode == Layout.ResizeMode.NONE)
                        maxSize =
                            (this.layout?.node?.getComponent(UITransform)
                                ?.height || 0) - childrensSize;
                    else if (
                        this.layout.resizeMode == Layout.ResizeMode.CONTAINER
                    )
                        maxSize = this.maxHeight;

                    if (maxSize > 0) {
                        // 0.01 is added so it will not scroll if whole scroll view content is shown
                        if (isValid(this.maxSizeAs))
                            UiTransform &&
                                (UiTransform.height = Math.min(
                                    (this.maxSizeAs?.getComponent(UITransform)
                                        ?.height || 0) + 0.01,
                                    maxSize
                                ));
                        else UiTransform && (UiTransform.height = maxSize);
                    }
                }
                break;

            case Layout.Type.HORIZONTAL:
                {
                    for (
                        let i: number = 0,
                            len: number | undefined = childrens?.length || 0;
                        i < len;
                        i++
                    ) {
                        if (
                            childrens &&
                            childrens[i] &&
                            childrens[i].uuid != this.node.uuid &&
                            childrens[i].active
                        ) {
                            childrensSize +=
                                (childrens[i]?.getComponent(UITransform)
                                    ?.width || 0) + this.layout.spacingX;
                        }
                    }
                    childrensSize +=
                        this.layout.paddingLeft +
                        this.layout.paddingRight +
                        0.01;

                    let maxSize: number = 0;
                    if (this.layout.resizeMode == Layout.ResizeMode.NONE)
                        maxSize =
                            (this.layout?.node?.getComponent(UITransform)
                                ?.width || 0) - childrensSize;
                    else if (
                        this.layout.resizeMode == Layout.ResizeMode.CONTAINER
                    )
                        maxSize = this.maxWidth;

                    if (maxSize > 0) {
                        // 0.01 is added so it will not scroll if whole scroll view content is shown
                        if (isValid(this.maxSizeAs))
                            UiTransform &&
                                (UiTransform.width = Math.min(
                                    (this.maxSizeAs?.getComponent(UITransform)
                                        ?.width || 0) + 0.01,
                                    maxSize
                                ));
                        else UiTransform && (UiTransform.width = maxSize);
                    }
                }
                break;
        }
    }
}
