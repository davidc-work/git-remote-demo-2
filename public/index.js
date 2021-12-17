let calculator;

$(document).ready(e => {
    calculator = new Calculator();
    $('.calculator-button').each(function(i) {
        this.onclick = function() {
            calculator.handleInput(this.children[0].innerHTML);
        }
    });
});

function Calculator() {
    this.display = 0;
    this.operation = undefined;
    this.mem = undefined;
    this.reset = false;
    this.addDecimal = false;
    this.overflow = false;

    return this;
}

Calculator.prototype.flash = function(t = 50) {
    $('.calculator-display').addClass('flashing');
    setTimeout(() => $('.calculator-display').removeClass('flashing'), t);
}

Calculator.prototype.i = function(input) {    
    if (!isNaN(parseInt(input, 10))) {
        if (this.reset) this.display = 0;
        var dec = this.addDecimal ? '.' : '';
        this.display = this.display.toString() == '0' ? input : parseFloat(this.display, 10) + dec + input.toString();
        this.addDecimal = false;
        this.reset = false;
        this.updateDisplay();
        return ;
    }

    if (['*', '/', '+', '-'].includes(input)) {
        if (this.operation) {
            if (parseFloat(this.display, 10) == this.mem) {
                if (this.operation == input) this.calc();
                else {
                    this.operation = input;
                    this.flash();
                }
                return ;
            }
            this.calc();
        } else {
            this.reset = true;
            this.flash();
        }
        this.mem = parseFloat(this.display, 10);
        this.operation = input;

        return ;
    }

    switch(input) {
        case '=':
            this.calc();
            return ;

        case '.':
            this.flash();
            if (this.display.toString().includes('.')) return;
            this.addDecimal = true;
            return;
        
        case 'mc':
            if (this.overflow) {
                this.overflow = false;
                $('.calculator-e').removeClass('visible');
                return ;
            }
            this.operation = this.mem = undefined;
            this.reset = false;
            this.display = 0;

            this.updateDisplay(100, true, 150);
            return ;
    }
}

Calculator.prototype.handleInput = function(input) {
    console.log(input);
    if (this.overflow && input != 'mc') return ;

    this.i(input);
}

Calculator.prototype.updateDisplay = function(d, flash = false, flashTime = undefined) {
    if (flash) this.flash(flashTime);
    if (d != undefined) {
        setTimeout(() => this.updateDisplay(), d);
        return ;
    }

    this.display = this.display.toString().substring(0, 14);
    $('.calculator-display > p').html(this.display);
}

Calculator.prototype.calc = function() {
    if (!(this.mem && this.operation)) return ;

    var evalString = this.mem + this.operation + this.display;
    var result = eval(evalString);
    this.display = result;
    this.operation = undefined;
    this.mem = undefined;
    this.addDecimal = false;
    this.reset = true;

    if (result.toString().includes('e')) {
        this.overflow = true;
        $('.calculator-e').addClass('visible');
    }

    this.updateDisplay(200, true, 250);
}