;(function (root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    }
    else if (typeof exports === 'object')
    {
        module.exports = factory();
    }
    else
    {
        root.$toast = factory();
    }
}(this, function ()
{

    var isMobile = /iphone|ipad|android|phone/.test(window.navigator.userAgent.toLocaleLowerCase());
    //辅助函数 ------------------------
    function isUndefined (value)
    {
        return typeof value === 'undefined';
    }
    function isDefined (value)
    {
        return typeof value !== 'undefined';
    }
    function isObject (value)
    {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
    }
    function isString (value)
    {
        return typeof value === 'string';
    }
    function isNumber (value)
    {
        return typeof value === 'number';
    }
    function isDate (value)
    {
        return toString.call(value) === '[object Date]';
    }
    function isArray (value)
    {
        return Array.isArray(value);
    }
    function isFunction (value)
    {
        return typeof value === 'function';
    }
    function isRegExp (value)
    {
        return toString.call(value) === '[object RegExp]';
    }
    function isBoolean (value)
    {
        return typeof value === 'boolean';
    }
    //辅助函数 end --------------------------------------------


    //自定义工具类 ---------------------------------------------

    var $util = {
        /**
         * 遍历
         * @param obj {object | array}
         * @param func
         */
        each: function (obj, func)
        {
            var item;
            if (isObject(obj))
            {
                var key;
                for (key in obj)
                {
                    if (obj.hasOwnProperty(key))
                    {
                        item = obj[key];
                        func(item, key);
                    }
                }
            }
            else if (isArray(obj))
            {
                var i = 0;
                var l = obj.length;
                for (i; i < l; i ++)
                {
                    item = obj[i];
                    if (isDefined(item)) func(item, i);
                }
            }
        },

        some: function (obj, func)
        {
            if (isObject(obj))
            {
                var key;
                for (key in obj)
                {
                    if (obj.hasOwnProperty(key) && func(obj[key], key)) return true;
                }
            }
            else if (isArray(obj))
            {
                var i = 0;
                var l = obj.length;
                for (i; i < l; i ++)
                {
                    if (isDefined(obj[i]) && func(obj[i], i)) return true;
                }
            }
            return false;
        },

        clone: function (o, d)
        {
            if ( o === null || o === undefined || typeof ( o ) !== 'object' )
            {
                return o;
            }

            var deep = !!d;

            var cloned;

            var i;

            if ( o.constructor === Array )
            {
                if ( deep === false )
                {
                    return o;
                }

                cloned = [];

                for ( i in o )
                {
                    cloned.push( $util.clone( o[i], deep ) );
                }

                return cloned;
            }

            cloned = {};

            for ( i in o )
            {
                cloned[i] = deep ? $util.clone( o[i], true ) : o[i];
            }

            return cloned;
        },

        extend: function (base, input)
        {
            if (!((isObject(base) && isObject(input)) || (isArray(base) && isArray(input))))
            {
                return base;
            }
            var result = $util.clone(base, true);
            $util.each(input, function (item, key)
            {
                if (isUndefined(item)) return;
                result[key] = item;
            });
            return result;
        },

        bind: function (func, thisArg)
        {
            var args = Array.prototype.slice.call(arguments, 2);
            return function ()
            {
                var inputArgs = Array.prototype.slice.call(arguments, 0);
                $util.each(inputArgs, function (item, index)
                {
                    args[index] = item;
                });
                return func.apply(thisArg, args);
            }
        },

        /**
         * 判断 host 是否包含 obj
         * @param host 宿主对象
         * @param obj 需要判断的对象
         */
        contain: function (host, obj)
        {
            if (! (isObject(host) && isObject(obj)))
            {
                return false;
            }
            var invalid = $util.some(obj, function (value, key)
            {
                if (value !== host[key])
                {
                    return true;
                }
            });
            return ! invalid;
        },

        /**
         * 倒序遍历
         * @param array
         * @param func
         */
        reverseEach: function (array, func)
        {
            if (! isArray(array)) return false;
            var i = array.length;
            var item;
            while (i --)
            {
                item = array[i];
                if (isDefined(item)) func(item, i);
            }
        },

        /**
         * 删除数组中的元素
         * @param array
         * @param reason {number | function | object}
         * number : 该元素在数组中的 index
         * function (item, index) : 自定义删除逻辑，返回 true 时删除
         * object : 和数组中的元素做对比，key和value 都匹配时删除
         */
        remove: function (array, reason)
        {
            var index = - 1;
            if (isNumber(reason))
            {
                index = reason;
            }
            else if (isObject(reason) || isFunction(reason))
            {
                index = $util.indexOf(array, reason);
            }
            if (index > - 1) array.splice(index, 1);
        },

        /**
         * 删除数组中的元素，满足条件的全部删除
         * @param array
         * @param reason {function | object}
         * function (item, index) : 自定义删除逻辑，返回 true 时删除
         * object : 和数组中的元素做对比，key和value 都匹配时删除
         */
        removeAll: function (array, reason)
        {
            if (!(isObject(reason) || isFunction(reason))) return false;
            var index = $util.indexOf(array, reason);
            if (index > -1)
            {
                array.splice(index, 1);
                $util.removeAll(array, reason);
            }
            else
            {
                return true;
            }
        },

        /**
         * 查找在数组中位置
         * @param array
         * @param reason {function | object}
         * function (item, index) : 自定义逻辑，返回 true 时
         * object : 和数组中的元素做对比，key和value都匹配时
         */
        indexOf: function (array, reason)
        {
            var i = array.length;
            var index = - 1;
            var item;
            while (i --)
            {
                item = array[i];

                if (isObject(reason))
                {
                    if ($util.contain(item, reason))
                    {
                        index = i;
                        break;
                    }
                }
                else if (isFunction(reason))
                {
                    if (reason(item, i))
                    {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        }
    };

    var $dom = {

        getStyle: function (el, prop)
        {
            if (isFunction(getComputedStyle)) {
                return getComputedStyle(el, null).getPropertyValue(prop);
            } else {
                return el.currentStyle[prop];
            }
        },

        getPageOffset: function ()
        {
            // This works for all browsers except IE versions 8 and before
            if ( window.pageXOffset != null )
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                };
            // For browsers in Standards mode
            var doc = window.document;
            if ( document.compatMode === "CSS1Compat" ) {
                return {
                    x: doc.documentElement.scrollLeft,
                    y: doc.documentElement.scrollTop
                };
            }
            // For browsers in Quirks mode
            return {
                x: doc.body.scrollLeft,
                y: doc.body.scrollTop
            };
        },

        getOffset: function (el)
        {
            var box = el.getBoundingClientRect();
            if ($dom.getStyle(el, 'position') === 'fixed')
            {
                return {x: box.left, y: box.top};
            }
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var pageOffset = $dom.getPageOffset();
            var scrollTop  = pageOffset.y || el.scrollTop;
            var scrollLeft = pageOffset.x || el.scrollLeft;
            return {
                y: box.top  + scrollTop  - clientTop,
                x: box.left + scrollLeft - clientLeft
            };
        },

        remove: function (el)
        {
            if (el.parentNode) el.parentNode.removeChild(el);
        },

        transitionEnd: function (el, cb)
        {
            if (!el || !isFunction(cb)) return false;
            var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
            function fireCallBack(e) {
                cb(e);
                $util.each(events, function (event)
                {
                    el.removeEventListener(event, fireCallBack, false);
                });
            }
            $util.each(events, function (event)
            {
                el.addEventListener(event, fireCallBack, false);
            });
        }
    };

    //自定义工具类 end ----------------------------------------------------

    var toastDefaultIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"> <path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 6.984h1.969v6h-1.969v-6zM11.016 15h1.969v2.016h-1.969v-2.016z"></path> </svg>';

    var toastDefaultOptions = {
        duration: 5000,
        position: 'bottom',
        type: 'default',
        mobile: isMobile,
        icon: toastDefaultIcon
    };

    var toastMixes = [];

    var $body = document.getElementsByTagName('body')[0];

    function convertToastArguments (args)
    {
        var options = {};
        if (args.length === 3)
        {
            options = args[2];
            options.text = args[1];
        }
        else if (args.length === 2)
        {
            if (isObject(args[1])) options = args[1];
            else options.text = args[1];
        }
        options.title = args[0];
        return options;
    }

    function convertToastPosition (position)
    {
        switch (position)
        {
            case 'top':
            case 'top center':
            case 'center top':
                position = 'toast-y-top toast-x-center';
                break;
            case 'top left':
            case 'left top':
                position = 'toast-y-top toast-x-left';
                break;
            case 'top right':
            case 'right top':
                position = 'toast-y-top toast-x-right';
                break;
            case 'center':
            case 'center center':
                position = 'toast-y-center toast-x-center';
                break;
            case 'left':
            case 'center left':
            case 'left center':
                position = 'toast-y-center toast-x-left';
                break;
            case 'right':
            case 'center right':
            case 'right center':
                position = 'toast-y-center toast-x-right';
                break;
            case 'bottom':
            case 'bottom center':
            case 'center bottom':
                position = 'toast-y-bottom toast-x-center';
                break;
            case 'bottom left':
            case 'left bottom':
                position = 'toast-y-bottom toast-x-left';
                break;
            case 'bottom right':
            case 'right bottom':
                position = 'toast-y-bottom toast-x-right';
                break;
            default :
                position = 'toast-y-bottom toast-x-center';
        }
        return position;
    }

    function resizeToasts ($toast, position)
    {
        var toast_height = parseFloat($dom.getStyle($toast, 'height'));
        var $toasts;
        if (position.indexOf('toast-y-top') !== -1)
        {
            $toasts = $body.querySelectorAll('.toast-y-top');
            $util.each($toasts, function (dom, index)
            {
                if (index == ($toasts.length - 1)) return true;
                dom.style.top = $dom.getOffset(dom).y + toast_height + 'px';
            });
        }
        else if (position.indexOf('toast-y-center') !== -1)
        {
            $toasts = $body.querySelectorAll('.toast-y-center');
            $util.each($toasts, function (dom, index)
            {
                if (index == ($toasts.length - 1))
                {
                    dom.style.top = $dom.getOffset(dom).y - (toast_height / 2) + 'px';
                    return true;
                }
                dom.style.top = $dom.getOffset(dom).y - toast_height + 'px';
            });
        }
        else
        {
            $toasts = $body.querySelectorAll('.toast-y-bottom');
            $util.each($toasts, function (dom, index)
            {
                if (index == ($toasts.length - 1)) return true;
                dom.style.top = $dom.getOffset(dom).y - toast_height + 'px';
            });
        }
    }

    return {

        success: function (title, text, options)
        {
            var toastOptions = convertToastArguments(arguments);
            toastOptions.type = 'success';
            return this.show(toastOptions);
        },
        error: function (title, text, options)
        {
            var toastOptions = convertToastArguments(arguments);
            toastOptions.type = 'error';
            return this.show(toastOptions);
        },
        warn: function (title, text, options)
        {
            var toastOptions = convertToastArguments(arguments);
            toastOptions.type = 'warning';
            return this.show(toastOptions);
        },
        info: function (title, text, options)
        {
            var toastOptions = convertToastArguments(arguments);
            toastOptions.type = 'info';
            return this.show(toastOptions);
        },
        text: function (title, text, options)
        {
            var toastOptions = convertToastArguments(arguments);
            toastOptions.type = 'text';
            return this.show(toastOptions);
        },
        // toast 单独处理定位，去掉 toasts
        show: function (options)
        {
            options = $util.extend(toastDefaultOptions, options);
            var $toast = document.createElement('div');
            var toastClasses = ['toast'];
            //toast innerHTML
            var title = options.title ? '<div class="toast-title">' + options.title + '</div>' : '';
            var text = options.text ? '<div class="toast-text">' + options.text + '</div>' : '';
            var icon = options.icon;
            if (!icon)
            {
                toastClasses.push('toast-no-icon');
                icon = '';
            }
            else
            {
                icon = '<div class="toast-icon">' + icon + '</div>';
            }
            $toast.innerHTML = '<div class="toast-content">' + icon + title + text + '</div>';
            //toast class
            var type = 'toast-type-' + options.type;
            toastClasses.push(type);
            var position = convertToastPosition(options.position);
            toastClasses.push(position);
            if (isString(options.cls))
            {
                toastClasses.push(options.cls);
            }
            if (options.mobile || (options.mobile !== false && toastDefaultOptions.mobile)) toastClasses.push('toast-mobile');
            $toast.className = toastClasses.join(' ');
            //append to body
            $body.appendChild($toast);
            $toast.style.display = 'block';
            //resize others toasts
            resizeToasts($toast, position);
            //show transition
            $toast.className += ' toast-in';
            var mix = {
                el: $toast
            };
            mix.timeout = setTimeout($util.bind(this.hide, null, mix), options.duration);
            toastMixes.push(mix);
            return mix;
        },

        hide: function (mix)
        {
            clearTimeout(mix.timeout);
            mix.el.className += ' toast-out';
            $dom.transitionEnd(mix.el, function ()
            {
                $dom.remove(mix.el);
                $util.remove(toastMixes, mix);
                mix = null;
            });
        },

        config: function (options)
        {
            toastDefaultOptions = $util.extend(toastDefaultOptions, options);
        }
    };

}));
