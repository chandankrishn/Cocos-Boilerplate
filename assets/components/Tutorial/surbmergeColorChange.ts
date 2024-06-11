import { _decorator, Component, Material, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('surbmergeColorChange')
export class surbmergeColorChange extends Component {

    protected material: Material = null!;

    colorNum: number = 0;
    onLoad() {
        this.material = this.node.getComponent(Sprite)?.customMaterial!

        this.material.setProperty('waterLevel', 0.01);
        // this.startChange(1000);
    }

    update(deltaTime: number) {
        // this.material.setProperty('u_dH', this.colorNum);
        // this.colorNum += 1
        // if (this.colorNum > 300) {
        //     this.colorNum = 0
        // }
    }

    private value: number;
    private minValue: number;
    private maxValue: number;
    private increment: number;
    private interval: number | undefined;

    constructor(minValue: number = -2, maxValue: number = 0.71, increment: number = 0.05) {
        super()
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.increment = increment;
        this.value = minValue;
    }

    private incrementValue() {
        if (this.value + this.increment <= this.maxValue) {
            this.value += this.increment;
        } else {
            this.decrementValue();
        }
        this.material.setProperty('waterLevel', this.value);
        console.log("Value:", this.value);
    }

    private decrementValue() {
        if (this.value - this.increment >= this.minValue) {
            this.value -= this.increment;
        } else {
            this.incrementValue();
        }
        console.log("Value:", this.value);
    }

    startChange(intervalMs: number) {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.incrementValue();
            }, intervalMs);
        }
    }
}

