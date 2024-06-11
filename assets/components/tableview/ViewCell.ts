import { _decorator, Component, Label, Node } from "cc";
import { TableView } from "./TableView";
const { ccclass, property } = _decorator;

@ccclass("ViewCell")
export class ViewCell extends Component {
    static getSize(index: number, data?: any): number {
        return 0;
    }

    init(index: number, data?: any, tv?: TableView) {}

    uninit() {}

    reload(data?: any) {}
}
