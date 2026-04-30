import EventEmitter from './EventEmitter'
import Experience from '../Experience'

export default class Time extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.debug = this.experience.debug

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick() {
        if (this.debug.active) {
            this.debug.stats.begin()
        }

        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })

        if (this.debug.active) {
            this.debug.stats.end()
        }
    }
}