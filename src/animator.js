
function animator (element) {
    const id = Math.random().toString(36).substring(2, 15);
    const internal = {
        id: id,
        id_move: 'move-' + id,
        id_style: 'style-' + id,
        id_element: 'element-' + id,
        timer_handler: null,
        styles: '',
        after_callbacks: [],
        keyframes: {from: {}, to: {}, percents: {}},
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
        elementStyles: {},
    };

    // public
    const proto = {
        element: element,
    };

    proto.parameter = function (key, param) {
        if (internal.animation[key])
            internal.animation[key] = param;
        return proto;
    };
    proto.name = function(param) { proto.parameter ('name', param); return proto;};
    proto.duration = function(param) { proto.parameter ('duration', param); return proto;};
    proto.effect = function(param) { proto.parameter ('timing-function', param); return proto;};
    proto.delay = function(param) { proto.parameter ('delay', param); return proto;};
    proto.iteration = function(param) { proto.parameter ('iteration-count', param); return proto;};
    proto.direction = function(param) { proto.parameter ('direction', param); return proto;};
    proto.fill = function(param) { proto.parameter ('fill-mode', param); return proto;};
    proto.state = function(param) { proto.parameter ('play-state', param); return proto;};
    proto.from = function (params) {
        internal.keyframes.from = params;
        return proto;
    };
    proto.to = function (params) {
        internal.keyframes.to = params;
        return proto;
    };
    proto.step = function (percent, params) {
        internal.keyframes.percents[percent] = params;
        return proto;
    };
    proto.run = function () {
        const styleElement = document.createElement('style');
        proto.stop();

        createCSS();
        proto.element.id = internal.id_element;
        styleElement.id = internal.id_style;
        styleElement.textContent = internal.styles;
        document.head.appendChild(styleElement);

        // set timing
        const sec = internal.animation.duration.indexOf('s')
            ? parseInt(internal.animation.duration) * 1000
            : parseInt(internal.animation.duration);
        const delay = internal.animation.delay.indexOf('s')
            ? parseInt(internal.animation.delay) * 1000
            : parseInt(internal.animation.delay);

        clearTimeout(internal.timer_handler);
        internal.timer_handler = setTimeout(function () {
            // proto.stop();
            internal.after_callbacks.forEach(function (cb) {
                if (cb.run)
                    cb.run();
            });
        }, sec + delay);

        return proto;
    };

    proto.stop = function () {
        const styleElement = document.querySelector('#' + internal.id_style);
        if (styleElement)
            document.head.removeChild(styleElement);
        return proto;
    };

    proto.pause = function () {
        if ( getComputedStyle(proto.element)['animation-play-state'] === 'running') {
            clearTimeout(internal.timer_handler);
            proto.element.style['animation-play-state'] = 'paused';
        } else {
            proto.element.style['animation-play-state'] = 'running';
        }
        return proto;
    };

    proto.isPlay = function () {
        return !!document.querySelector('#' + internal.id_style) &&
            getComputedStyle(proto.element)['animation-play-state'] === 'running';
    };

    proto.after = function (move) {
        internal.after_callbacks.push(move);
        return proto;
    };

    const addStyle = function (styles) {
        Object.keys(styles).forEach(function (k) {
            internal.elementStyles[k] = styles[k];
        });
    };

    const getStyle = function (key) {
        return getComputedStyle(proto.element)[key];
    };

    const createStyle = function () {
        let style = '';
        Object.keys(internal.elementStyles).forEach(function (k) {
            style += k + ':' + internal.elementStyles[k] + ';'
        });
        proto.element.style = style;
    };

    const createCSS = function () {
        const partStyle = function(name, params){
            let style = `${name} {\n`;
            Object.keys(params).forEach(function (k) {
                style += `${k}: ${params[k]};\n`;
            });
            style += `}\n`;
            return style;
        };

        // @keyframes animation styles
        let style = `@keyframes ${internal.id_move} {\n`;
        style += partStyle('from', internal.keyframes.from);
        style += partStyle('to', internal.keyframes.to);
        Object.keys(internal.keyframes.percents).forEach(function (k) {
            style += partStyle(k, internal.keyframes.percents[k]);});
        style += `}\n`;

        // element styles
        const animationCSS = {};
        internal.animation.name = internal.id_move;
        Object.keys(internal.animation).forEach(function (k) {
            animationCSS['animation-' + k] = internal.animation[k];
        });
        style += partStyle('#' + internal.id_element, animationCSS);

        internal.styles = style;
    };
    return proto;
}
