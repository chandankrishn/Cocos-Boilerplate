import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JellyTween')
export class JellyTween extends Component {
    @property({ tooltip: 'Frequency (number of bombs)' })
    public frequency: number = 4;

    @property({ tooltip: 'Recession index' })
    public decay: number = 2;

    @property({ tooltip: 'Lower compression' })
    public pressScale: number = 0.2;

    @property({ tooltip: 'The effect is time -long' })
    public totalTime: number = 1;

    @property({ tooltip: 'Play interval' })
    public interval: number = 1;

    @property({ tooltip: 'Autoplay' })
    public playOnLoad: boolean = false;

    /** Primitive shrinkage*/
    private originalScale: Vec3 = null!;

    private myTween: Tween<Node> = null!;

    protected start() {
        // Record scaling value
        this.originalScale = this.node.scale;
        // Play
        if (this.playOnLoad) this.play();
    }

    /**
     * Play
     * @param repeatTimes repeat times
     */
    public play(repeatTimes?: number) {
        // repeat times
        const times = (repeatTimes != undefined && repeatTimes > 0) ? repeatTimes : 10e8;
        // duration
        const pressTime = this.totalTime * 0.2;         // Duration
        const scaleBackTime = this.totalTime * 0.15;    // Shield to the original size of the original size
        const bouncingTime = (this.totalTime * 0.65) / 2;     // Elasticity
        // amplitude
        const amplitude = this.pressScale / scaleBackTime;
        // Play
        this.myTween = tween(this.node)
            .repeat(times,
                tween()
                    .to(pressTime, { scale: new Vec3(this.originalScale.x + this.pressScale, this.originalScale.y - this.pressScale, this.originalScale.z) }, { easing: 'sineOut' })
                    .parallel(
                        tween().to(bouncingTime, { scale: new Vec3(this.originalScale.x, this.node.scale.y, this.node.scale.y) }, {
                            progress: (start, end, current, t) => {
                                let difference = this.getDifference(amplitude, t);
                                return end - difference;
                            }
                        }),
                        tween().to(bouncingTime, { scale: new Vec3(this.originalScale.x, this.originalScale.y, this.node.scale.y) }, {
                            progress: (start, end, current, t) => {
                                let difference = this.getDifference(amplitude, t);
                                return end + difference;
                            }
                        })
                    )
                    .delay(this.interval)
            )
            .start()
    }

    /**
     * stop
     */
    public stop() {
        this.myTween && this.myTween.stop();
        this.node.setScale(this.originalScale);
    }

    /**
     *Get the target time elasticity amplitude
     * @param Amplitude
     * @param time Time
     */
    private getDifference(amplitude: number, time: number) {
        // Angle speed（ω=2nπ）
        const angularVelocity = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(time * angularVelocity) / Math.exp(this.decay * time) / angularVelocity);
    }
}

