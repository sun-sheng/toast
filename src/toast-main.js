
//自定义工具类 end ----------------------------------------------------

var toastDefaultIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"> <path d="M12.984 12.984v-6h-1.969v6h1.969zM12.984 17.016v-2.016h-1.969v2.016h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path> </svg>';

var toastDefaultOptions = {
    duration: 5000,
    position: 'bottom',
    type: 'default',
    //避免重复提示
    distinct: false,
    mobile: isMobile,
    icon: toastDefaultIcon,
    showCloseBtn: !isMobile,
    //toast gap
    gap: 5
};

var toastMixes = [];

var $body = $('body');

var bodyWidth = $body.width();

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

function distinctToast ($toast)
{
    var mixes = $util.findAll(toastMixes, function (item)
    {
        return item.$toast.html() === $toast.html();
    });
    $util.each(mixes, function (mix)
    {
        Toast.hide(mix);
    });
}

function resizeToasts ($toast, position)
{
    var toast_height = $toast.height();
    var gap = toastDefaultOptions.gap;
    var $toasts;
    if (position.indexOf('toast-y-top') !== - 1)
    {
        $toasts = $body.find('.toast-y-top');
        $toasts.each(function (dom, index)
        {
            if (index == ($toasts.length - 1)) return true;
            var $dom = $(dom);
            var top = parseFloat($dom.css('top'));
            $dom.css('top', top + toast_height + gap + 'px');
        });
    }
    else if (position.indexOf('toast-y-center') !== - 1)
    {
        $toasts = $body.find('.toast-y-center');
        $toasts.each(function (dom, index)
        {
            var $dom = $(dom);
            if (index == ($toasts.length - 1))
            {
                $dom.css('margin-top', - (toast_height / 2) + 'px');
            }
            else
            {
                var marginTop = parseFloat($dom.css('margin-top'));
                $dom.css('margin-top', marginTop + toast_height + gap + 'px');
            }
        });
    }
    else
    {
        $toasts = $body.find('.toast-y-bottom');
        $toasts.each(function (dom, index)
        {
            if (index == ($toasts.length - 1)) return true;
            var $dom = $(dom);
            var bottom = parseFloat($dom.css('bottom'));
            $dom.css('bottom', bottom + toast_height + gap + 'px');
        });
    }
}

var Toast = {

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
        toastOptions.type = 'default';
        return this.show(toastOptions);
    },
    // toast 单独处理定位，去掉 toasts
    show: function (options)
    {
        options = $util.extend(toastDefaultOptions, options);
        var $toast = $(document.createElement('div'));
        var toastClasses = ['toast'];
        //toast innerHTML
        var title = options.title ? '<div class="toast-title">' + options.title + '</div>' : '';
        var text = options.text ? '<div class="toast-text">' + options.text + '</div>' : '';
        var icon = options.icon;
        if (icon)
        {
            toastClasses.push('toast-with-icon');
            icon = '<div class="toast-icon">' + icon + '</div>';
        }
        else
        {
            icon = '';
        }
        if (options.mobile || (options.mobile !== false && toastDefaultOptions.mobile)) toastClasses.push('toast-mobile');
        var closeBtn = '';
        if (!options.mobile && options.showCloseBtn)
        {
            toastClasses.push('toast-with-close');
            closeBtn = '<div class="toast-close">x</div>'
        }

        $toast.html(icon + title + text + closeBtn);
        //toast class
        var type = 'toast-type-' + options.type;
        toastClasses.push(type);
        var position = convertToastPosition(options.position);
        toastClasses.push(position);
        if (isString(options.cls))
        {
            toastClasses.push(options.cls);
        }
        $toast.addClass(toastClasses);
        //append to body
        $body.append($toast);
        $toast.show();
        var maxWidth = bodyWidth - 30;
        var toastWidth = $toast.width();
        if (toastWidth > maxWidth) toastWidth = $toast.width(maxWidth);
        if ($toast.hasClass('toast-x-center'))
        {
            $toast.css('margin-left', (bodyWidth - toastWidth) / 2 + 'px');
        }
        //distinct others toasts
        if (options.distinct) distinctToast($toast);
        //resize others toasts
        resizeToasts($toast, position);
        var mix = {
            $toast: $toast
        };
        mix.timeout = setTimeout($util.bind(this.hide, null, mix), options.duration);
        toastMixes.push(mix);

        $toast[0].onclick = function (e)
        {
            if (e.target.className.indexOf('toast-close') > -1) {
                Toast.hide(mix);
                return false;
            }
            //on click
            if (isFunction(options.click)) options.click(e);
        };
        //show transition
        $toast.addClass('toast-in');
        return mix;
    },

    hide: function (mix)
    {
        if (!mix || mix.$toast.hasClass('toast-out')) return true;
        clearTimeout(mix.timeout);
        var $toast = mix.$toast;
        $toast.addClass('toast-out');
        $toast.transitionEnd(function ()
        {
            $toast.remove();
            $util.remove(toastMixes, mix);
            mix = null;
        });
    },

    clear: function ()
    {
        toastMixes.each(this.hide);
    },

    config: function (options)
    {
        toastDefaultOptions = $util.extend(toastDefaultOptions, options);
    }
};
