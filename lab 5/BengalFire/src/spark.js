export default class Spark{
    constructor(){ 
        // this.timeFromCreation
        // this.xMax
        // this.yMax
        // this.dx
        // this.dy
        // this.x
        // this.y
        this.init();
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
        var multiplier = 125 + Math.random() * 125;
        this.dx = this.xMax / multiplier;
        this.dy = this.yMax / multiplier;
    
        // Для того, чтобы не все искры начинали движение из начала координат,
        // делаем каждой искре свой отступ, но не более максимальных значений.
        this.x = (this.dx * 1000) % this.xMax;
        this.y = (this.dy * 1000) % this.yMax;
    };
    
    move(time) {
        // находим разницу между вызовами отрисовки, чтобы анимация работала
        // одинаково на компьютерах разной мощности
        var timeShift = time - this.timeFromCreation;
        this.timeFromCreation = time;
    
        // приращение зависит от времени между отрисовками
        var speed = timeShift;
        this.x += this.dx * speed;
        this.y += this.dy * speed;
    
        // если искра достигла конечной точки, запускаем её заново из начала координат
        if (Math.abs(this.x) > Math.abs(this.xMax) || Math.abs(this.y) > Math.abs(this.yMax)) {
            this.init();
            return;
        }
    }
}