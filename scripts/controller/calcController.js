// Criando a classe que será instanciada no arquivo da calculadora

class CalcController {
    // O método(função dentro da classe) CONSTRUCTOR é invocado automaticamente quando a classe é instanciada.

    constructor() {
        //ATRIBUTOS PRIVADOS iniciam com o símbolo _ (underline)
        this._locale = 'pt-BR';
        this._currentDate;
        this._operation = [];
        
        this._lastOperator ='';
        this._lastNumber = '';
        this._lastEntry='';

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;


        /**
         *  RECUPERANDO OS ELEMENTOS DO HTML
         *      $ antes da variável indica-se que a mesma está sendo recuperada do HTML
        */

        this._$displayCalc = document.querySelector('#display');
        this._$date = document.querySelector('#data');
        this._$hour = document.querySelector('#hora');

        this.initialize();
        this.initKeyboard();
    }

    // METODO PRINCIPAL DA CALCULADORA
    initialize() {
        //geralmente uma função deve iniciar fora do setInterval
        this.setDisplayDateTime();

        let interval = setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
        }, 10000)

        this.initButtonsEvents();
        this.setLastNumberOnDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach( (btn) =>{
            btn.addEventListener('dblclick', e => {
                this.toggleAudio()
            })
        })
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio() {
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();
        
        document.execCommand("Copy");        

        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', (e)=>{
            let text = e.clipboardData.getData('Text');

            console.log(text);
            this.displayCalc = parseFloat(text);
        })
    }

    initKeyboard(){
        document.addEventListener('keyup', (e)=>{
            this.playAudio();
            // console.log(e.key);
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    this.setLastNumberOnDisplay();
                break;
                case 'Delete':
                case 'Backspace':
                    this.clearEntry();
                    this.setLastNumberOnDisplay();
                break;
                case '%':
                case '+':
                case '-':
                case '*':
                case '/':
                    this.addOperation(e.key);
                break;
                case 'Enter':
                case '=':
                    this.calc();
                break;
                case '.':
                case ',':
                    this.addDot();
                break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
            }

        })
    };

    addEventListenerAll(element, events, fn) {
        /** Esse método recupera o elemento a ser escutado,
         *  separa os eventos dentro de uma string e
         *  realiza determinada função, nesse caso um console.log
         */
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false)
        })
    };

    clearAll() {
        this._operation = [];
        this._lastEntry='';
        this._lastNumber='';
        this._lastOperator='';
        this._lastResult='';

        console.log(this._operation);
        this.setLastNumberOnDisplay();
    };
    
    clearEntry() {
        this._operation.pop();
        console.log(this._operation);
        this.setLastNumberOnDisplay();
    };
    
    getLastEntry() {
        return this._operation[this._operation.length - 1];
    };

    
    getResult(){
        try{
            return eval(this._operation.join(''));
        } catch(e){
            setTimeout( ()=> {this.setError()},1)
        }
    };
    
    
    calc(){
        let last = '';

        // console.log("this._lastOperator ", this._lastOperator);
        
        if(this._operation.length > 3) {
            this._lastOperator = this.getLastItem(true);
            this._lastNumber = this.getLastItem((false))
            this._lastEntry = this._operation.pop();
            
            console.log('a) _lastEntry: ', this._lastEntry, `_lastOperator: ${this._lastOperator}, _lastNumber ${this._lastNumber}`);

            console.log('b) ',this._operation);
            //calculator.isOperator(calculator.getLastEntry())


        } else if (this._operation.length == 2){
            console.log('d) ', this._operation, last)
            last = this._operation[0];
            this._lastOperator = this.getLastItem(true);
            this._operation.push(last);

        } else if (this._operation.length == 3) {
            this._lastOperator = this.getLastItem(true);
            this._lastEntry = this._operation[this._operation.length - 1];
            console.log('e) else if2: ', this._operation, `lastEntry: ${this._lastEntry}, lastOperator: ${this._lastOperator}`);

        } else {
            // this._lastEntry = this._operation.pop();
            this._lastNumber = this.getLastItem(false);

            console.log('f) else: ', this._operation, `lastNumber: ${this._lastNumber}`, `lastOperator: ${this._lastOperator}`, `lastEntry: ${this._lastEntry}`);

            if(this._lastEntry == '' || this._lastEntry == this._lastOperator){
                console.log('f.1')
                this._operation.push(this._lastOperator, this._lastNumber);
            }else{
                console.log('f.2')
                this._operation.push(this._lastOperator, this._lastEntry)
            };
        };
        
        if(this._lastEntry == '%'){
            //fazer a validação para multiplicação e divisão
            let resultPercent;
            if(this._operation.indexOf('*') > -1 || this._operation.indexOf('/') > -1){
                resultPercent = this._operation[this._operation.length - 1] / 100;
                console.log('C --- ', resultPercent)
            }else{
                resultPercent = this._operation[0] * this._operation[this._operation.length -1] / 100;
                console.log('D --- ', resultPercent)
            }
            console.log(this._operation)
            this._operation.pop();
            console.log(this._operation)
            this._operation.push(resultPercent);
            console.log(this._operation)
        } 
        
        let result = this.getResult();
        this._operation= [result]
        console.log('pós result: ',this._operation)
        
        this.setLastNumberOnDisplay();
        
    }
    
    pushOperation(value) {
        this._operation.push(value);
        
        if(this._operation.length > 3) {
            this.calc();
        }
    }
    
    isOperator(value) {
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;
    };

    getLastItem(isOperator = true){   
        let lastItem; 
        
        for(var i = this._operation.length - 1; i>=0; i--){
            if(this.isOperator(this._operation[i]) ==  isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        return lastItem;
    }
    
    setLastNumberOnDisplay(){
        let lastNumber = 0;
        for(var i = this._operation.length - 1; i>=0; i--){
            if( !this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber;
    }

    addOperation(value) {
        //VALOR ANTERIOR É DIFERENTE DE UM NÚMERO?
        if (isNaN(this.getLastEntry())) {
            // TRUE : não é numérico
            //É um operador?
            if (this.isOperator(value) && this.isOperator(this.getLastEntry())) {
                //trocar de operador
                this._operation[(this._operation.length - 1)] = value;
                console.log("troca de operador: ",this._operation)
            } else {
                //sendo a última entrada undefined a mesma não é um número. Então o novo valor apenas será adicionado no array.
                this.pushOperation(value);
                this.setLastNumberOnDisplay();
            };
        } else {
            //FALSE: o ultimo valor foi numérico
            if(!isNaN(value)){
                //valor atual é numérico
                let newValue = this.getLastEntry().toString() + value.toString();
                this._operation[this._operation.length - 1] = (newValue);

                this.setLastNumberOnDisplay();
            } else {
                //valor atual não é numérico
                this.pushOperation(value);
            }
        };
    }

    setError() {
        this.displayCalc = "error";
    }

    addDot(){
        let lastOperation = this.getLastEntry();
        console.log(lastOperation);

        if(lastOperation.toString().split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this._operation.push('0.');
            console.log(this._operation)
        } else {
            this._operation[this._operation.length - 1] = (lastOperation.toString() + '.')
        }
        this.setLastNumberOnDisplay();
    }

    execBtn(value) {
        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                this.setLastNumberOnDisplay()
            break;
            case 'ce':
                this.clearEntry();
            break;
            case 'porcento':
                this.addOperation('%');
            break;
            case 'soma':
                this.addOperation('+');      
                break;
            case 'subtracao':
                this.addOperation('-');      
            break;
            case 'multiplicacao':
                this.addOperation('*');
            break;
            case 'divisao':
                this.addOperation('/');
            break;
            case 'igual':
                this.calc();
            break;
            case 'ponto':
                this.addDot();
            break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g') // o simbolo '>' nesse caso referencia os filhos de #buttons e #parts

        buttons.forEach((btn, index) => {
            // console.log(btn);
            this.addEventListenerAll(btn, "click drag", (e) => {
                // console.log(e);
                // console.log(btn.className.baseVal.replace('btn-',''));
                let textBtn = btn.className.baseVal.replace('btn-', "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mousedown mouseup", (e) => {
                btn.style.cursor = "pointer";
            });
        });
    }

    setDisplayDateTime() {
        //tudo que se copia ou reutiliza pode virar um método.
        this.currentDate = new Date().toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.currentHour = new Date().toLocaleTimeString(this._locale)
    }

    //RECUPERANDO UM VALOR
    get displayCalc() {
        return this._$displayCalc.innerHTML
    }

    //ATRIBUINDO UM VALOR
    set displayCalc(value) {
        if (value.toString().length > 10){
            this.setError();
        } else {
            this._$displayCalc.innerHTML = value;
        }
    }

    get currentDate() {
        return this._$date.innerHTML;
    }

    set currentDate(valor) {
        this._$date.innerHTML = valor;
    }

    get currentHour() {
        return this._$hour.innerHTML;
    }

    set currentHour(valor) {
        this._$hour.innerHTML = valor;
    }
}