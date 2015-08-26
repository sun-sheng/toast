var $ = (function ()
{
    var Dom = function (arr)
    {
        var _this = this, i, length = arr.length;
        // Create array-like object
        for (i = 0; i < length; i ++)
        {
            _this[i] = arr[i];
        }
        _this.length = arr.length;
        // Return collection with methods
        return this;
    };

    Dom.prototype = {
        addClass: function (arg)
        {
            if (!(isString(arg) || isArray(arg))) return this;
            if (isString(arg))
            {
                arg = $util.trim(arg).replace(/\s+/, ' ').split(' ');
            }
            this.each(function (el)
            {
                el.className += ' ' + arg.join(' ');
            });
            return this;
        },
        removeClass: function (arg)
        {
            if (!(isString(arg) || isArray(arg))) return this;
            if (isString(arg))
            {
                arg = $util.trim(arg).replace(/\s+/, ' ').split(' ');
            }
            this.each(function (el)
            {
                var className = ' ' + el.className + ' ';
                $util.each(arg, function (item)
                {
                    item = ' ' + item + ' ';
                    className = className.replace(item, ' ');
                });
                el.className = $util.trim(className);
            });
            return this;
        },
        toogleClass: function (arg)
        {
            if (!isString(arg)) return this;
            this.each(function (el)
            {
                if (el.className.indexOf(arg) === -1) return true;
                el.className += ' ' + arg;
            });
        },
        hasClass: function (arg)
        {
            if (!isString(arg)) return false;
            return this[0].className.indexOf(arg) > -1;
        },
        css: function (arg1, arg2)
        {
            if (arguments.length === 1)
            {
                if (isString(arg1))
                {
                    if (isFunction(getComputedStyle))
                    {
                        return getComputedStyle(this[0], null).getPropertyValue(arg1);
                    }
                    else
                    {
                        return this[0].currentStyle[arg1];
                    }
                }
                else if (isObject(arg1))
                {
                    this.each(function (el)
                    {
                        $util.each(arg1, function (value, key)
                        {
                            el.style[key] = value;
                        });
                    });
                }
            }
            else if (arguments.length === 2)
            {
                this.each(function (el)
                {
                    el.style[arg1] = arg2;
                });
                return arg2;
            }
        },
        width: function (width)
        {
            if (width) {
                this.css('width', width + 'px');
                return width;
            }
            return parseFloat(this.css('width'));
        },
        height: function (height)
        {
            if (height) {
                this.css('height', height + 'px');
                return height;
            }
            return parseFloat(this.css('height'));
        },
        offset: function ()
        {
            var el = this[0];
            if (!isElement(el)) return false;
            var box = el.getBoundingClientRect();
            if (this.css('position') === 'fixed')
            {
                return {x: box.left, y: box.top};
            }
            var body = document.body;
            var clientTop = el.clientTop || body.clientTop || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var pageOffset = getPageOffset();
            var scrollTop = pageOffset.y || el.scrollTop;
            var scrollLeft = pageOffset.x || el.scrollLeft;
            return {
                y: box.top + scrollTop - clientTop,
                x: box.left + scrollLeft - clientLeft
            };
        },
        remove: function ()
        {
            this.each(function (el)
            {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        },
        append: function (attr)
        {
            this.each(function (el)
            {
                if (isString(attr))
                {
                    var tmp = document.createElement('div');
                    tmp.innerHTML = attr;
                    while(tmp.firstChild) el.appendChild(tmp.firstChild);
                }
                else if (isElement(attr))
                {
                    el.append(attr);
                }
                else if (attr instanceof Dom)
                {
                    attr.each(function (item)
                    {
                        el.appendChild(item);
                    });
                }
            });
        },
        html: function (html)
        {
            if (html)
            {
                this.each(function (el)
                {
                    el.innerHTML = html;
                });
            }
            return this[0] && this[0].innerHTML;
        },
        hide: function ()
        {
            this.each(function (el)
            {
                el.style.display = 'none';
            });
        },
        show: function (display)
        {
            this.each(function (el)
            {
                el.style.display = display || 'block';
            });
        },
        each: function (callback)
        {
            var i = 0;
            var l = this.length;
            for (i; i < l; i++)
            {
                callback(this[i], i);
            }
        },
        find: function (selector)
        {
            var foundElements = [];
            for (var i = 0; i < this.length; i++) {
                var found = this[i].querySelectorAll(selector);
                for (var j = 0; j < found.length; j++) {
                    foundElements.push(found[j]);
                }
            }
            return new Dom(foundElements);
        },

        transitionEnd: function (callback)
        {
            if (! isFunction(callback)) return false;
            //var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
            var event = 'webkitTransitionEnd';
            function fireCallBack (e)
            {
                callback(e);
                this.removeEventListener(event, fireCallBack, false);
            }
            this.each(function (el)
            {
                el.addEventListener(event, fireCallBack, false);
            });
        }
    };

    return function (selector)
    {
        var arr = [], i = 0;
        if (selector instanceof Dom)
        {
            return selector;
        }
        // String
        if (typeof selector === 'string')
        {
            var els, tempParent, html = selector;
            if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0)
            {
                var toCreate = 'div';
                if (html.indexOf('<li') === 0) toCreate = 'ul';
                if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                if (html.indexOf('<tbody') === 0) toCreate = 'table';
                if (html.indexOf('<option') === 0) toCreate = 'select';
                tempParent = document.createElement(toCreate);
                tempParent.innerHTML = selector;
                for (i = 0; i < tempParent.childNodes.length; i ++)
                {
                    arr.push(tempParent.childNodes[i]);
                }
            }
            else
            {
                if (selector[0] === '#' && ! selector.match(/[ .<>:~]/))
                {
                    // Pure ID selector
                    els = [document.getElementById(selector.split('#')[1])];
                }
                else
                {
                    // Other selectors
                    els = (document).querySelectorAll(selector);
                }
                for (i = 0; i < els.length; i ++)
                {
                    if (els[i]) arr.push(els[i]);
                }
            }
        }
        // Node/element
        else if (isElement(selector))
        {
            arr.push(selector);
        }
        //Array of elements or instance of Dom
        else if (selector.length > 0 && selector[0].nodeType)
        {
            for (i = 0; i < selector.length; i ++)
            {
                arr.push(selector[i]);
            }
        }
        return new Dom(arr);
    };
})();
