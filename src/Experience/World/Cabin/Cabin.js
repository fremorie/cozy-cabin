import * as THREE from 'three'
import Experience from '../../Experience.js'
import Walls from './Walls.js'

export default class Cabin {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.setGroup()
        this.setMeshes()
    }

    setGroup() {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    setMeshes() {
        this.walls = new Walls()
        this.group.add(this.walls.mesh)
    }
}