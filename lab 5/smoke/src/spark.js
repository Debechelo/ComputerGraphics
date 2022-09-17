export default class Spark{
    constructor(x, y, z){ 
        this.x = x
        this.y = y
        this.z = z
        this.init()
    }

    init(){
        // время создания искры
        this.timeFromCreation = performance.now();
    
        var angle = Math.random() * 360;
        var radius = Math.random();

        this.xMax = Math.cos(angle) * radius;
        this.yMax = Math.sin(angle) * radius;
        this.zMax = Math.sin(angle) * radius;

        var multiplier = 150 + Math.random() * 50;
        this.dx = this.xMax / multiplier;
        this.dy = this.yMax / multiplier;
        this.dz = this.zMax / multiplier;

    };
    
    move() {
        var speed = 0.01;
        this.x += this.dx * speed;
        this.y += this.dy * speed;
        this.z += this.dz * speed;
    }
}