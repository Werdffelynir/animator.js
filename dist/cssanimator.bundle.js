/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Animator(element, config) {
    if (!(this instanceof Animator)) return new Animator(element, config || {});

    if (!(element instanceof Node)) throw new Error('Animator say: target is not NodeElement');

    var id = Math.random().toString(36).substring(2, 15);

    this.param = {
        element: element,
        classNameStyleElement: 'style-' + id,
        classNameElement: 'element-' + id,
        keyframesName: 'move-' + id,
        keyframes: { from: {}, to: {}, percents: {} },
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
            'play-state': 'running'
        }
    };

    this.duration = function (param) {
        this.parameter('duration', param);return this;
    };
    this.effect = function (param) {
        this.parameter('timing-function', param);return this;
    };
    this.delay = function (param) {
        this.parameter('delay', param);return this;
    };
    this.iteration = function (param) {
        this.parameter('iteration-count', param);return this;
    };
    this.direction = function (param) {
        this.parameter('direction', param);return this;
    };
    this.fill = function (param) {
        this.parameter('fill-mode', param);return this;
    };
    this.state = function (param) {
        this.parameter('play-state', param);return this;
    };

    this.parameter = function (key, param) {
        if (this.param.animation[key]) this.param.animation[key] = param;
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
        var _this = this;

        var _param = this.param,
            element = _param.element,
            animation = _param.animation,
            timerHandler = _param.timerHandler,
            afters = _param.afters;

        var sec = animation.duration.indexOf('s') ? parseInt(animation.duration) * 1000 : parseInt(animation.duration);

        var delay = animation.delay.indexOf('s') ? parseInt(animation.delay) * 1000 : parseInt(animation.delay);

        this._runAfterTimerHandlerClear();
        if (this.param.animation['iteration-count'].indexOf('infinite') === -1) this.param.timerHandler = setTimeout(function () {
            afters.forEach(function (callback) {
                callback.run();
            });
            // todo: test for removed style
            _this._cssRemove();
        }, sec + delay);
    };
    this._cssCreate = function () {
        var _param2 = this.param,
            keyframes = _param2.keyframes,
            keyframesName = _param2.keyframesName,
            classNameElement = _param2.classNameElement,
            animation = _param2.animation;

        var animationCSS = {};
        var style = '';

        style += cssPart('from', keyframes.from);
        style += cssPart('to', keyframes.to);
        Object.keys(keyframes.percents).forEach(function (key) {
            style += cssPart(key, keyframes.percents[key]);
        });
        style = '@keyframes ' + keyframesName + ' {\n' + style + '}\n';

        animation.name = keyframesName;
        Object.keys(animation).forEach(function (k) {
            animationCSS['animation-' + k] = animation[k];
        });
        style += cssPart('.' + classNameElement, animationCSS);

        this.param.stylesHead = style;
        return style;
    };
    this._cssInsert = function () {
        var _param3 = this.param,
            element = _param3.element,
            classNameElement = _param3.classNameElement,
            classNameStyleElement = _param3.classNameStyleElement,
            stylesHead = _param3.stylesHead;

        if (!query('.' + classNameElement) && !query('.' + classNameStyleElement)) {
            var style = document.createElement('style');
            element.classList.add(classNameElement);
            style.classList.add(classNameStyleElement);
            style.textContent = stylesHead;
            document.head.appendChild(style);
        }
    };
    this._cssRemove = function () {
        var _param4 = this.param,
            element = _param4.element,
            classNameElement = _param4.classNameElement,
            classNameStyleElement = _param4.classNameStyleElement;

        var style = query('.' + classNameStyleElement);
        if (style) {
            document.head.removeChild(style);
            element.classList.remove(classNameElement);
        }
    };
    this._cssElementRead = function () {
        var attr = this.param.element.getAttribute('style');
        if (attr) {
            var result = {};
            var attrArr = attr.split(';');
            attrArr.forEach(function (it) {
                it = it.trim();
                var itArr = it.trim().split(':');
                if (itArr && itArr.length === 2) {
                    result[itArr[0].trim()] = itArr[1].trim();
                }
            });
            this.param.stylesElementDefault = result;
        }
    };
    this._cssElementInsert = function () {
        var _param5 = this.param,
            element = _param5.element,
            stylesElement = _param5.stylesElement,
            stylesElementDefault = _param5.stylesElementDefault;

        var style = '';
        Object.keys(stylesElementDefault).forEach(function (key) {
            style += key + ': ' + stylesElementDefault[key] + ';';
        });
        Object.keys(stylesElement).forEach(function (key) {
            style += key + ': ' + stylesElement[key] + ';';
        });
        element.setAttribute('style', style);
    };
    this._cssElementRemove = function () {
        var _param6 = this.param,
            element = _param6.element,
            stylesElementDefault = _param6.stylesElementDefault;

        var style = '';
        Object.keys(stylesElementDefault).forEach(function (key) {
            style += key + ': ' + stylesElementDefault[key] + ';';
        });
        element.setAttribute('style', style);
    };
    this._elementComputedStyle = function (name) {
        return getComputedStyle(this.param.element)[name];
    };
    this._addStyle2Element = function (name, prop) {
        if (name && prop) this.param.stylesElement[name] = prop;
    };

    this._init = function () {
        this._cssElementRead();
    };

    /* Utils */
    var query = function query(selector) {
        return document.querySelector(selector);
    };
    var attr = function attr(element, _attr, value) {
        if (value !== undefined) return element.setAttribute(_attr, value);else return element.getAttribute(_attr);
    };
    var cssPart = function cssPart(name, params) {
        var style = '';
        Object.keys(params).forEach(function (key) {
            style += key + ': ' + params[key] + ';\n';
        });
        return name + ' {\n' + style + '}\n';
    };

    this._init();
}

Animator.CssValue = function (param, separator, end) {
    var result = '';
    separator = separator || Animator.CssValue.SEPARATOR;
    end = end || Animator.CssValue.VALUE_END;
    Object.keys(param).forEach(function (key) {
        result += key + separator + param[key] + end;
    });
    return result;
};
Animator.CssValue.SEPARATOR = '';
Animator.CssValue.VALUE_END = ' ';

window.Animator = Animator;

/***/ })

/******/ });