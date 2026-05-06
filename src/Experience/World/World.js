import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import PineTree from './PineTree.js'
import Fox from './Fox.js'
import Snow from './Snow.js'
import Cabin from './Cabin/Cabin.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor()
            this.pineTree = new PineTree()
            this.cabin = new Cabin()
            this.fox = new Fox()
            this.snow = new Snow()
            this.environment = new Environment()
        })
    }

    update() {
        if (this.fox) {
            this.fox.update()
        }


        if (this.snow) {
            this.snow.update()
        }

        if (this.cabin) {
            this.cabin.update()
        }

        if (this.floor) {
            this.floor.update()
        }
    }
}