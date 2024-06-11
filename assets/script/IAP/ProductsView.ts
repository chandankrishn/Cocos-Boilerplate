import { _decorator, Component, native, Node } from "cc";
import { IAPManager } from "./IAPManager";
const { ccclass, property } = _decorator;

@ccclass("ProductsView")
export class ProductsView extends Component {
    start() {
        // Success error for callback for message
        let success = (products) => {
            console.log("Producst fetched successfully ");
        };

        // Erorr callback with message for fetch prodcust
        let error = (message) => {
            console.error(message);
        };

        IAPManager.Instance.getProducts((e) => {
            console.log(e);
        });
    }

    // prouctsFetched(data : ) {}

    update(deltaTime: number) {}
}
