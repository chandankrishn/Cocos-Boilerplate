import { _decorator, Component, Node, RichText, UITransform, Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Marquee")
export class Marquee extends Component {
    @property({ type: Node, tooltip: "Container node" })
    private view: Node = null!;

    @property({ type: RichText, tooltip: "Text component" })
    private label: RichText = null!;

    @property({ tooltip: "Text queue" })
    private texts: string[] = [];

    @property({ tooltip: "Pixels per frame" })
    private speed: number = 1;

    @property({ tooltip: "Loop" })
    private loop: boolean = false;

    @property({ tooltip: "Autoplay" })
    private playOnLoad: boolean = false;

    private index: number = 0;

    private isPlaying: boolean = false;

    private endCallback: Function = null!;

    protected onLoad() {
        this.init();
        this.playOnLoad && this.play(0, this.loop);
    }

    protected update(dt: number) {
        if (!this.isPlaying || this.texts.length === 0) return;
        this.updatePosition();
    }

    private init() {
        const anchorPoint =
            this.label.node.getComponent(UITransform)?.anchorPoint;
        this.label.node
            .getComponent(UITransform)
            ?.setAnchorPoint(new Vec2(0, anchorPoint?.y));
        this.setLabel("");
        //Usage
        this.push(["Harpinder Singh", "Chandan Krishnani"]);
    }

    private updatePosition() {
        const position = this.label.node.position;
        // this.label.node.x -= this.speed;
        const newXPos = position.x - this.speed;
        this.label.node.setPosition(newXPos, position.y, position.z);
        const halfViewWidth = this.view.getComponent(UITransform)?.width! / 2;
        const labelWidth = this.label.node.getComponent(UITransform)?.width!;
        if (this.label.node.position.x <= -(halfViewWidth + labelWidth))
            this.next();
    }

    private setLabel(text: string) {
        this.label.string = text;
        const position = this.label.node.position;
        const halfViewWidth = this.view.getComponent(UITransform)?.width! / 2;
        this.label.node.setPosition(halfViewWidth, position.y, position.z);
    }

    private next() {
        this.index++;
        if (this.index >= this.texts.length) {
            if (this.loop) {
                this.index = 0;
                this.setLabel(this.texts[0]);
            } else {
                if (this.endCallback) {
                    this.endCallback();
                    this.endCallback = null!;
                }
                this.clean();
            }
        } else {
            this.setLabel(this.texts[this.index]);
        }
    }

    public push(texts: string[]) {
        if (Array.isArray(texts)) this.texts.push(...texts);
        else this.texts.push(texts);
    }

    public play(
        index: number = 0,
        loop: boolean = false,
        callback: Function = null!
    ) {
        if (this.texts.length === 0) return;

        this.index = index < this.texts.length ? index : 0;
        this.setLabel(this.texts[this.index]);

        this.loop = loop;
        this.endCallback = callback;

        this.isPlaying = true;
    }

    public stop() {
        this.isPlaying = false;
        this.index = 0;
    }

    public pause() {
        this.isPlaying = false;
    }

    public resume() {
        this.isPlaying = true;
    }

    public clean() {
        this.stop();
        this.index = 0;
        this.texts = [];
        this.endCallback = null!;
    }
}
