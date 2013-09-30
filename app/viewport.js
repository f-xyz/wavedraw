/**
 * Created by andr on 9/30/13.
 */

console.log('viewport');

define([], function() {

    function Viewport(canvasElement) {
        this.canvasElement = canvasElement;
        this.context = this.canvasElement.getContext('2d');

        this.context.canvas.width = this.canvasElement.clientWidth;
        this.context.canvas.height = this.canvasElement.clientHeight;
        this.running = false;
        this.startTime = Date.now();

        this.drawIndicator();

        var self = this;
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 32) {
                if (self.running) {
                    self.stop();
                } else {
                    self.start();
                }
            }
        });
    }

    Viewport.prototype.start = function() {
        this.running = true;
        this.frame();
    };

    Viewport.prototype.stop = function() {
        this.running = false;
        this.startTime = null;
    };

    Viewport.prototype.frame = function() {
        if (this.running) {
            requestAnimationFrame((function(context) {
                return function() {
                    context.frame.apply(context);
                };
            })(this), this.canvasElement);
        }

        this.drawIndicator();

        var time = this.getTime();
        //

        console.log('loop');
    };

    Viewport.prototype.getTime = function() {
        return Date.now() - this.startTime;
    };

    Viewport.prototype.drawIndicator = function() {
        var ctx = this.context;
        var size = {
            x: this.canvasElement.clientWidth,
            y: this.canvasElement.clientHeight
        };

        ctx.beginPath();
        ctx.arc(size.x-20, 20, 10, 0, 2*Math.PI, false);
        ctx.closePath();
        if (this.running) {
            ctx.fillStyle = 'rgba(50, 255, 50, 1)';
        } else {
            ctx.fillStyle = 'rgba(255, 50, 50, 1)';
        }
        ctx.strokeStyle = 'none';
        ctx.fill();
        ctx.stroke();


    };

    return Viewport;

});