import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import GUI from "./dat.gui.min.js";

@ccclass("DatGUI")
export class DatGUI extends Component {
    @property({ type: Node })
    MachineNode: Node | null = null;

    @property({ type: Node })
    exampleSprite: Node | null = null;

    protected onLoad(): void {
        this.debuggerFolderCreation();
    }
    /**
     * @description creates the main folder named Debugger and a checkbox to show/hide rest of elements on screen
     */
    debuggerFolderCreation() {
        let gui: GUI = new GUI.GUI();

        const checkboxObject = {
            isVisible: true,
        };

        gui.addFolder("DEBUGGER");
        gui.add(checkboxObject, "isVisible").onChange((value) => {
            this.MachineNode && (this.MachineNode.active = value);
        });
        this.positionsFolderCreator(gui);
        this.scalingFolderCreator(gui);
    }

    /**
     * @description creates the Position folder which holds the property of changing x and y
     * @param gui
     */
    positionsFolderCreator(gui: GUI) {
        const folder = gui.addFolder("Node Pos Transform");
        const positionsFolder = folder.addFolder("Position");
        const pos: Vec3 = this.exampleSprite?.getPosition()!;
        positionsFolder
            .add(pos, "x")
            .min(-1000)
            .max(1000)
            .step(0.1)
            .onChange((value) => {
                this.exampleSprite?.setPosition(value, pos.y);
            });

        positionsFolder
            .add(pos, "y")
            .min(-600)
            .max(600)
            .step(0.1)
            .onChange((value) => {
                this.exampleSprite?.setPosition(pos.x, value);
            });
    }

    /**
     * @description creates the Scaling folder which sets the scaling factor and scale of x and y
     * @param gui
     */
    scalingFolderCreator(gui: GUI) {
        const folder = gui.addFolder("Node Scale Transform");
        const scalingFolder = folder.addFolder("Scale");
        const currentScale = this.exampleSprite?.getScale();
        const steps = {
            step: 0.1,
        };

        scalingFolder
            .add(steps, "step")
            .name("Scaling Factor")
            .onChange((value) => {
                scalingVariable.__step = value;
            });
        const scalingVariable = scalingFolder
            .add(currentScale, "x")
            .min(0)
            .max(10)
            .step(steps.step)
            .name("Scale")
            .onChange((value) => {
                this.exampleSprite?.setScale(value, value);
            });
    }

    update(deltaTime: number) { }
}
