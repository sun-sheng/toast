import $ from './dom'
import $utils from './utils'

let toastDefaultIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"> <path d="M12.984 12.984v-6h-1.969v6h1.969zM12.984 17.016v-2.016h-1.969v2.016h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path> </svg>'

let toastDefaultOptions = {
  duration: 5000,
  position: 'bottom',
  type: 'default',
  //避免重复提示
  distinct: false,
  mobile: $utils.isMobile,
  icon: toastDefaultIcon,
  showCloseBtn: !$utils.isMobile,
  //toast gap
  gap: 5
}

let toastMixes = []

let $body = $('body')

let bodyWidth = $body.width()

window.addEventListener('resize', function () {
  bodyWidth = $body.width()
}, false)

function convertToastArguments(args) {
  let options = {}
  if (args.length === 3) {
    options = args[ 2 ]
    options.text = args[ 1 ]
  }
  else if (args.length === 2) {
    if ($utils.isObject(args[ 1 ])) options = args[ 1 ]
    else options.text = args[ 1 ]
  }
  options.title = args[ 0 ]
  return options
}

function convertToastPosition(position) {
  switch (position) {
    case 'top':
    case 'top center':
    case 'center top':
      position = 'toast-y-top toast-x-center'
      break
    case 'top left':
    case 'left top':
      position = 'toast-y-top toast-x-left'
      break
    case 'top right':
    case 'right top':
      position = 'toast-y-top toast-x-right'
      break
    case 'center':
    case 'center center':
      position = 'toast-y-center toast-x-center'
      break
    case 'left':
    case 'center left':
    case 'left center':
      position = 'toast-y-center toast-x-left'
      break
    case 'right':
    case 'center right':
    case 'right center':
      position = 'toast-y-center toast-x-right'
      break
    case 'bottom':
    case 'bottom center':
    case 'center bottom':
      position = 'toast-y-bottom toast-x-center'
      break
    case 'bottom left':
    case 'left bottom':
      position = 'toast-y-bottom toast-x-left'
      break
    case 'bottom right':
    case 'right bottom':
      position = 'toast-y-bottom toast-x-right'
      break
    default :
      position = 'toast-y-bottom toast-x-center'
  }
  return position
}

function distinctToast($toast) {
  let mixes = $utils.findAll(toastMixes, function (item) {
    return item.$toast.html() === $toast.html()
  })
  $utils.each(mixes, function (mix) {
    Toast.hide(mix)
  })
}

function resizeToasts($toast, position) {
  let toast_height = $toast.height()
  let gap = toastDefaultOptions.gap
  let $toasts
  if (position.indexOf('toast-y-top') !== -1) {
    $toasts = $body.find('.toast-y-top')
    $toasts.each(function (dom, index) {
      if (index === ($toasts.length - 1)) return true
      let $dom = $(dom)
      let top = parseFloat($dom.css('top'))
      $dom.css('top', top + toast_height + gap + 'px')
    })
  }
  else if (position.indexOf('toast-y-center') !== -1) {
    $toasts = $body.find('.toast-y-center')
    $toasts.each(function (dom, index) {
      let $dom = $(dom)
      if (index === ($toasts.length - 1)) {
        $dom.css('margin-top', -(toast_height / 2) + 'px')
      }
      else {
        let marginTop = parseFloat($dom.css('margin-top'))
        $dom.css('margin-top', marginTop + toast_height + gap + 'px')
      }
    })
  }
  else {
    $toasts = $body.find('.toast-y-bottom')
    $toasts.each(function (dom, index) {
      if (index === ($toasts.length - 1)) return true
      let $dom = $(dom)
      let bottom = parseFloat($dom.css('bottom'))
      $dom.css('bottom', bottom + toast_height + gap + 'px')
    })
  }
}

let Toast = {

  success: function (title, text, options) {
    let toastOptions = convertToastArguments(arguments)
    toastOptions.type = 'success'
    return this.show(toastOptions)
  },
  error: function (title, text, options) {
    let toastOptions = convertToastArguments(arguments)
    toastOptions.type = 'error'
    return this.show(toastOptions)
  },
  warn: function (title, text, options) {
    let toastOptions = convertToastArguments(arguments)
    toastOptions.type = 'warning'
    return this.show(toastOptions)
  },
  info: function (title, text, options) {
    let toastOptions = convertToastArguments(arguments)
    toastOptions.type = 'info'
    return this.show(toastOptions)
  },
  text: function (title, text, options) {
    let toastOptions = convertToastArguments(arguments)
    toastOptions.type = 'default'
    return this.show(toastOptions)
  },
  // toast 单独处理定位，去掉 toasts
  show: function (options) {
    options = $utils.extend(toastDefaultOptions, options)
    let $toast = $(document.createElement('div'))
    let toastClasses = [ 'toast' ]
    //toast innerHTML
    let title = options.title ? '<div class="toast-title">' + options.title + '</div>' : ''
    let text = options.text ? '<div class="toast-text">' + options.text + '</div>' : ''
    let icon = options.icon
    if (icon) {
      toastClasses.push('toast-with-icon')
      icon = '<div class="toast-icon">' + icon + '</div>'
    }
    else {
      icon = ''
    }
    if (options.mobile || (options.mobile !== false && toastDefaultOptions.mobile)) toastClasses.push('toast-mobile')
    let closeBtn = ''
    if (!options.mobile && options.showCloseBtn) {
      toastClasses.push('toast-with-close')
      closeBtn = '<div class="toast-close">x</div>'
    }

    $toast.html(icon + title + text + closeBtn)
    //toast class
    let type = 'toast-type-' + options.type
    toastClasses.push(type)
    let position = convertToastPosition(options.position)
    toastClasses.push(position)
    if ($utils.isString(options.cls)) {
      toastClasses.push(options.cls)
    }
    $toast.addClass(toastClasses)
    //append to body
    $body.append($toast)
    $toast.show()
    let maxWidth = bodyWidth - 30
    let toastWidth = $toast.width()
    if (toastWidth > maxWidth) toastWidth = $toast.width(maxWidth)
    if ($toast.hasClass('toast-x-center')) {
      $toast.css('margin-left', (bodyWidth - toastWidth) / 2 + 'px')
    }
    //distinct others toasts
    if (options.distinct) distinctToast($toast)
    //resize others toasts
    resizeToasts($toast, position)
    let mix = {
      $toast: $toast
    }
    mix.timeout = setTimeout($utils.bind(this.hide, null, mix), options.duration)
    toastMixes.push(mix)

    $toast[ 0 ].onclick = function (e) {
      if (e.target.className.indexOf('toast-close') > -1) {
        Toast.hide(mix)
        return false
      }
      //on click
      if ($utils.isFunction(options.click)) options.click(e)
    }
    //show transition
    $toast.addClass('toast-in')
    return mix
  },

  hide: function (mix) {
    if (!mix || mix.$toast.hasClass('toast-out')) return true
    clearTimeout(mix.timeout)
    let $toast = mix.$toast
    $toast.addClass('toast-out')
    $toast.transitionEnd(function () {
      $toast.remove()
      $utils.remove(toastMixes, mix)
      mix = null
    })
  },

  clear: function () {
    toastMixes.each(this.hide)
  },

  config: function (options) {
    toastDefaultOptions = $utils.extend(toastDefaultOptions, options)
  }
}

export default Toast
