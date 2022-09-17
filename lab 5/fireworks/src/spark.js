export default class Spark{
    constructor(x, y){ 
        this.x = x
        this.y = y
        this.init()
    }

    init(){
        // время создания искры
        this.timeFromCreation = performance.now();
    
        // задаём направление полёта искры в градусах, от 0 до 360
        var angle = Math.random() * 360;
        // радиус - это расстояние, которое пролетит искра
        var radius = Math.random();
        // отмеряем точки на окружности - максимальные координаты искры
        this.xMax = Math.cos(angle) * radius;
        this.yMax = Math.sin(angle) * radius;
    
        // dx и dy - приращение искры за вызов отрисовки, то есть её скорость,
        // у каждой искры своя скорость. multiplier подобран экспериментально
        var multiplier = 150 + Math.random() * 50;
        this.dx = this.xMax / multiplier;
        this.dy = this.yMax / multiplier;

    };
    
    move() {
        var speed = 0.3;
        this.x += this.dx * speed;
        this.y += this.dy * speed;
    }
}