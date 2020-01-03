
function animator (element) {
    const id = Math.random().toString(36).substring(2, 15);
    const internal = {
        timerHandler: null,
    };
    const proto = {
        element: element,
        id: id,
        id_move: 'move-' + id,
        id_style: 'style-' + id,
        id_element: 'element-' + id,
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
        styles: '',
        afterCallbacks: [],
    };
    proto.parameter = function (key, param) {
        if (proto.animation[key]) {
            proto.animation[key] = param;
        }
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
        proto.keyframes.from = params;
        return proto;
    };
    proto.to = function (params) {
        proto.keyframes.to = params;
        return proto;
    };
    proto.step = function (percent, params) {
        proto.keyframes.percents[percent] = params;
        return proto;
    };
    proto.run = function () {
        const styleElement = document.createElement('style');
        createStyle();

        proto.element.id = proto.id_element;
        styleElement.id = proto.id_style;
        styleElement.textContent = proto.styles;
        document.head.appendChild(styleElement);

        // set timing
        const sec = proto.animation.duration.indexOf('s')
            ? parseInt(proto.animation.duration) * 1000
            : parseInt(proto.animation.duration);
        const delay = proto.animation.delay.indexOf('s')
            ? parseInt(proto.animation.delay) * 1000
            : parseInt(proto.animation.delay);

        clearTimeout(internal.timerHandler);
        internal.timerHandler = setTimeout(function () {
            proto.stop();
            proto.afterCallbacks.forEach(function (cb) {
                if (cb.run)
                    cb.run();
            });
        }, sec + delay);

        return proto;
    };

    proto.stop = function () {
        const styleElement = document.querySelector('#' + proto.id_style);
        if (styleElement)
            document.head.removeChild(styleElement);
        return proto;
    };

    proto.pause = function () {
        if ( getComputedStyle(proto.element)['animation-play-state'] === 'running') {
            proto.element.style['animation-play-state'] = 'running';
        } else {
            proto.element.style['animation-play-state'] = 'paused';
        }
        return proto;
    };

    proto.isPlay = function () {
        return !!document.querySelector('#' + proto.id_style);
    };

    proto.after = function (move) {
        proto.afterCallbacks.push(move);
        return proto;
    };

    const createStyle = function () {
        const partStyle = function(name, params){
            let style = `${name} {\n`;
            Object.keys(params).forEach(function (k) {
                style += `${k}: ${params[k]};\n`;
            });
            style += `}\n`;
            return style;
        };

        // animation styles
        let style = `@keyframes ${proto.id_move} {\n`;
        style += partStyle('from', proto.keyframes.from);
        style += partStyle('to', proto.keyframes.to);
        Object.keys(proto.keyframes.percents).forEach(function (k) {
            style += partStyle(k, proto.keyframes.percents[k]);});
        style += `}\n`;

        // element styles
        proto.animation.name = proto.id_move;
        const animation = {};
        Object.keys(proto.animation).forEach(function (k) {
            animation['animation-' + k] = proto.animation[k];
        });
        style += partStyle('#' + proto.id_element, animation);

        proto.styles = style;
    };
    return proto;
}
