
function Animator (element, config) {
    if (!(this instanceof Animator))
        return new Animator (element, config || {});

    if (!(element instanceof Node ))
        throw new Error('Animator say: target is not NodeElement');

    const id = Math.random().toString(36).substring(2, 15);

    this.param = {
        element: element,
        classNameStyleElement: 'style-' + id,
        classNameElement: 'element-' + id,
        keyframesName: 'move-' + id,
        keyframes: {from: {}, to: {}, percents: {}},
        stylesHead: '',
        stylesElement: {},
        stylesElementDefault: {},
        afters: [],
        timerHandler: null,
        animation: {
            'name': 'none',
            'duration': '1s',
            'timing-function': 'ease-in-out',
            'delay': '0s',
            'iteration-count': 1,
            'direction': 'normal',
            'fill-mode': 'none',
            'play-state': 'running',
        },
    };

    this.duration = function(param) { this.parameter ('duration', param); return this;};
    this.effect = function(param) { this.parameter ('timing-function', param); return this;};
    this.delay = function(param) { this.parameter ('delay', param); return this;};
    this.iteration = function(param) { this.parameter ('iteration-count', param); return this;};
    this.direction = function(param) { this.parameter ('direction', param); return this;};
    this.fill = function(param) { this.parameter ('fill-mode', param); return this;};
    this.state = function(param) { this.parameter ('play-state', param); return this;};

    this.parameter = function (key, param) {
        if (this.param.animation[key])
            this.param.animation[key] = param;
        return this;
    };

    this.from = function (params) {
        this.param.keyframes.from = params;
        return this;
    };

    this.to = function (params) {
        this.param.keyframes.to = params;
        return this;
    };

    this.step = function (percent, params) {
        this.param.keyframes.percents[percent] = params;
        return this;
    };

    this.after = function (move) {
        this.param.afters.push(move);
        return this;
    };

    this.run = function () {
        this._cssRemove();
        this._cssCreate();
        this._cssInsert();
        this._runAfter();
        return this;
    };

    this.stop = function () {
        this._cssRemove();
        this._cssElementRemove();
        return this;
    };

    this.pause = function () {
        if (this.isInit()) {
            if (this._elementComputedStyle('animation-play-state') === 'running') {
                this._addStyle2Element('animation-play-state', 'paused');
                this._runAfterTimerHandlerClear();
            } else {
                this._addStyle2Element('animation-play-state', 'running');
                this._runAfter();
            }
            this._cssElementInsert();
        }
        return this;
    };

    this.isInit = function () {
        return !!document.querySelector('.' + this.param.classNameStyleElement);
    };


    /* Internal */
    this._runAfterTimerHandlerClear = function () {
        clearTimeout(this.param.timerHandler);
    };
    this._runAfter = function () {
        const {element, animation, timerHandler, afters} = this.param;
        const sec = animation.duration.indexOf('s')
            ? parseInt(animation.duration) * 1000
            : parseInt(animation.duration);

        const delay = animation.delay.indexOf('s')
            ? parseInt(animation.delay) * 1000
            : parseInt(animation.delay);

        this._runAfterTimerHandlerClear();
        if (this.param.animation['iteration-count'].indexOf('infinite') === -1 )
            this.param.timerHandler = setTimeout( () => {
                afters.forEach(function (callback) {
                    callback.run();
                });
                // todo: test for removed style
                this._cssRemove();
            }, sec + delay);
    };
    this._cssCreate = function () {
        const {keyframes, keyframesName, classNameElement, animation} = this.param;
        const animationCSS = {};
        let style = ``;

        style += cssPart('from', keyframes.from);
        style += cssPart('to', keyframes.to);
        Object.keys(keyframes.percents).forEach(function (key) {
            style += cssPart(key, keyframes.percents[key]);
        });
        style = `@keyframes ${keyframesName} {\n${style}}\n`;

        animation.name = keyframesName;
        Object.keys(animation).forEach(function (k) {
            animationCSS['animation-' + k] = animation[k];
        });
        style += cssPart('.' + classNameElement, animationCSS);

        this.param.stylesHead = style;
        return style;
    };
    this._cssInsert = function () {
        const {element, classNameElement, classNameStyleElement, stylesHead} = this.param;
        if (!query('.' + classNameElement) && !query('.' + classNameStyleElement)) {
            const style = document.createElement('style');
            element.classList.add(classNameElement);
            style.classList.add(classNameStyleElement);
            style.textContent = stylesHead;
            document.head.appendChild(style);
        }
    };
    this._cssRemove = function () {
        const {element, classNameElement, classNameStyleElement} = this.param;
        const style = query('.' + classNameStyleElement);
        if (style) {
            document.head.removeChild(style);
            element.classList.remove(classNameElement);
        }
    };
    this._cssElementRead = function () {
        const attr = this.param.element.getAttribute('style');
        if (attr) {
            const result = {};
            const attrArr = attr.split(';');
            attrArr.forEach(function (it) {
                it = it.trim();
                let itArr = it.trim().split(':');
                if (itArr && itArr.length === 2) {
                    result[itArr[0].trim()] = itArr[1].trim();
                }
            });
            this.param.stylesElementDefault = result;
        }
    };
    this._cssElementInsert = function () {
        const {element, stylesElement, stylesElementDefault} = this.param;
        let style = '';
        Object.keys(stylesElementDefault).forEach(function (key) {
            style += key + ': ' + stylesElementDefault[key] + ';';
        });
        Object.keys(stylesElement).forEach(function (key) {
            style += key + ': ' + stylesElement[key] + ';';
        });
        element.setAttribute('style', style);
    };
    this._cssElementRemove = function () {
        const {element, stylesElementDefault} = this.param;
        let style = '';
        Object.keys(stylesElementDefault).forEach(function (key) {
            style += key + ': ' + stylesElementDefault[key] + ';';
        });
        element.setAttribute('style', style);
    };
    this._elementComputedStyle = function (name) {
        return getComputedStyle(this.param.element)[name];
    };
    this._addStyle2Element = function (name, prop) {
        if (name && prop)
            this.param.stylesElement[name] = prop;
    };

    this._init = function () {
        this._cssElementRead();
    };


    /* Utils */
    const query = function (selector) {
        return document.querySelector(selector);
    };
    const attr = function (element, attr, value) {
        if (value !== undefined)
            return element.setAttribute(attr, value);
        else
            return element.getAttribute(attr);
    };
    const cssPart = function (name, params) {
        let style = ``;
        Object.keys(params).forEach(function (key) {
            style += `${key}: ${params[key]};\n`;
        });
        return `${name} {\n${style}}\n`;
    };

    this._init();
}


Animator.CssValue = function(param, separator, end) {
    let result = '';
    separator = separator || Animator.CssValue.SEPARATOR;
    end = end || Animator.CssValue.VALUE_END;
    Object.keys(param).forEach((key) => {
        result += key + separator + param[key] + end
    });
    return result;
};
Animator.CssValue.SEPARATOR = '';
Animator.CssValue.VALUE_END = ' ';

window.Animator = Animator;