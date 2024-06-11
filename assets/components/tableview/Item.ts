import { _decorator, Component, Label, Node } from "cc";
import { ViewCell } from "./ViewCell";
const { ccclass, property } = _decorator;

@ccclass("Item")
export class Item extends ViewCell {
    @property(Label)
    l1: Label = null!;

    @property(Label)
    l2: Label = null!;

    @property(Label)
    l3: Label = null!;

    init(index: number, data?: any) {
        this.l1.string = `${index} ${data[index]} - 1`;
        this.l2.string = `${index} ${data[index]} - 2`;
        this.l3.string = `${index} ${data[index]} - 3`;
    }
}
