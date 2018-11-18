'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var hooksContextStack = [];
function hooksContextNew(component) {
    return { component: component, useEffectNu: 0, useStateNu: 0, useContextNu: 0 };
}
function hooksContextPush(component) {
    hooksContextStack.push(hooksContextNew(component));
}
function hooksContextPop() {
    hooksContextStack.pop();
}
function hooksContextTop() {
    return hooksContextStack[hooksContextStack.length - 1];
}
function useState(defaultValue) {
    var context = hooksContextTop();
    var component = context.component;
    var useStateNu = context.useStateNu++;
    var setState = function (value, callback) {
        var _a;
        return component.setState((_a = {}, _a[useStateNu] = value, _a), callback);
    };
    var state = component.state;
    if (!state.hasOwnProperty(useStateNu)) {
        state[useStateNu] = defaultValue;
    }
    return [state[useStateNu], setState];
}
function isDependenciesChange(dependencies, lastDependencies) {
    if (!dependencies || !lastDependencies) {
        return true;
    }
    for (var i = 0, l = Math.max(dependencies.length, lastDependencies.length); i < l; i++) {
        if (dependencies[i] !== lastDependencies[i]) {
            return true;
        }
    }
    return false;
}
function useEffect(effectFunc, dependencies) {
    var context = hooksContextTop();
    var useEffectNu = context.useEffectNu++;
    var _a = context.component, hooksEffect = _a.hooksEffect, hooksEffectDelayed = _a.hooksEffectDelayed;
    function runEffect() {
        var cleanup = effectFunc();
        hooksEffect[useEffectNu] = [cleanup || null, dependencies || null];
    }
    if (hooksEffect.hasOwnProperty(useEffectNu)) {
        var _b = hooksEffect[useEffectNu], cleanup_1 = _b[0], lastDependencies = _b[1];
        if (isDependenciesChange(dependencies, lastDependencies)) {
            hooksEffectDelayed.push(function () {
                if (cleanup_1) {
                    cleanup_1();
                }
                runEffect();
            });
        }
    }
    else {
        hooksEffectDelayed.push(runEffect);
    }
}
function useContext(componentContext) {
    var context = hooksContextTop();
    var useContextNu = context.useContextNu++;
    var component = context.component;
    if (component.hooksContext.hasOwnProperty(useContextNu)) {
        var value = component.hooksContext[useContextNu][0];
        return value;
    }
    else {
        var value = componentContext._currentValue;
        component.hooksContext[useContextNu] = [value, componentContext];
        return value;
    }
}
function withHooks(rawRenderFunc) {
    var componentClass = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {};
            _this.hooksEffect = {};
            _this.hooksEffectDelayed = [];
            _this.hooksContext = {};
            // renderFunc 绑定 Hooks Context
            var renderFunc = function () {
                hooksContextPush(_this);
                var renderResult = rawRenderFunc(_this.props);
                hooksContextPop();
                return renderResult;
            };
            // 初始化执行
            renderFunc();
            // 看环境是否使用了 Context
            var contexts = Object
                .getOwnPropertyNames(_this.hooksContext)
                .map(function (useContextNu) { return [useContextNu, _this.hooksContext[parseInt(useContextNu)][1]]; });
            // 若使用 Context，则绑定所有 Context
            if (contexts.length > 0) {
                _this.renderFunc = contexts.reduceRight(function (lastRenderFunc, _a) {
                    var useContextNu = _a[0], context = _a[1];
                    return function () { return (React.createElement(context.Consumer, null, function (value) {
                        // 将 Context 更新的值存进 hooksContext 里面，以便 useContext 能更新所需要的值
                        _this.hooksContext[useContextNu] = [value, context];
                        return lastRenderFunc();
                    })); };
                }, renderFunc);
            }
            else {
                _this.renderFunc = renderFunc;
            }
            // 清理，避免 Effect 提前执行
            _this.hooksEffectDelayed = [];
            _this.hooksEffect = {};
            return _this;
        }
        // 执行 Effect
        class_1.prototype.runEffect = function () {
            for (var _i = 0, _a = this.hooksEffectDelayed; _i < _a.length; _i++) {
                var effectFunc = _a[_i];
                effectFunc();
            }
            this.hooksEffectDelayed = [];
        };
        // 清除 Effect
        class_1.prototype.cleanupEffect = function () {
            for (var _i = 0, _a = Object.getOwnPropertyNames(this.hooksEffect); _i < _a.length; _i++) {
                var useEffectNu = _a[_i];
                var cleanup = this.hooksEffect[parseInt(useEffectNu)][0];
                if (cleanup) {
                    cleanup();
                }
            }
            this.hooksEffect = {};
        };
        class_1.prototype.componentDidUpdate = function () {
            this.runEffect();
        };
        class_1.prototype.componentDidMount = function () {
            this.runEffect();
        };
        class_1.prototype.componentWillUnmount = function () {
            this.cleanupEffect();
        };
        class_1.prototype.render = function () {
            return this.renderFunc();
        };
        return class_1;
    }(React.Component));
    // 获取组件名
    Object.defineProperty(componentClass, 'name', { get: function () { return rawRenderFunc.name; } });
    return componentClass;
}

exports.useState = useState;
exports.useEffect = useEffect;
exports.useContext = useContext;
exports.withHooks = withHooks;
