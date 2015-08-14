var isMobile = /iphone|ipad|android|phone|mobile/.test(window.navigator.userAgent.toLocaleLowerCase());
//辅助函数 ------------------------
function isUndefined (value)
{
    return typeof value === 'undefined';
}

function isDefined (value)
{
    return typeof value !== 'undefined';
}

function isElement(value) {
    return !!value && (isNumber(value.nodeType) || value === window);
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

function isArrayLike (value)
{
    return Array.isArray(value) || (isObject(value) && isNumber(value.length) && value.length > - 1);
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

function getPageOffset ()
{
    // This works for all browsers except IE versions 8 and before
    if (window.pageXOffset != null)
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    // For browsers in Standards mode
    var doc = window.document;
    if (document.compatMode === "CSS1Compat")
    {
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
}

var $util = {

    trim: function (str)
    {
        if (!isString(str)) return str;
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    /**
     * 遍历
     * @param obj {object | Array}
     * @param func
     */
    each: function (obj, func)
    {
        var item;
        if (isArrayLike(obj))
        {
            var i = 0;
            var l = obj.length;
            for (i; i < l; i ++)
            {
                item = obj[i];
                if (isDefined(item)) func(item, i);
            }
        }
        else if (isObject(obj))
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
    },

    some: function (obj, func)
    {
        if (isArrayLike(obj))
        {
            var i = 0;
            var l = obj.length;
            for (i; i < l; i ++)
            {
                if (isDefined(obj[i]) && func(obj[i], i)) return true;
            }
        }
        else if (isObject(obj))
        {
            var key;
            for (key in obj)
            {
                if (obj.hasOwnProperty(key) && func(obj[key], key)) return true;
            }
        }
        return false;
    },

    all: function (obj, func)
    {
        var l, results;
        if (isArrayLike(obj))
        {
            var i = 0;
            l = obj.length;
            results = 0;
            for (i; i < l; i ++)
            {
                if (isDefined(obj[i]) && func(obj[i], i)) results ++;
            }
            return (results === l);
        }
        else if (isObject(obj))
        {
            var key;
            l = 0;
            results = 0;
            for (key in obj)
            {
                l ++;
                if (obj.hasOwnProperty(key) && func(obj[key], key)) results ++;
            }
            return (results === l);
        }
        return false;
    },

    clone: function (o, d)
    {
        if (o === null || o === undefined || typeof ( o ) !== 'object')
        {
            return o;
        }

        var deep = ! ! d;

        var cloned;

        var i;

        if (o.constructor === Array)
        {
            if (deep === false)
            {
                return o;
            }

            cloned = [];

            for (i in o)
            {
                cloned.push($util.clone(o[i], deep));
            }

            return cloned;
        }

        cloned = {};

        for (i in o)
        {
            cloned[i] = deep ? $util.clone(o[i], true) : o[i];
        }

        return cloned;
    },

    extend: function (base, input)
    {
        if (! ((isObject(base) && isObject(input)) || (isArrayLike(base) && isArrayLike(input))))
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
        if (! isArrayLike(array)) return false;
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
        if (isUndefined(reason) || !isArray(array)) return false;
        var index = - 1;
        if (isNumber(reason))
        {
            index = reason;
        }
        else
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
        if (isUndefined(reason)) return false;
        var index = $util.indexOf(array, reason);
        if (index > - 1)
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
     * @param start 开始位置
     * function (item, index) : 自定义逻辑，返回 true 时
     * object : 和数组中的元素做对比，key和value都匹配时
     */
    indexOf: function (array, reason, start)
    {
        var i = start || 0;
        var index = - 1;
        var item;
        while (i < array.length)
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
            else
            {
                if (item === reason)
                {
                    index = i;
                    break;
                }
            }
            i ++ ;
        }
        return index;
    },

    find: function (array, reason)
    {
        var index = this.indexOf(array, reason);
        if (index > -1) return array[index];
    },

    findAll: function (array, reason)
    {
        var index = -1;
        var results = [];
        do {
            index = this.indexOf(array, reason, index + 1);
            if (index > -1) results.push(array[index]);
        } while (index > -1);
        return results;
    }
};