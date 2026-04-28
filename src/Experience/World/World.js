import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import PineTree from './PineTree.js'
import Fox from './Fox.js'
import Cabin from './Cabin/Cabin.js'

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
            this.pineTree = new PineTree()
            this.cabin = new Cabin()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update() {
        if (this.fox)
            this.fox.update()
    }
}