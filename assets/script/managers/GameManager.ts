import { PersistNode } from "../comman/PersistNode";

export class GameManager {
    private static _instance: GameManager | null = null;

    private persistNodeRef: PersistNode = null!
    public static get Instance() {
        if (!GameManager._instance) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    }


    set PersistNodeRef(ref: PersistNode) {
        this.persistNodeRef = ref;
    }

    get PersistNodeRef(): PersistNode {
        return this.persistNodeRef;
    }
}
