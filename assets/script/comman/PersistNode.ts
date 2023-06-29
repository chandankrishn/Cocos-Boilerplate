import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PersistNode")
export class PersistNode extends Component {
  start() {
    director.addPersistRootNode(this.node);
  }

  update(deltaTime: number) {}
}
