import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Measurements
        this.houseMeasurements = {
            width: 5,
            depth: 6,
            height: 3,

            doorWidth: 2.2,
            doorHeight: 2.2,
        }

        this.roofHeight = 2

        this.roofMeasurements = {
            height: this.roofHeight,

            plateHeight: 0.2,
            plateDepth: 7,
            plateWidth: Math.sqrt((this.houseMeasurements.width / 2) ** 2 + this.roofHeight ** 2) + 0.5
        }

        this.sceneWidth = 40
        this.windowSize = 0.8

        // Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}