import { _decorator, Component, Label, Node, tween, Tween } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Counter')
@requireComponent(Label)
export class Counter extends Component {
    @property(Label)
    public label: Label = null!;

    @property({ tooltip: 'Animation time' })
    public duration: number = 0.5;

    @property({ tooltip: 'Keep the value as an integer' })
    public keepInteger: boolean = true;

    protected actualValue: number = 0;

    public get value() {
        return this.actualValue;
    }

    public set value(value: number) {
        if (this.keepInteger) {
            value = Math.floor(value);
        }
        this.curValue = (this.actualValue = value);
    }

    protected _curValue: number = 0;

    public get curValue() {
        return this._curValue;
    }

    public set curValue(value: number) {
        if (this.keepInteger) {
            value = Math.floor(value);
        }
        this._curValue = value;
        this.label.string = value.toString();
    }

    protected tweenRes: Function = null!;

    protected onLoad() {
        this.init();
    }

    /**
     * initialization
     */
    protected init() {
        if (!this.label) {
            this.label = this.getComponent(Label)!;
        }
        this.value = 0;
        //Usage
        this.to(2500, 50)
    }

    /**
     * Set the value
     * @param value Value
     */
    public set(value: number) {
        this.value = value;
    }

    /**
     * Set animation duration
     * @param duration Animation time
     */
    public setDuration(duration: number) {
        this.duration = duration;
    }

    /**
     * Rolling value
     * @param value Target value
     * @param duration Animation time
     * @param callback Complete the callback
     */
    public to(value: number, duration?: number, callback?: () => void): Promise<void> {
        return new Promise<void>(res => {
            // Stop the current animation
            if (this.tweenRes) {
                Tween.stopAllByTarget(this);
                this.tweenRes();
            }
            this.tweenRes = res;
            // Save the actual value
            this.actualValue = value;
            // Animation time
            if (duration == undefined) {
                duration = this.duration;
            }
            // GO
            tween<Counter>(this)
                .to(duration, { curValue: value })
                .call(() => {
                    this.tweenRes = null!;
                    callback && callback();
                    res();
                })
                .start();
        });
    }

    /**
     * Relatively rolling value
     * @param diff Difference
     * @param duration Animation time
     * @param callback Complete the callback
     */
    public by(diff: number, duration?: number, callback?: () => void): Promise<void> {
        const value = this.actualValue + diff;
        return this.to(value, duration, callback);
    }

}

