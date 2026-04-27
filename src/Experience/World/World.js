import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            console.log('ready')
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
        })
    }

    update() {}
}