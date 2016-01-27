/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*
 *  jQuery OwlCarousel v1.3.3
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));
/*
 * ScrollToFixed
 * https://github.com/bigspotteddog/ScrollToFixed
 *
 * Copyright (c) 2011 Joseph Cava-Lynch
 * MIT license
 */
(function($) {
    $.isScrollToFixed = function(el) {
        return !!$(el).data('ScrollToFixed');
    };

    $.ScrollToFixed = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this' to reference this
        // class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element.
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object.
        base.$el.data('ScrollToFixed', base);

        // A flag so we know if the scroll has been reset.
        var isReset = false;

        // The element that was given to us to fix if scrolled above the top of
        // the page.
        var target = base.$el;

        var position;
        var originalPosition;
        var originalFloat;
        var originalOffsetTop;
        var originalZIndex;

        // The offset top of the element when resetScroll was called. This is
        // used to determine if we have scrolled past the top of the element.
        var offsetTop = 0;

        // The offset left of the element when resetScroll was called. This is
        // used to move the element left or right relative to the horizontal
        // scroll.
        var offsetLeft = 0;
        var originalOffsetLeft = -1;

        // This last offset used to move the element horizontally. This is used
        // to determine if we need to move the element because we would not want
        // to do that for no reason.
        var lastOffsetLeft = -1;

        // This is the element used to fill the void left by the target element
        // when it goes fixed; otherwise, everything below it moves up the page.
        var spacer = null;

        var spacerClass;

        var className;

        // Capture the original offsets for the target element. This needs to be
        // called whenever the page size changes or when the page is first
        // scrolled. For some reason, calling this before the page is first
        // scrolled causes the element to become fixed too late.
        function resetScroll() {
            // Set the element to it original positioning.
            target.trigger('preUnfixed.ScrollToFixed');
            setUnfixed();
            target.trigger('unfixed.ScrollToFixed');

            // Reset the last offset used to determine if the page has moved
            // horizontally.
            lastOffsetLeft = -1;

            // Capture the offset top of the target element.
            offsetTop = target.offset().top;

            // Capture the offset left of the target element.
            offsetLeft = target.offset().left;

            // If the offsets option is on, alter the left offset.
            if (base.options.offsets) {
                offsetLeft += (target.offset().left - target.position().left);
            }

            if (originalOffsetLeft == -1) {
                originalOffsetLeft = offsetLeft;
            }

            position = target.css('position');

            // Set that this has been called at least once.
            isReset = true;

            if (base.options.bottom != -1) {
                target.trigger('preFixed.ScrollToFixed');
                setFixed();
                target.trigger('fixed.ScrollToFixed');
            }
        }

        function getLimit() {
            var limit = base.options.limit;
            if (!limit) return 0;

            if (typeof(limit) === 'function') {
                return limit.apply(target);
            }
            return limit;
        }

        // Returns whether the target element is fixed or not.
        function isFixed() {
            return position === 'fixed';
        }

        // Returns whether the target element is absolute or not.
        function isAbsolute() {
            return position === 'absolute';
        }

        function isUnfixed() {
            return !(isFixed() || isAbsolute());
        }

        // Sets the target element to fixed. Also, sets the spacer to fill the
        // void left by the target element.
        function setFixed() {
            // Only fix the target element and the spacer if we need to.
            if (!isFixed()) {
                //get REAL dimensions (decimal fix)
                //Ref. http://stackoverflow.com/questions/3603065/how-to-make-jquery-to-not-round-value-returned-by-width
                var dimensions = target[0].getBoundingClientRect();

                // Set the spacer to fill the height and width of the target
                // element, then display it.
                spacer.css({
                    'display' : target.css('display'),
                    'width' : dimensions.width,
                    'height' : dimensions.height,
                    'float' : target.css('float')
                });

                // Set the target element to fixed and set its width so it does
                // not fill the rest of the page horizontally. Also, set its top
                // to the margin top specified in the options.

                cssOptions={
                    'z-index' : base.options.zIndex,
                    'position' : 'fixed',
                    'top' : base.options.bottom == -1?getMarginTop():'',
                    'bottom' : base.options.bottom == -1?'':base.options.bottom,
                    'margin-left' : '0px'
                }
                if (!base.options.dontSetWidth){ cssOptions['width']=target.css('width'); };

                target.css(cssOptions);

                target.addClass(base.options.baseClassName);

                if (base.options.className) {
                    target.addClass(base.options.className);
                }

                position = 'fixed';
            }
        }

        function setAbsolute() {

            var top = getLimit();
            var left = offsetLeft;

            if (base.options.removeOffsets) {
                left = '';
                top = top - offsetTop;
            }

            cssOptions={
              'position' : 'absolute',
              'top' : top,
              'left' : left,
              'margin-left' : '0px',
              'bottom' : ''
            }
            if (!base.options.dontSetWidth){ cssOptions['width']=target.css('width'); };

            target.css(cssOptions);

            position = 'absolute';
        }

        // Sets the target element back to unfixed. Also, hides the spacer.
        function setUnfixed() {
            // Only unfix the target element and the spacer if we need to.
            if (!isUnfixed()) {
                lastOffsetLeft = -1;

                // Hide the spacer now that the target element will fill the
                // space.
                spacer.css('display', 'none');

                // Remove the style attributes that were added to the target.
                // This will reverse the target back to the its original style.
                target.css({
                    'z-index' : originalZIndex,
                    'width' : '',
                    'position' : originalPosition,
                    'left' : '',
                    'top' : originalOffsetTop,
                    'margin-left' : ''
                });

                target.removeClass('scroll-to-fixed-fixed');

                if (base.options.className) {
                    target.removeClass(base.options.className);
                }

                position = null;
            }
        }

        // Moves the target element left or right relative to the horizontal
        // scroll position.
        function setLeft(x) {
            // Only if the scroll is not what it was last time we did this.
            if (x != lastOffsetLeft) {
                // Move the target element horizontally relative to its original
                // horizontal position.
                target.css('left', offsetLeft - x);

                // Hold the last horizontal position set.
                lastOffsetLeft = x;
            }
        }

        function getMarginTop() {
            var marginTop = base.options.marginTop;
            if (!marginTop) return 0;

            if (typeof(marginTop) === 'function') {
                return marginTop.apply(target);
            }
            return marginTop;
        }

        // Checks to see if we need to do something based on new scroll position
        // of the page.
        function checkScroll() {
            if (!$.isScrollToFixed(target) || target.is(':hidden')) return;
            var wasReset = isReset;
            var wasUnfixed = isUnfixed();

            // If resetScroll has not yet been called, call it. This only
            // happens once.
            if (!isReset) {
                resetScroll();
            } else if (isUnfixed()) {
                // if the offset has changed since the last scroll,
                // we need to get it again.

                // Capture the offset top of the target element.
                offsetTop = target.offset().top;

                // Capture the offset left of the target element.
                offsetLeft = target.offset().left;
            }

            // Grab the current horizontal scroll position.
            var x = $(window).scrollLeft();

            // Grab the current vertical scroll position.
            var y = $(window).scrollTop();

            // Get the limit, if there is one.
            var limit = getLimit();

            // If the vertical scroll position, plus the optional margin, would
            // put the target element at the specified limit, set the target
            // element to absolute.
            if (base.options.minWidth && $(window).width() < base.options.minWidth) {
                if (!isUnfixed() || !wasReset) {
                    postPosition();
                    target.trigger('preUnfixed.ScrollToFixed');
                    setUnfixed();
                    target.trigger('unfixed.ScrollToFixed');
                }
            } else if (base.options.maxWidth && $(window).width() > base.options.maxWidth) {
                if (!isUnfixed() || !wasReset) {
                    postPosition();
                    target.trigger('preUnfixed.ScrollToFixed');
                    setUnfixed();
                    target.trigger('unfixed.ScrollToFixed');
                }
            } else if (base.options.bottom == -1) {
                // If the vertical scroll position, plus the optional margin, would
                // put the target element at the specified limit, set the target
                // element to absolute.
                if (limit > 0 && y >= limit - getMarginTop()) {
                    if (!wasUnfixed && (!isAbsolute() || !wasReset)) {
                        postPosition();
                        target.trigger('preAbsolute.ScrollToFixed');
                        setAbsolute();
                        target.trigger('unfixed.ScrollToFixed');
                    }
                // If the vertical scroll position, plus the optional margin, would
                // put the target element above the top of the page, set the target
                // element to fixed.
                } else if (y >= offsetTop - getMarginTop()) {
                    if (!isFixed() || !wasReset) {
                        postPosition();
                        target.trigger('preFixed.ScrollToFixed');

                        // Set the target element to fixed.
                        setFixed();

                        // Reset the last offset left because we just went fixed.
                        lastOffsetLeft = -1;

                        target.trigger('fixed.ScrollToFixed');
                    }
                    // If the page has been scrolled horizontally as well, move the
                    // target element accordingly.
                    setLeft(x);
                } else {
                    // Set the target element to unfixed, placing it where it was
                    // before.
                    if (!isUnfixed() || !wasReset) {
                        postPosition();
                        target.trigger('preUnfixed.ScrollToFixed');
                        setUnfixed();
                        target.trigger('unfixed.ScrollToFixed');
                    }
                }
            } else {
                if (limit > 0) {
                    if (y + $(window).height() - target.outerHeight(true) >= limit - (getMarginTop() || -getBottom())) {
                        if (isFixed()) {
                            postPosition();
                            target.trigger('preUnfixed.ScrollToFixed');

                            if (originalPosition === 'absolute') {
                                setAbsolute();
                            } else {
                                setUnfixed();
                            }

                            target.trigger('unfixed.ScrollToFixed');
                        }
                    } else {
                        if (!isFixed()) {
                            postPosition();
                            target.trigger('preFixed.ScrollToFixed');
                            setFixed();
                        }
                        setLeft(x);
                        target.trigger('fixed.ScrollToFixed');
                    }
                } else {
                    setLeft(x);
                }
            }
        }

        function getBottom() {
            if (!base.options.bottom) return 0;
            return base.options.bottom;
        }

        function postPosition() {
            var position = target.css('position');

            if (position == 'absolute') {
                target.trigger('postAbsolute.ScrollToFixed');
            } else if (position == 'fixed') {
                target.trigger('postFixed.ScrollToFixed');
            } else {
                target.trigger('postUnfixed.ScrollToFixed');
            }
        }

        var windowResize = function(event) {
            // Check if the element is visible before updating it's position, which
            // improves behavior with responsive designs where this element is hidden.
            if(target.is(':visible')) {
                isReset = false;
                checkScroll();
            } else {
              // Ensure the spacer is hidden
              setUnfixed();
            }
        }

        var windowScroll = function(event) {
            (!!window.requestAnimationFrame) ? requestAnimationFrame(checkScroll) : checkScroll();
        }

        // From: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
        var isPositionFixedSupported = function() {
            var container = document.body;

            if (document.createElement && container && container.appendChild && container.removeChild) {
                var el = document.createElement('div');

                if (!el.getBoundingClientRect) return null;

                el.innerHTML = 'x';
                el.style.cssText = 'position:fixed;top:100px;';
                container.appendChild(el);

                var originalHeight = container.style.height,
                originalScrollTop = container.scrollTop;

                container.style.height = '3000px';
                container.scrollTop = 500;

                var elementTop = el.getBoundingClientRect().top;
                container.style.height = originalHeight;

                var isSupported = (elementTop === 100);
                container.removeChild(el);
                container.scrollTop = originalScrollTop;

                return isSupported;
            }

            return null;
        }

        var preventDefault = function(e) {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        // Initializes this plugin. Captures the options passed in, turns this
        // off for devices that do not support fixed position, adds the spacer,
        // and binds to the window scroll and resize events.
        base.init = function() {
            // Capture the options for this plugin.
            base.options = $.extend({}, $.ScrollToFixed.defaultOptions, options);

            originalZIndex = target.css('z-index')

            // Turn off this functionality for devices that do not support it.
            // if (!(base.options && base.options.dontCheckForPositionFixedSupport)) {
            //     var fixedSupported = isPositionFixedSupported();
            //     if (!fixedSupported) return;
            // }

            // Put the target element on top of everything that could be below
            // it. This reduces flicker when the target element is transitioning
            // to fixed.
            base.$el.css('z-index', base.options.zIndex);

            // Create a spacer element to fill the void left by the target
            // element when it goes fixed.
            spacer = $('<div />');

            position = target.css('position');
            originalPosition = target.css('position');
            originalFloat = target.css('float');
            originalOffsetTop = target.css('top');

            // Place the spacer right after the target element.
            if (isUnfixed()) base.$el.after(spacer);

            // Reset the target element offsets when the window is resized, then
            // check to see if we need to fix or unfix the target element.
            $(window).bind('resize.ScrollToFixed', windowResize);

            // When the window scrolls, check to see if we need to fix or unfix
            // the target element.
            $(window).bind('scroll.ScrollToFixed', windowScroll);

            // For touch devices, call checkScroll directlly rather than
            // rAF wrapped windowScroll to animate the element
            if ('ontouchmove' in window) {
              $(window).bind('touchmove.ScrollToFixed', checkScroll);
            }

            if (base.options.preFixed) {
                target.bind('preFixed.ScrollToFixed', base.options.preFixed);
            }
            if (base.options.postFixed) {
                target.bind('postFixed.ScrollToFixed', base.options.postFixed);
            }
            if (base.options.preUnfixed) {
                target.bind('preUnfixed.ScrollToFixed', base.options.preUnfixed);
            }
            if (base.options.postUnfixed) {
                target.bind('postUnfixed.ScrollToFixed', base.options.postUnfixed);
            }
            if (base.options.preAbsolute) {
                target.bind('preAbsolute.ScrollToFixed', base.options.preAbsolute);
            }
            if (base.options.postAbsolute) {
                target.bind('postAbsolute.ScrollToFixed', base.options.postAbsolute);
            }
            if (base.options.fixed) {
                target.bind('fixed.ScrollToFixed', base.options.fixed);
            }
            if (base.options.unfixed) {
                target.bind('unfixed.ScrollToFixed', base.options.unfixed);
            }

            if (base.options.spacerClass) {
                spacer.addClass(base.options.spacerClass);
            }

            target.bind('resize.ScrollToFixed', function() {
                spacer.height(target.height());
            });

            target.bind('scroll.ScrollToFixed', function() {
                target.trigger('preUnfixed.ScrollToFixed');
                setUnfixed();
                target.trigger('unfixed.ScrollToFixed');
                checkScroll();
            });

            target.bind('detach.ScrollToFixed', function(ev) {
                preventDefault(ev);

                target.trigger('preUnfixed.ScrollToFixed');
                setUnfixed();
                target.trigger('unfixed.ScrollToFixed');

                $(window).unbind('resize.ScrollToFixed', windowResize);
                $(window).unbind('scroll.ScrollToFixed', windowScroll);

                target.unbind('.ScrollToFixed');

                //remove spacer from dom
                spacer.remove();

                base.$el.removeData('ScrollToFixed');
            });

            // Reset everything.
            windowResize();
        };

        // Initialize the plugin.
        base.init();
    };

    // Sets the option defaults.
    $.ScrollToFixed.defaultOptions = {
        marginTop : 0,
        limit : 0,
        bottom : -1,
        zIndex : 1000,
        baseClassName: 'scroll-to-fixed-fixed'
    };

    // Returns enhanced elements that will fix to the top of the page when the
    // page is scrolled.
    $.fn.scrollToFixed = function(options) {
        return this.each(function() {
            (new $.ScrollToFixed(this, options));
        });
    };
})(jQuery);

/**
 * Placeholdem - Placeholder Caret Animation
 * v1.0.2 - MIT License
 * http://placeholdem.jackrugile.com - git://github.com/jackrugile/placeholdem.git
 * by Jack Rugile - @jackrugile
 */

function Placeholdem( elems ) {
    "use strict";

    (function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(id){clearTimeout(id);};}());

    var P = {};

    P.customElems = ['password'];
    P.defaultInputAttributeName = 'data-defaultinputtype';

    P.init = function() {
        P.elems = [];
        if( elems && elems.length ) {
            for( var i = 0 ; i < elems.length; i++ ) {
                if( P.hasPlaceholder( elems[ i ] ) ) {
                    P.elems.push( new P.PlaceholdemElem( elems[ i ] ) );
                }
            }
        } else if( elems ) {
            if( P.hasPlaceholder( elems ) ) {
                P.elems.push( new P.PlaceholdemElem( elems ) );
            }
        }
    };

    P.hasPlaceholder = function( elem ) {
        return ( typeof elem.hasAttribute === 'function' && elem.hasAttribute( 'placeholder' ) );
    };

    P.PlaceholdemElem = function( elem ) {
        var PE = this;

        PE.init = function() {
            PE.elem = elem;
            PE.form = elem.form;
            PE.placeholder = PE.elem.getAttribute( 'placeholder' );
            PE.elem.removeAttribute( 'placeholder' );
            PE.rAF = null;
            PE.animating = 0;
            PE.defaultInputType = PE.elem.getAttribute('type');

            
            PE.resetDefaultType();

            if( !PE.elem.value ) {
                PE.elem.value = PE.placeholder;
            }

            PE.on( PE.elem, 'focus', PE.onFocus );
            PE.on( PE.elem, 'blur', PE.onBlur);
            PE.on( PE.elem, 'keydown', PE.onKeydown);
            if( PE.form ) {
                PE.on( PE.form, 'reset', PE.onReset);
            }
        };

        PE.on = function( elem, eventType, handler ) {
            if( elem.addEventListener ) {
                elem.addEventListener( eventType, handler );
            } else {
                elem.attachEvent( 'on' + eventType, handler );
            }
        };

        PE.onFocus = function() {
            if( PE.animating || PE.elem.value === PE.placeholder ) {
                PE.animating = 1;
                window.cancelAnimationFrame( PE.rAF );
                PE.deletePlaceholder();
                PE.restoreDefaultType();
            }
        };

        PE.onBlur = function() {
            if( PE.animating || PE.elem.value === '' ) {
                PE.animating = 1;
                window.cancelAnimationFrame( PE.rAF );
                PE.restorePlaceholder();
                PE.resetDefaultType();
            }
        };

        PE.onKeydown = function() {
            if( PE.animating ) {
                PE.animating = 0;
                window.cancelAnimationFrame( PE.rAF );
                PE.elem.value = '';
            }
        };

        PE.onReset = function() {
            setTimeout( function() {
                PE.onBlur();
            });
        };

        PE.deletePlaceholder = function() {
            if( PE.elem.value.length > 0 ) {
                PE.elem.value = PE.elem.value.slice( 0, -1 );
                PE.rAF = window.requestAnimationFrame( PE.deletePlaceholder );
            } else {
                PE.animating = 0;
            }
        };

        PE.restorePlaceholder = function() {
            if( PE.elem.value.length < PE.placeholder.length ) {
                PE.elem.value += PE.placeholder[ PE.elem.value.length ];
                PE.rAF = window.requestAnimationFrame( PE.restorePlaceholder );
            } else {
                PE.animating = 0;
            }
        };

        PE.restoreDefaultType = function(){
            var defaultType = PE.elem.getAttribute(P.defaultInputAttributeName);
            if(defaultType && P.customElems.indexOf(defaultType) != -1 && defaultType != PE.elem.getAttribute('type')){
                PE.elem.setAttribute('type', defaultType);
            }
        };

        PE.resetDefaultType = function(){
            if(P.customElems.indexOf(PE.defaultInputType) != -1){
                PE.elem.setAttribute(P.defaultInputAttributeName, PE.defaultInputType);
                PE.elem.setAttribute('type', 'text');
            }
        };  

        PE.init();
    };

    P.init();

    return P;
}
/*!
 * Fresco - A Beautiful Responsive Lightbox - v2.1.3
 * (c) 2012-2016 Nick Stakenburg
 *
 * http://www.frescojs.com
 *
 * License: http://www.frescojs.com/license
 */
!function(d,c){"function"==typeof define&&define.amd?define(["jquery"],c):"object"==typeof module&&module.exports?module.exports=c(require("jquery")):d.Fresco=c(jQuery)}(this,function($){function baseToString(a){return"string"==typeof a?a:null==a?"":a+""}function Timers(){return this.initialize.apply(this,_slice.call(arguments))}function getURIData(a){var b={type:"image"};return $.each(Types,function(c,d){var e=d.data(a);e&&(b=e,b.type=c,b.url=a)}),b}function detectExtension(a){var b=(a||"").replace(/\?.*/g,"").match(/\.([^.]{3,4})$/);return b?b[1].toLowerCase():null}function View(){this.initialize.apply(this,_slice.call(arguments))}function Thumbnail(){this.initialize.apply(this,_slice.call(arguments))}var Fresco={};$.extend(Fresco,{version:"2.1.3"}),Fresco.Skins={fresco:{}};var Bounds={viewport:function(){var a={width:$(window).width()};if(Browser.MobileSafari||Browser.Android&&Browser.Gecko){var b=document.documentElement.clientWidth/window.innerWidth;a.height=window.innerHeight*b}else{a.height=$(window).height()}return a}},Browser=function(a){function b(b){var c=new RegExp(b+"([\\d.]+)").exec(a);return c?parseFloat(c[1]):!0}return{IE:!(!window.attachEvent||-1!==a.indexOf("Opera"))&&b("MSIE "),Opera:a.indexOf("Opera")>-1&&(!!window.opera&&opera.version&&parseFloat(opera.version())||7.55),WebKit:a.indexOf("AppleWebKit/")>-1&&b("AppleWebKit/"),Gecko:a.indexOf("Gecko")>-1&&-1===a.indexOf("KHTML")&&b("rv:"),MobileSafari:!!a.match(/Apple.*Mobile.*Safari/),Chrome:a.indexOf("Chrome")>-1&&b("Chrome/"),ChromeMobile:a.indexOf("CrMo")>-1&&b("CrMo/"),Android:a.indexOf("Android")>-1&&b("Android "),IEMobile:a.indexOf("IEMobile")>-1&&b("IEMobile/")}}(navigator.userAgent),_slice=Array.prototype.slice,_={isElement:function(a){return a&&1==a.nodeType},String:{capitalize:function(a){return a=baseToString(a),a&&a.charAt(0).toUpperCase()+a.slice(1)}}};!function(){function a(a){var b;if(a.originalEvent.wheelDelta?b=a.originalEvent.wheelDelta/120:a.originalEvent.detail&&(b=-a.originalEvent.detail/3),b){var c=$.Event("fresco:mousewheel");$(a.target).trigger(c,b),c.isPropagationStopped()&&a.stopPropagation(),c.isDefaultPrevented()&&a.preventDefault()}}$(document.documentElement).on("mousewheel DOMMouseScroll",a)}();var Fit={within:function(a,b){for(var c=$.extend({height:!0,width:!0},arguments[2]||{}),d=$.extend({},b),e=1,f=5,g={width:c.width,height:c.height};f>0&&(g.width&&d.width>a.width||g.height&&d.height>a.height);){var h=1,i=1;g.width&&d.width>a.width&&(h=a.width/d.width),g.height&&d.height>a.height&&(i=a.height/d.height);var e=Math.min(h,i);d={width:Math.round(b.width*e),height:Math.round(b.height*e)},f--}return d.width=Math.max(d.width,0),d.height=Math.max(d.height,0),d}};$.extend($.easing,{frescoEaseInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},frescoEaseInSine:function(a,b,c,d,e){return -d*Math.cos(b/e*(Math.PI/2))+d+c},frescoEaseOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c}});var Support=function(){function a(a){return c(a,"prefix")}function b(a,b){for(var c in a){if(void 0!==d.style[a[c]]){return"prefix"==b?a[c]:!0}}return !1}function c(a,c){var d=a.charAt(0).toUpperCase()+a.substr(1),f=(a+" "+e.join(d+" ")+d).split(" ");return b(f,c)}var d=document.createElement("div"),e="Webkit Moz O ms Khtml".split(" ");return{canvas:function(){var a=document.createElement("canvas");return !(!a.getContext||!a.getContext("2d"))}(),css:{animation:c("animation"),transform:c("transform"),prefixed:a},svg:!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,touch:function(){try{return !!("ontouchstart" in window||window.DocumentTouch&&document instanceof DocumentTouch)}catch(a){return !1}}()}}();Support.detectMobileTouch=function(){Support.mobileTouch=Support.touch&&(Browser.MobileSafari||Browser.Android||Browser.IEMobile||Browser.ChromeMobile||!/^(Win|Mac|Linux)/.test(navigator.platform))},Support.detectMobileTouch();var ImageReady=function(){return this.initialize.apply(this,Array.prototype.slice.call(arguments))};$.extend(ImageReady.prototype,{supports:{naturalWidth:function(){return"naturalWidth" in new Image}()},initialize:function(a,b,c){return this.img=$(a)[0],this.successCallback=b,this.errorCallback=c,this.isLoaded=!1,this.options=$.extend({method:"naturalWidth",pollFallbackAfter:1000},arguments[3]||{}),this.supports.naturalWidth&&"onload"!=this.options.method?this.img.complete&&"undefined"!=$.type(this.img.naturalWidth)?void setTimeout($.proxy(function(){this.img.naturalWidth>0?this.success():this.error()},this)):($(this.img).bind("error",$.proxy(function(){setTimeout($.proxy(function(){this.error()},this))},this)),this.intervals=[[1000,10],[2000,50],[4000,100],[20000,500]],this._ipos=0,this._time=0,this._delay=this.intervals[this._ipos][1],void this.poll()):void setTimeout($.proxy(this.fallback,this))},poll:function(){this._polling=setTimeout($.proxy(function(){if(this.img.naturalWidth>0){return void this.success()}if(this._time+=this._delay,this.options.pollFallbackAfter&&this._time>=this.options.pollFallbackAfter&&!this._usedPollFallback&&(this._usedPollFallback=!0,this.fallback()),this._time>this.intervals[this._ipos][0]){if(!this.intervals[this._ipos+1]){return void this.error()}this._ipos++,this._delay=this.intervals[this._ipos][1]}this.poll()},this),this._delay)},fallback:function(){var a=new Image;this._fallbackImg=a,a.onload=$.proxy(function(){a.onload=function(){},this.supports.naturalWidth||(this.img.naturalWidth=a.width,this.img.naturalHeight=a.height),this.success()},this),a.onerror=$.proxy(this.error,this),a.src=this.img.src},abort:function(){this._fallbackImg&&(this._fallbackImg.onload=function(){}),this._polling&&(clearTimeout(this._polling),this._polling=null)},success:function(){this._calledSuccess||(this._calledSuccess=!0,this.isLoaded=!0,this.successCallback(this))},error:function(){this._calledError||(this._calledError=!0,this.abort(),this.errorCallback&&this.errorCallback(this))}});var Color=function(){function a(a){var b=a;return b.red=b[0],b.green=b[1],b.blue=b[2],b}function b(a){return parseInt(a,16)}function c(c){var d=new Array(3);if(0==c.indexOf("#")&&(c=c.substring(1)),c=c.toLowerCase(),""!=c.replace(j,"")){return null}3==c.length?(d[0]=c.charAt(0)+c.charAt(0),d[1]=c.charAt(1)+c.charAt(1),d[2]=c.charAt(2)+c.charAt(2)):(d[0]=c.substring(0,2),d[1]=c.substring(2,4),d[2]=c.substring(4));for(var e=0;e<d.length;e++){d[e]=b(d[e])}return a(d)}function d(a,b){var d=c(a);return d[3]=b,d.opacity=b,d}function e(a,b){return"undefined"==$.type(b)&&(b=1),"rgba("+d(a,b).join()+")"}function f(a){return"#"+(g(a)[2]>50?"000":"fff")}function g(a){return h(c(a))}function h(b){var c,d,e,b=a(b),f=b.red,g=b.green,h=b.blue,i=f>g?f:g;h>i&&(i=h);var j=g>f?f:g;if(j>h&&(j=h),e=i/255,d=0!=i?(i-j)/i:0,0==d){c=0}else{var k=(i-f)/(i-j),l=(i-g)/(i-j),m=(i-h)/(i-j);c=f==i?m-l:g==i?2+k-m:4+l-k,c/=6,0>c&&(c+=1)}c=Math.round(360*c),d=Math.round(100*d),e=Math.round(100*e);var n=[];return n[0]=c,n[1]=d,n[2]=e,n.hue=c,n.saturation=d,n.brightness=e,n}var i="0123456789abcdef",j=new RegExp("["+i+"]","g");return{hex2rgb:c,hex2fill:e,getSaturatedBW:f}}(),Canvas=function(){function a(a){return a*Math.PI/180}return{init:function(a){Support.canvas||(a.getContext=function(){return a})},drawRoundedRectangle:function(b){var c=$.extend(!0,{mergedCorner:!1,expand:!1,top:0,left:0,width:0,height:0,radius:0},arguments[1]||{}),d=c,e=d.left,f=d.top,g=d.width,h=d.height,i=d.radius;d.expand;if(c.expand){var j=2*i;e-=i,f-=i,g+=j,h+=j}return i?(b.beginPath(),b.moveTo(e+i,f),b.arc(e+g-i,f+i,i,a(-90),a(0),!1),b.arc(e+g-i,f+h-i,i,a(0),a(90),!1),b.arc(e+i,f+h-i,i,a(90),a(180),!1),b.arc(e+i,f+i,i,a(-180),a(-90),!1),b.closePath(),void b.fill()):void b.fillRect(f,e,g,h)},createFillStyle:function(a,b){var c;if("string"==$.type(b)){c=Color.hex2fill(b)}else{if("string"==$.type(b.color)){c=Color.hex2fill(b.color,"number"==$.type(b.opacity)?b.opacity.toFixed(5):1)}else{if($.isArray(b.color)){var d=$.extend({x1:0,y1:0,x2:0,y2:0},arguments[2]||{});c=Canvas.Gradient.addColorStops(a.createLinearGradient(d.x1,d.y1,d.x2,d.y2),b.color,b.opacity)}}}return c},dPA:function(a,b){var c=$.extend({x:0,y:0,dimensions:!1,color:"#000",background:{color:"#fff",opacity:0.7,radius:2}},arguments[2]||{}),d=c.background;if(d&&d.color){var e=c.dimensions;if(Support.canvas){a.fillStyle=Color.hex2fill(d.color,d.opacity),Canvas.drawRoundedRectangle(a,{width:e.width,height:e.height,top:c.y,left:c.x,radius:d.radius||0});for(var f=0,g=b.length;g>f;f++){for(var h=0,i=b[f].length;i>h;h++){var j=parseInt(b[f].charAt(h))*(1/9)||0;a.fillStyle=Color.hex2fill(c.color,j-0.05),j&&a.fillRect(c.x+h,c.y+f,1,1)}}}else{$(a).html(""),$(a).append($("<div>").css({background:d.color,opacity:d.opacity,width:e.width,height:e.height,top:c.y,left:c.x}));for(var f=0,g=b.length;g>f;f++){for(var h=0,i=b[f].length;i>h;h++){var j=parseInt(b[f].charAt(h))*(1/9)||0;j&&$(a).append($("<div>").css({position:"absolute",background:c.color,width:1,height:1,left:c.x+h,top:c.y+f}))}}}}}}}();$.extend(Timers.prototype,{initialize:function(){this._timers={}},set:function(a,b,c){this._timers[a]=setTimeout(b,c)},get:function(a){return this._timers[a]},clear:function(a){a?this._timers[a]&&(clearTimeout(this._timers[a]),delete this._timers[a]):this.clearAll()},clearAll:function(){$.each(this._timers,function(a,b){clearTimeout(b)}),this._timers={}}});var Type={isVideo:function(a){return/^(youtube|vimeo)$/.test(a)}},Types={image:{extensions:"bmp gif jpeg jpg png webp",detect:function(a){return $.inArray(detectExtension(a),this.extensions.split(" "))>-1},data:function(a){return this.detect()?{extension:detectExtension(a)}:!1}},vimeo:{detect:function(a){var b=/(vimeo\.com)\/([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a);return b&&b[2]?b[2]:!1},data:function(a){var b=this.detect(a);return b?{id:b}:!1}},youtube:{detect:function(a){var b=/(youtube\.com|youtu\.be)\/watch\?(?=.*vi?=([a-zA-Z0-9-_]+))(?:\S+)?$/.exec(a);return b&&b[2]?b[2]:(b=/(youtube\.com|youtu\.be)\/(vi?\/|u\/|embed\/)?([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a),b&&b[3]?b[3]:!1)},data:function(a){var b=this.detect(a);return b?{id:b}:!1}}},VimeoThumbnail=function(){var a=function(){return this.initialize.apply(this,_slice.call(arguments))};$.extend(a.prototype,{initialize:function(a,b,c){this.url=a,this.successCallback=b,this.errorCallback=c,this.load()},load:function(){var a=b.get(this.url);if(a){return this.successCallback(a.data.url)}var c="http"+(window.location&&"https:"==window.location.protocol?"s":"")+":",d=getURIData(this.url).id;this._xhr=$.getJSON(c+"//vimeo.com/api/oembed.json?url="+c+"//vimeo.com/"+d+"&callback=?",$.proxy(function(a){if(a&&a.thumbnail_url){var a={url:a.thumbnail_url};b.set(this.url,a),this.successCallback(a.url)}else{this.errorCallback()}},this))},abort:function(){this._xhr&&(this._xhr.abort(),this._xhr=null)}});var b={cache:[],get:function(a){for(var b=null,c=0;c<this.cache.length;c++){this.cache[c]&&this.cache[c].url==a&&(b=this.cache[c])}return b},set:function(a,b){this.remove(a),this.cache.push({url:a,data:b})},remove:function(a){for(var b=0;b<this.cache.length;b++){this.cache[b]&&this.cache[b].url==a&&delete this.cache[b]}}};return a}(),VimeoReady=function(){var a=function(){return this.initialize.apply(this,_slice.call(arguments))};$.extend(a.prototype,{initialize:function(a,b){this.url=a,this.callback=b,this.load()},load:function(){var a=b.get(this.url);if(a){return this.callback(a.data)}var c="http"+(window.location&&"https:"==window.location.protocol?"s":"")+":",d=getURIData(this.url).id;this._xhr=$.getJSON(c+"//vimeo.com/api/oembed.json?url="+c+"//vimeo.com/"+d+"&callback=?",$.proxy(function(a){var c={dimensions:{width:a.width,height:a.height}};b.set(this.url,c),this.callback&&this.callback(c)},this))},abort:function(){this._xhr&&(this._xhr.abort(),this._xhr=null)}});var b={cache:[],get:function(a){for(var b=null,c=0;c<this.cache.length;c++){this.cache[c]&&this.cache[c].url==a&&(b=this.cache[c])}return b},set:function(a,b){this.remove(a),this.cache.push({url:a,data:b})},remove:function(a){for(var b=0;b<this.cache.length;b++){this.cache[b]&&this.cache[b].url==a&&delete this.cache[b]}}};return a}(),Options={defaults:{effects:{content:{show:0,hide:0},spinner:{show:150,hide:150},window:{show:440,hide:300},thumbnail:{show:300,delay:150},thumbnails:{slide:0}},keyboard:{left:!0,right:!0,esc:!0},loadedMethod:"naturalWidth",loop:!1,onClick:"previous-next",overflow:!1,overlay:{close:!0},preload:[1,2],position:!0,skin:"fresco",spinner:!0,spinnerDelay:300,sync:!0,thumbnails:"horizontal",ui:"outside",uiDelay:3000,vimeo:{autoplay:1,api:1,title:1,byline:1,portrait:0,loop:0},youtube:{autoplay:1,controls:1,enablejsapi:1,hd:1,iv_load_policy:3,loop:0,modestbranding:1,rel:0,vq:"hd1080"},initialTypeOptions:{image:{},vimeo:{width:1280},youtube:{width:1280,height:720}}},create:function(a,b,c){a=a||{},c=c||{},a.skin=a.skin||this.defaults.skin;var d=a.skin?$.extend({},Fresco.Skins[a.skin]||Fresco.Skins[this.defaults.skin]):{},e=$.extend(!0,{},this.defaults,d);e.initialTypeOptions&&(b&&e.initialTypeOptions[b]&&(e=$.extend(!0,{},e.initialTypeOptions[b],e)),delete e.initialTypeOptions);var f=$.extend(!0,{},e,a);if(Support.mobileTouch&&"inside"==f.ui&&(f.ui="outside"),$.extend(f,{overflow:!1,thumbnails:!1}),"inside"==f.ui&&(f.ui="outside"),(!f.effects||Browser.IE&&Browser.IE<9)&&(f.effects={},$.each(this.defaults.effects,function(a,b){$.each(f.effects[a]=$.extend({},b),function(b){f.effects[a][b]=0})}),f.spinner=!1),f.keyboard&&("boolean"==$.type(f.keyboard)&&(f.keyboard={},$.each(this.defaults.keyboard,function(a,b){f.keyboard[a]=!0})),("vimeo"==b||"youtube"==b)&&$.extend(f.keyboard,{left:!1,right:!1})),!f.overflow||Support.mobileTouch?f.overflow={x:!1,y:!1}:"boolean"==$.type(f.overflow)&&(f.overflow={x:!1,y:!0}),("vimeo"==b||"youtube"==b)&&(f.overlap=!1),(Browser.IE&&Browser.IE<9||Support.mobileTouch)&&(f.thumbnail=!1,f.thumbnails=!1),"youtube"!=b&&(f.width&&!f.maxWidth&&(f.maxWidth=f.width),f.height&&!f.maxHeight&&(f.maxHeight=f.height)),!f.thumbnail&&"boolean"!=$.type(f.thumbnail)){var g=!1;switch(b){case"image":case"vimeo":g=!0}f.thumbnail=g}return f}},Overlay={initialize:function(){this.build(),this.visible=!1},build:function(){this.element=$("<div>").addClass("fr-overlay").hide().append($("<div>").addClass("fr-overlay-background")),this.element.on("click",$.proxy(function(){var a=Pages.page;a&&a.view&&a.view.options.overlay&&!a.view.options.overlay.close||Window.hide()},this)),Support.mobileTouch&&this.element.addClass("fr-mobile-touch"),this.element.on("fresco:mousewheel",function(a){a.preventDefault()})},setSkin:function(a){this.skin&&this.element.removeClass("fr-overlay-skin-"+this.skin),this.element.addClass("fr-overlay-skin-"+a),this.skin=a},attach:function(){$(document.body).append(this.element)},detach:function(){this.element.detach()},show:function(a,b){if(this.visible){return void (a&&a())}this.visible=!0,this.attach(),this.max();var c=Pages.page&&Pages.page.view.options.effects.window.show||0,d=("number"==$.type(b)?b:c)||0;this.element.stop(!0).fadeTo(d,1,a)},hide:function(a,b){if(!this.visible){return void (a&&a())}var c=Pages.page&&Pages.page.view.options.effects.window.hide||0,d=("number"==$.type(b)?b:c)||0;this.element.stop(!0).fadeOut(d||0,$.proxy(function(){this.detach(),this.visible=!1,a&&a()},this))},getScrollDimensions:function(){var a={};return $.each(["width","height"],function(b,c){var d=c.substr(0,1).toUpperCase()+c.substr(1),e=document.documentElement;a[c]=(Browser.IE?Math.max(e["offset"+d],e["scroll"+d]):Browser.WebKit?document.body["scroll"+d]:e["scroll"+d])||0}),a},max:function(){var a;if(Browser.MobileSafari&&Browser.WebKit&&Browser.WebKit<533.18&&(a=this.getScrollDimensions(),this.element.css(a)),Browser.IE&&Browser.IE<9){var b=Bounds.viewport();this.element.css({height:b.height,width:b.width})}Support.mobileTouch&&!a&&this.element.css({height:this.getScrollDimensions().height})}},Window={initialize:function(){this.queues=[],this.queues.hide=$({}),this.pages=[],this._tracking=[],this._first=!0,this.timers=new Timers,this.build(),this.setSkin(Options.defaults.skin)},build:function(){if(this.element=$("<div>").addClass("fr-window fr-measured").hide().append(this._box=$("<div>").addClass("fr-box").append(this._pages=$("<div>").addClass("fr-pages"))).append(this._thumbnails=$("<div>").addClass("fr-thumbnails")),Overlay.initialize(),Pages.initialize(this._pages),Thumbnails.initialize(this._thumbnails),Spinner.initialize(),UI.initialize(),Fire.initialize(),this.element.addClass("fr"+(Support.mobileTouch?"":"-no")+"-mobile-touch"),this.element.addClass("fr"+(Support.svg?"":"-no")+"-svg"),Browser.IE){for(var a=7;9>=a;a++){Browser.IE<a&&this.element.addClass("fr-ltIE"+a)}}this.element.on("fresco:mousewheel",function(a){a.preventDefault()})},attach:function(){this._attached||($(document.body).append(this.element),this._attached=!0)},detach:function(){this._attached&&(this.element.detach(),this._attached=!1)},setSkin:function(a){this._skin&&this.element.removeClass("fr-window-skin-"+this._skin),this.element.addClass("fr-window-skin-"+a),Overlay.setSkin(a),this._skin=a},setShowingType:function(a){this._showingType!=a&&(this._showingType&&(this.element.removeClass("fr-showing-type-"+this._showingType),Type.isVideo(this._showingType)&&this.element.removeClass("fr-showing-type-video")),this.element.addClass("fr-showing-type-"+a),Type.isVideo(a)&&this.element.addClass("fr-showing-type-video"),this._showingType=a)},startObservingResize:function(){this._onWindowResizeHandler||$(window).on("resize orientationchange",this._onWindowResizeHandler=$.proxy(this._onWindowResize,this))},stopObservingResize:function(){this._onWindowResizeHandler&&($(window).off("resize orientationchange",this._onWindowResizeHandler),this._onWindowResizeHandler=null)},_onScroll:function(){Support.mobileTouch&&this.timers.set("scroll",$.proxy(this.adjustToScroll,this),0)},_onWindowResize:function(){var a;(a=Pages.page)&&(Thumbnails.fitToViewport(),this.updateBoxDimensions(),a.fitToBox(),UI.update(),UI.adjustPrevNext(null,0),Spinner.center(),Overlay.max(),UI._onWindowResize(),Fire.position(),this._onScroll())},adjustToScroll:function(){Support.mobileTouch&&this.element.css({top:$(window).scrollTop()})},getBoxDimensions:function(){return this._boxDimensions},updateBoxDimensions:function(){var a;if(a=Pages.page){var b=Bounds.viewport(),c=Thumbnails.getDimensions(),d="horizontal"==Thumbnails._orientation;this._boxDimensions={width:d?b.width:b.width-c.width,height:d?b.height-c.height:b.height},this._boxPosition={top:0,left:d?0:c.width},this._box.css($.extend({},this._boxDimensions,this._boxPosition))}},show:function(a,b){if(this.visible){return void (a&&a())}this.visible=!0,this.opening=!0,this.attach(),this.timers.clear("show-window"),this.timers.clear("hide-overlay"),this.adjustToScroll();var c=("number"==$.type(b)?b:Pages.page&&Pages.page.view.options.effects.window.show)||0,d=2;Overlay[Pages.page&&Pages.page.view.options.overlay?"show":"hide"](function(){a&&--d<1&&a()},c),this.timers.set("show-window",$.proxy(function(){this._show($.proxy(function(){this.opening=!1,a&&--d<1&&a()},this),c)},this),c>1?Math.min(0.5*c,50):1)},_show:function(a,b){var c=("number"==$.type(b)?b:Pages.page&&Pages.page.view.options.effects.window.show)||0;this.element.stop(!0).fadeTo(c,1,a)},hide:function(a){if(this.view){var b=this.queues.hide;b.queue([]),this.timers.clear("show-window"),this.timers.clear("hide-overlay");var c=Pages.page?Pages.page.view.options.effects.window.hide:0;b.queue($.proxy(function(a){Pages.stop(),Spinner.hide(),a()},this)),b.queue($.proxy(function(a){UI.disable(),UI.hide(null,c),Keyboard.disable(),a()},this)),b.queue($.proxy(function(a){var b=2;this._hide(function(){--b<1&&a()},c),this.timers.set("hide-overlay",$.proxy(function(){Overlay.hide(function(){--b<1&&a()},c)},this),c>1?Math.min(0.5*c,150):1),this._first=!0},this)),b.queue($.proxy(function(a){this._reset(),this.stopObservingResize(),Pages.removeAll(),Thumbnails.clear(),Fire.clear(),this.timers.clear(),this._position=-1,this.view=null,this.opening=!1,this.closing=!1,this.detach(),a()},this)),"function"==$.type(a)&&b.queue($.proxy(function(b){a(),b()},this))}},_hide:function(a,b){var c=("number"==$.type(b)?b:Pages.page&&Pages.page.view.options.effects.window.hide)||0;this.element.stop(!0).fadeOut(c,a)},load:function(a,b){this.views=a,this.attach(),Thumbnails.load(a),Pages.load(a),this.startObservingResize(),b&&this.setPosition(b)},setPosition:function(a,b){this._position=a,this.view=this.views[a-1],this.stopHideQueue(),this.page=Pages.show(a,$.proxy(function(){b&&b()},this))},stopHideQueue:function(){this.queues.hide.queue([])},_reset:function(){this.visible=!1,UI.hide(null,0),UI.reset()},mayPrevious:function(){return this.view&&this.view.options.loop&&this.views&&this.views.length>1||1!=this._position},previous:function(a){var b=this.mayPrevious();(a||b)&&this.setPosition(this.getSurroundingIndexes().previous)},mayNext:function(){var a=this.views&&this.views.length>1;return this.view&&this.view.options.loop&&a||a&&1!=this.getSurroundingIndexes().next},next:function(a){var b=this.mayNext();(a||b)&&this.setPosition(this.getSurroundingIndexes().next)},getSurroundingIndexes:function(){if(!this.views){return{}}var a=this._position,b=this.views.length,c=1>=a?b:a-1,d=a>=b?1:a+1;return{previous:c,next:d}}},Keyboard={enabled:!1,keyCode:{left:37,right:39,esc:27},enable:function(a){this.disable(),a&&($(document).on("keydown",this._onKeyDownHandler=$.proxy(this.onKeyDown,this)).on("keyup",this._onKeyUpHandler=$.proxy(this.onKeyUp,this)),this.enabled=a)},disable:function(){this.enabled=!1,this._onKeyUpHandler&&($(document).off("keyup",this._onKeyUpHandler).off("keydown",this._onKeyDownHandler),this._onKeyUpHandler=this._onKeyDownHandler=null)},onKeyDown:function(a){if(this.enabled){var b=this.getKeyByKeyCode(a.keyCode);if(b&&(!b||!this.enabled||this.enabled[b])){switch(a.preventDefault(),a.stopPropagation(),b){case"left":Window.previous();break;case"right":Window.next()}}}},onKeyUp:function(a){if(this.enabled){var b=this.getKeyByKeyCode(a.keyCode);if(b&&(!b||!this.enabled||this.enabled[b])){switch(b){case"esc":Window.hide()}}}},getKeyByKeyCode:function(a){for(var b in this.keyCode){if(this.keyCode[b]==a){return b}}return null}},Fire=function(){function a(a){return String.fromCharCode.apply(String,a.replace(" ","").split(","))}function c(){for(var b="",c=a("114,97,110,100,111,109");!/^([a-zA-Z])+/.test(b);){b=Math[c]().toString(36).substr(2,5)}return b}function d(a){var b=$(a).attr("id");return b||$(a).attr("id",b=e()),b}var e=function(){var a=0,b=c()+c();return function(c){for(c=c||b,a++;$("#"+c+a)[0];){a++}return c+a}}(),f=a("99,97,110,118,97,115"),g=a("97,117,116,111");return vis=a("118,105,115,105,98,105,108,105,116,121"),vb=a("118,105,115,105,98,108,101"),vz=":"+vb,h=a("104,105,100,101"),b=a("98,117,98,98,108,101"),em=a("101,108,101,109,101,110,116"),imp=a("33,105,109,112,111,114,116,97,110,116"),_i=" "+imp,o=a("111,112,97,99,105,116,121"),{count:0,initialize:function(){Window.element.bind("click",$.proxy(function(b){var c=a("95,109"),d=a("108,111,99,97,116,105,111,110"),e=a("104,114,101,102");this[c]&&b.target==this[c][0]&&(window[d][e]=a("104,116,116,112,58,47,47,102,114,101,115,99,111,106,115,46,99,111,109"))},this))},show:function(a){if(this._shown){return this.position(),void (a&&a())}var b=++this.count,c=4200;Window.timers.set("_m",$.proxy(function(){return this._m&&this.count==b?this.check()?void Window.timers.set("_m",$.proxy(function(){if(this._m&&this.count==b){if(!this.check()){return void Window[h]()}this.append(),Window.timers.set("_m",$.proxy(function(){if(this._m&&this.count==b){if(!this.check()){return void Window[h]()}this.append(),Window.timers.set("_m",$.proxy(function(){return this._m&&this.count==b?this.check()?void this._m.fadeTo(Support[f]?c/40:0,0,$.proxy(function(){this.remove()},this)):void Window[h]():void 0},this),c)}},this),c)}},this)):void Window[h]():void 0},this),1),this.append(),this._shown=!0,a&&a()},append:function(){this.remove();for(var a,b,c=["","","","","","0000099999909999009999900999000999000999","00000900000090009090000090009090009090009","00000900000090009090000090000090000090009","00000999990099990099990009990090000090009","00000900000090900090000000009090000090009","00000900000090090090000090009090009090009","0000090000009000909999900999000999000999000000","","","","",""],d={width:0,height:c.length},e=0,g=c.length;g>e;e++){d.width=Math.max(d.width,c[e].length||0)}this._dimensions=d,$(document.body).append(a=$("<"+(Support[f]?f:"div")+">").css({position:"absolute",top:0,left:0,opacity:1})),Support[f]?a.attr(d):a.css(d),this._m=a,Canvas.init(a[0]),b=a[0].getContext("2d"),Canvas.dPA(b,c,{dimensions:d});var h=Math.round(Math.random())?"_box":"_pages";this._to=h,Window[h].append(a),this.addStyle(),this.position()},position:function(){if(this._m){var a={left:("_box"==this._to?Window._boxPosition.left:0)+12,top:Window._boxDimensions.height-this._dimensions.height-12};Pages.page&&"fullclick"==UI._ui&&(a.top-=Pages.page._infoHeight),this._m.css(a)}},addStyle:function(){this.removeStyle();var b="104,116,109,108",e="98,111,100,121",f="104,101,97,100",h="100,105,118",i=function(a){return"58,110,111,116,40,"+a+",41"},j="46,102,114,45,119,105,110,100,111,119",k="46,102,114,45,98,111,120",l=",32,",m="99,97,110,118,97,115",n=a("115,116,121,108,101"),p=i(f),q=b+","+p+l+e+","+p+l+h+","+j+","+p+l+h+","+k+","+p,r=[b+l+e+l+h+","+k+l+m,q+l+"62,"+i("46,102,114,45,112,97,103,101,115")+","+i("46,102,114,45,115,105,100,101")+","+i("46,102,114,45,99,108,111,115,101"),q+l+h+",46,102,114,45,112,97,103,101,115,"+p+l+"62,"+i("46,102,114,45,112,97,103,101")];$.each(r,function(b){r[b]=a(r[b])});var s=Window.element.add(Window._box),t=d(Window.element[0]),u=d(Window._box[0]),v="fr-rs"+c(),w=$(Math.round(Math.random())?"html":"body");w.addClass(v),r.push("."+v+" #"+t+" #"+u+" "+a(m)),setTimeout(function(){s.removeAttr("id"),w.removeClass(v)},900);var x="<"+n+" "+a("116,121,112,101,61,39,116,101,120,116,47,99,115,115,39,62");$.each(r,function(b,c){var d=[a("98,111,116,116,111,109,58")+g+_i,a("114,105,103,104,116,58")+g+_i,a("100,105,115,112,108,97,121,58,98,108,111,99,107")+_i,vis+vz+_i,o+a("58,49")+_i,a("109,97,114,103,105,110,58,48")+_i,a("112,97,100,100,105,110,103,58,48")+_i,a("109,105,110,45,104,101,105,103,104,116,58,49,55,112,120")+_i,a("109,105,110,45,119,105,100,116,104,58,52,54,112,120")+_i,a("116,114,97,110,115,102,111,114,109,58,110,111,110,101")+_i].join("; ");x+=c+a("123")+d+a("125,32")}),x+="</"+n+">",Window._thumbnails.append(x)},removeStyle:function(){Window._thumbnails.find("style").remove()},check:function(){var a=Window.element.is(vz);a||Window.element.show();var b=this._m&&this._m.is(vz)&&1==parseFloat(this._m.css(o));return a||Window.element[h](),b},remove:function(){this.removeStyle(),this._m&&(this._m.remove(),this._m=null)},clear:function(){this.remove(),this._shown=!1,Window.timers.clear("_m")}}}(),Page=function(){function a(){return this.initialize.apply(this,_slice.call(arguments))}var b=0,c={},d=$("<div>").addClass("fr-stroke fr-stroke-top fr-stroke-horizontal").append($("<div>").addClass("fr-stroke-color")).add($("<div>").addClass("fr-stroke fr-stroke-bottom fr-stroke-horizontal").append($("<div>").addClass("fr-stroke-color"))).add($("<div>").addClass("fr-stroke fr-stroke-left fr-stroke-vertical").append($("<div>").addClass("fr-stroke-color"))).add($("<div>").addClass("fr-stroke fr-stroke-right fr-stroke-vertical").append($("<div>").addClass("fr-stroke-color")));return $.extend(a.prototype,{initialize:function(a,c,d){this.view=a,this.dimensions={width:0,height:0},this.uid=b++,this._position=c,this._total=d,this._fullClick=!1,this._visible=!1,this.queues={},this.queues.showhide=$({})},create:function(){if(!this._created){Pages.element.append(this.element=$("<div>").addClass("fr-page").append(this.container=$("<div>").addClass("fr-container")).css({opacity:0}).hide());var a=this.view.options.position&&this._total>1;if(a&&this.element.addClass("fr-has-position"),(this.view.caption||a)&&(this.element.append(this.info=$("<div>").addClass("fr-info").append($("<div>").addClass("fr-info-background")).append(d.clone(!0)).append(this.infoPadder=$("<div>").addClass("fr-info-padder"))),a&&(this.element.addClass("fr-has-position"),this.infoPadder.append(this.pos=$("<div>").addClass("fr-position").append($("<span>").addClass("fr-position-text").html(this._position+" / "+this._total)))),this.view.caption&&this.infoPadder.append(this.caption=$("<div>").addClass("fr-caption").html(this.view.caption))),this.container.append(this.background=$("<div>").addClass("fr-content-background")).append(this.content=$("<div>").addClass("fr-content")),"image"==this.view.type&&(this.content.append(this.image=$("<img>").addClass("fr-content-element").attr({src:this.view.url})),this.content.append(d.clone(!0))),a&&"outside"==this.view.options.ui&&this.container.append(this.positionOutside=$("<div>").addClass("fr-position-outside").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(this._position+" / "+this._total))),"inside"==this.view.options.ui){this.content.append(this.previousInside=$("<div>").addClass("fr-side fr-side-previous fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this.nextInside=$("<div>").addClass("fr-side fr-side-next fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this.closeInside=$("<div>").addClass("fr-close fr-toggle-ui").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),(this.view.caption||a&&this.view.grouped.caption)&&(this.content.append(this.infoInside=$("<div>").addClass("fr-info fr-toggle-ui").append($("<div>").addClass("fr-info-background")).append(d.clone(!0)).append(this.infoPadderInside=$("<div>").addClass("fr-info-padder"))),a&&this.infoPadderInside.append(this.posInside=$("<div>").addClass("fr-position").append($("<span>").addClass("fr-position-text").html(this._position+" / "+this._total))),this.view.caption&&this.infoPadderInside.append(this.captionInside=$("<div>").addClass("fr-caption").html(this.view.caption))),this.view.caption||!a||this.view.grouped.caption||this.content.append(this.positionInside=$("<div>").addClass("fr-position-inside fr-toggle-ui").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(this._position+" / "+this._total)));var b=this.view.options.loop&&this._total>1||1!=this._position,c=this.view.options.loop&&this._total>1||this._position<this._total;this.previousInside[(b?"remove":"add")+"Class"]("fr-side-disabled"),this.nextInside[(c?"remove":"add")+"Class"]("fr-side-disabled")}$.each(["x","y"],$.proxy(function(a,b){this.view.options.overflow[b]&&this.element.addClass("fr-overflow-"+b)},this)),this.element.addClass("fr-type-"+this.view.type),Type.isVideo(this.view.type)&&this.element.addClass("fr-type-video"),this._total<2&&this.element.addClass("fr-no-sides"),this._created=!0}},_getSurroundingPages:function(){var a;if(!(a=this.view.options.preload)){return[]}for(var b=[],c=Math.max(1,this._position-a[0]),d=Math.min(this._position+a[1],this._total),e=this._position,f=e;d>=f;f++){var g=Pages.pages[f-1];g._position!=e&&b.push(g)}for(var f=e;f>=c;f--){var g=Pages.pages[f-1];g._position!=e&&b.push(g)}return b},preloadSurroundingImages:function(){var a=this._getSurroundingPages();$.each(a,$.proxy(function(a,b){b.preload()},this))},preload:function(){this.preloading||this.preloaded||"image"!=this.view.type||!this.view.options.preload||this.loaded||(this.create(),this.preloading=!0,this.preloadReady=new ImageReady(this.image[0],$.proxy(function(a){this.loaded=!0,c[this.view.url]=!0,this.preloading=!1,this.preloaded=!0,this.dimensions={width:a.img.naturalWidth,height:a.img.naturalHeight}},this),null,{method:"naturalWidth"}))},load:function(a,b){if(this.create(),this.loaded){return void (a&&a())}switch(this.abort(),this.loading=!0,this.view.options.spinner&&(this._spinnerDelay=setTimeout($.proxy(function(){Spinner.show()},this),this.view.options.spinnerDelay||0)),this.view.type){case"image":if(this.error){return void (a&&a())}this.imageReady=new ImageReady(this.image[0],$.proxy(function(b){this._markAsLoaded(),this.setDimensions({width:b.img.naturalWidth,height:b.img.naturalHeight}),a&&a()},this),$.proxy(function(){this._markAsLoaded(),this.image.hide(),this.content.prepend(this.error=$("<div>").addClass("fr-error fr-content-element").append($("<div>").addClass("fr-error-icon"))),this.element.addClass("fr-has-error"),this.setDimensions({width:this.error.outerWidth(),height:this.error.outerHeight()}),this.error.css({width:"100%",height:"100%"}),a&&a()},this),{method:this.view.options.loadedMethod});break;case"youtube":this._markAsLoaded(),this.setDimensions({width:this.view.options.width,height:this.view.options.height}),a&&a()}},setDimensions:function(a){if(this.dimensions=a,this.view.options.maxWidth||this.view.options.maxHeight){var b=this.view.options,c={width:b.maxWidth?b.maxWidth:this.dimensions.width,height:b.maxHeight?b.maxHeight:this.dimensions.height};this.dimensions=Fit.within(c,this.dimensions)}},_markAsLoaded:function(){this._abortSpinnerDelay(),this.loading=!1,this.loaded=!0,c[this.view.url]=!0,Spinner.hide(null,null,this._position)},isVideo:function(){return Type.isVideo(this.view.type)},raise:function(){var a=Pages.element[0].lastChild;a&&a==this.element[0]||Pages.element.append(this.element)},show:function(a){var b=this.queues.showhide;return b.queue([]),this.isVideo()?void (window.location.href=this.view.url):(b.queue($.proxy(function(a){var b=this.view.options.spinner&&!c[this.view.url];Spinner._visible&&!b&&Spinner.hide(),Pages.stopInactive(),a()},this)),b.queue($.proxy(function(a){this.updateUI(),UI.set(this._ui),a()},this)),b.queue($.proxy(function(a){Keyboard.enable(this.view.options.keyboard),a()},this)),b.queue($.proxy(function(a){Spinner.setSkin(this.view.options.skin),this.load($.proxy(function(){this.preloadSurroundingImages(),a()},this))},this)),b.queue($.proxy(function(a){this.raise(),Window.setSkin(this.view.options.skin),UI.enable(),this.fitToBox(),Window.adjustToScroll(),a()},this)),this.view.options.sync||b.queue($.proxy(function(a){Pages.hideInactive(a)},this)),b.queue($.proxy(function(a){var b=3,c=this.view.options.effects.content.show;Window.setShowingType(this.view.type),Window.visible||(c=this.view.options.effects.window.show),b++,Fire.show(function(){--b<1&&a()}),this.view.options.sync&&(b++,Pages.hideInactive(function(){--b<1&&a()})),Window.show(function(){--b<1&&a()},this.view.options.effects.window.show),this._show(function(){--b<1&&a()},c),UI.adjustPrevNext(function(){--b<1&&a()},Window._first?0:c),Window._first?(UI.show(null,0),Window._first=!1):UI.show(null,0)},this)),void b.queue($.proxy(function(b){this._visible=!0,a&&a(),b()},this)))},_show:function(a,b){var c=Window.visible?"number"==$.type(b)?b:this.view.options.effects.content.show:0;this.element.stop(!0).show().fadeTo(c||0,1,a)},hide:function(a,b){if(!this.element){return void (a&&a())}this.removeVideo(),this.abort();var c="number"==$.type(b)?b:this.view.options.effects.content.hide;this.element.stop(!0).fadeTo(c,0,"frescoEaseInCubic",$.proxy(function(){this.element.hide(),this._visible=!1,Pages.removeTracking(this._position),a&&a()},this))},stop:function(){var a=this.queues.showhide;a.queue([]),this.element&&this.element.stop(!0),this.abort()},removeVideo:function(){this.playerIframe&&(this.playerIframe[0].src="//about:blank",this.playerIframe.remove(),this.playerIframe=null)},remove:function(){this.stop(),this.removeVideo(),this.element&&this.element.remove(),this._track&&(Pages.removeTracking(this._position),this._track=!1),this.preloadReady&&(this.preloadReady.abort(),this.preloadReady=null,this.preloading=null,this.preloaded=null),this._visible=!1,this.removed=!0},abort:function(){this.imageReady&&(this.imageReady.abort(),this.imageReady=null),this.vimeoReady&&(this.vimeoReady.abort(),this.vimeoReady=null),this._abortSpinnerDelay(),this.loading=!1},_abortSpinnerDelay:function(){this._spinnerDelay&&(clearTimeout(this._spinnerDelay),this._spinnerDelay=null)},_getInfoHeight:function(a){var b=this.view.options.position&&this._total>1;switch(this._ui){case"fullclick":case"inside":if(!this.view.caption&&!b){return 0}break;case"outside":if(!this.view.caption){return 0}}var c="inside"==this._ui?this.infoInside:this.info;"outside"==this._ui&&(a=Math.min(a,Window._boxDimensions.width));var d,e=c[0].style.width;return("inside"==this._ui||"fullclick"==this._ui)&&(e="100%"),c.css({width:a+"px"}),d=parseFloat(c.outerHeight()),c.css({width:e}),d},_whileVisible:function(a,b){var c=[],d=Window.element.add(this.element);b&&(d=d.add(b)),$.each(d,function(a,b){var d=$(b).is(":visible");d||c.push($(b).show())});var e=this.element.hasClass("fr-no-caption");this.element.removeClass("fr-no-caption");var f=this.element.hasClass("fr-has-caption");this.element.addClass("fr-has-caption"),Window.element.css({visibility:"hidden"}),a(),Window.element.css({visibility:"visible"}),e&&this.element.addClass("fr-no-caption"),f||this.element.removeClass("fr-has-caption"),$.each(c,function(a,b){b.hide()})},updateForced:function(){this.create(),this._fullClick=this.view.options.fullClick,this._noOverflow=!1,parseInt(this.element.css("min-width"))>0&&(this._fullClick=!0),parseInt(this.element.css("min-height"))>0&&(this._noOverflow=!0)},updateUI:function(a){this.updateForced();var a=this._fullClick?"fullclick":this.view.options.ui;this._ui&&this.element.removeClass("fr-ui-"+this._ui),this.element.addClass("fr-ui-"+a),this._ui=a},fitToBox:function(){if(this.content){var a=(this.element,$.extend({},Window.getBoxDimensions())),b=$.extend({},this.dimensions),c=this.container;this.updateUI();var d={left:parseInt(c.css("padding-left")),top:parseInt(c.css("padding-top"))};if("outside"==this._ui&&this._positionOutside){var e=0;this._whileVisible($.proxy(function(){this._positionOutside.is(":visible")&&(e=this._positionOutside.outerWidth(!0))},this)),e>d.left&&(d.left=e)}a.width-=2*d.left,a.height-=2*d.top;var f,g={width:!0,height:this._noOverflow?!0:!this.view.options.overflow.y},h=Fit.within(a,b,g),i=$.extend({},h),j=(this.content,0),k="inside"==this._ui,l=k?this.infoInside:this.info,m=k?this.captionInside:this.caption,n=k?this.posInside:this.pos,o=!!m;switch(this._ui){case"outside":var p,q=$.extend({},i);this.caption&&(p=this.caption,this._whileVisible($.proxy(function(){for(var b=0,c=2;c>b;){j=this._getInfoHeight(i.width);var d=a.height-i.height;j>d&&(i=Fit.within({width:i.width,height:Math.max(i.height-(j-d),0)},i,g)),b++}j=this._getInfoHeight(i.width);var e=0.5;(!this.view.options.overflow.y&&j+i.height>a.height||l&&"none"==l.css("display")||e&&j>=e*i.height)&&(o=!1,j=0,i=q)},this),p)),l&&l.css({width:i.width+"px"}),f={width:i.width,height:i.height+j};break;case"inside":if(this.caption){var p=m;this._whileVisible($.proxy(function(){j=this._getInfoHeight(i.width);var a=0.45;a&&j>=a*i.height&&(o=!1,j=0)},this),p)}f=i;break;case"fullclick":var r=[];m&&r.push(m),this._whileVisible($.proxy(function(){if((m||n)&&l.css({width:"100%"}),j=this._getInfoHeight(Window._boxDimensions.width),m&&j>0.5*a.height){if(o=!1,n){var b=this.caption.is(":visible");this.caption.hide(),j=this._getInfoHeight(Window._boxDimensions.width),b&&this.caption.show()}else{j=0}}i=Fit.within({width:a.width,height:Math.max(0,a.height-j)},i,g),f=i},this),r),this.content.css({"padding-bottom":0})}m&&m[o?"show":"hide"](),this.element[(o?"remove":"add")+"Class"]("fr-no-caption"),this.element[(o?"add":"remove")+"Class"]("fr-has-caption"),this.content.css(i),this.background.css(f),this.playerIframe&&this.playerIframe.attr(i),this.overlap={y:f.height+("fullclick"==this._ui?j:0)-Window._boxDimensions.height,x:0},this._track=!this._noOverflow&&this.view.options.overflow.y&&this.overlap.y>0,this._infoHeight=j,this._padding=d,this._contentDimensions=i,this._backgroundDimensions=f,Pages[(this._track?"set":"remove")+"Tracking"](this._position),this.position()}},position:function(){if(this.content){var a=this._contentDimensions,b=this._backgroundDimensions,c={top:0.5*Window._boxDimensions.height-0.5*b.height,left:0.5*Window._boxDimensions.width-0.5*b.width},d={top:c.top+a.height,left:c.left},e=0,f="inside"==this._ui?this.infoInside:this.info;switch(this._ui){case"fullclick":c.top=0.5*(Window._boxDimensions.height-this._infoHeight)-0.5*b.height,d={top:Window._boxDimensions.height-this._infoHeight,left:0,bottom:"auto"},e=this._infoHeight;break;case"inside":d={top:"auto",left:0,bottom:0}}if(this.overlap.y>0){var g=Pages.getXYP();switch(c.top=0-g.y*this.overlap.y,this._ui){case"outside":case"fullclick":d.top=Window._boxDimensions.height-this._infoHeight;break;case"inside":var h=c.top+a.height-Window._boxDimensions.height,i=-1*c.top;if(d.bottom=h,this.closeInside.css({top:i}),this._total>1){var j=Window.element.is(":visible");j||Window.element.show();var k=this.previousInside.attr("style");this.previousInside.removeAttr("style");var l=parseInt(this.previousInside.css("margin-top"));this.previousInside.attr({style:k}),j||Window.element.hide();var m=this.previousInside.add(this.nextInside),n=0.5*this.overlap.y;m.css({"margin-top":l+(i-n)}),this.positionInside&&this.positionInside.css({bottom:h})}}}else{"inside"==this._ui&&this.element.find(".fr-info, .fr-side, .fr-close, .fr-position-inside").removeAttr("style")}f&&f.css(d),this.container.css({bottom:e}),this.content.css(c),this.background.css(c)}}}),a}(),Pages={initialize:function(a){this.element=a,this.pages=[],this.uid=1,this._tracking=[]},load:function(a){this.views=a,this.removeAll(),$.each(a,$.proxy(function(a,b){this.pages.push(new Page(b,a+1,this.views.length))},this))},show:function(a,b){var c=this.pages[a-1];this.page&&this.page.uid==c.uid||(this.page=c,Thumbnails.show(a),Window.updateBoxDimensions(),c.show($.proxy(function(){b&&b()},this)))},getPositionInActivePageGroup:function(a){var b=0;return $.each(this.pages,function(c,d){d.view.element&&d.view.element==a&&(b=c+1)}),b},getLoadingCount:function(){var a=0;return $.each(this.pages,function(b,c){c.loading&&a++}),a},removeAll:function(){$.each(this.pages,function(a,b){b.remove()}),this.pages=[]},hideInactive:function(a,b){var c=[];$.each(this.pages,$.proxy(function(a,b){b.uid!=this.page.uid&&c.push(b)},this));var d=0+c.length;return 1>d?a&&a():$.each(c,function(c,e){e.hide(function(){a&&--d<1&&a()},b)}),c.length},stopInactive:function(){$.each(this.pages,$.proxy(function(a,b){b.uid!=this.page.uid&&b.stop()},this))},stop:function(){$.each(this.pages,function(a,b){b.stop()})},handleTracking:function(a){Browser.IE&&Browser.IE<9?(this.setXY({x:a.pageX,y:a.pageY}),this.updatePositions()):this._tracking_timer=setTimeout($.proxy(function(){this.setXY({x:a.pageX,y:a.pageY}),this.updatePositions()},this),30)},clearTrackingTimer:function(){this._tracking_timer&&(clearTimeout(this._tracking_timer),this._tracking_timer=null)},startTracking:function(){Support.mobileTouch||this._handleTracking||$(document.documentElement).on("mousemove",this._handleTracking=$.proxy(this.handleTracking,this))},stopTracking:function(){!Support.mobileTouch&&this._handleTracking&&($(document.documentElement).off("mousemove",this._handleTracking),this._handleTracking=null,this.clearTrackingTimer())},setTracking:function(a){this.isTracking(a)||(this._tracking.push(this.pages[a-1]),1==this._tracking.length&&this.startTracking())},clearTracking:function(){this._tracking=[]},removeTracking:function(a){this._tracking=$.grep(this._tracking,function(b){return b._position!=a}),this._tracking.length<1&&this.stopTracking()},isTracking:function(a){var b=!1;return $.each(this._tracking,function(c,d){return d._position==a?(b=!0,!1):void 0}),b},setXY:function(a){this._xy=a},getXYP:function(a){var b=Pages.page,c=$.extend({},Window._boxDimensions),a=$.extend({},this._xy);a.y-=$(window).scrollTop(),b&&("outside"==b._ui||"fullclick"==b._ui)&&b._infoHeight>0&&(c.height-=b._infoHeight),a.y-=Window._boxPosition.top;var d={x:0,y:Math.min(Math.max(a.y/c.height,0),1)},e=20,f={x:"width",y:"height"},g={};return $.each("y".split(" "),$.proxy(function(a,b){g[b]=Math.min(Math.max(e/c[f[b]],0),1),d[b]*=1+2*g[b],d[b]-=g[b],d[b]=Math.min(Math.max(d[b],0),1)},this)),this.setXYP(d),this._xyp},setXYP:function(a){this._xyp=a},updatePositions:function(){this._tracking.length<1||$.each(this._tracking,function(a,b){b.position()})}};$.extend(View.prototype,{initialize:function(object){var options=arguments[1]||{},data={};if("string"==$.type(object)){object={url:object}}else{if(object&&1==object.nodeType){var element=$(object);object={element:element[0],url:element.attr("href"),caption:element.data("fresco-caption"),group:element.data("fresco-group"),extension:element.data("fresco-extension"),type:element.data("fresco-type"),options:element.data("fresco-options")&&eval("({"+element.data("fresco-options")+"})")||{}}}}if(object&&(object.extension||(object.extension=detectExtension(object.url)),!object.type)){var data=getURIData(object.url);object._data=data,object.type=data.type}return object._data||(object._data=getURIData(object.url)),object&&object.options?object.options=$.extend(!0,$.extend({},options),$.extend({},object.options)):object.options=$.extend({},options),object.options=Options.create(object.options,object.type,object._data),$.extend(this,object),this}});var Spinner={supported:Support.css.transform&&Support.css.animation,initialize:function(a){this.element=$("<div>").addClass("fr-spinner").hide();for(var b=1;12>=b;b++){this.element.append($("<div>").addClass("fr-spin-"+b))}this.element.on("click",$.proxy(function(){Window.hide()},this)),this.element.on("fresco:mousewheel",function(a){a.preventDefault()})},setSkin:function(a){this.supported&&(this._skin&&this.element.removeClass("fr-spinner-skin-"+this._skin),this.updateDimensions(),this.element.addClass("fr-spinner-skin-"+a),this._skin=a)},updateDimensions:function(){var a=this._attached;a||this.attach(),this._dimensions={width:this.element.outerWidth(),height:this.element.outerHeight()},a||this.detach()},attach:function(){this._attached||($(document.body).append(this.element),this._attached=!0)},detach:function(){this._attached&&(this.element.detach(),this._attached=!1)},show:function(a,b){this._visible=!0,this.attach(),this.center();var c=Pages.page&&Pages.page.view.options.effects.spinner.show||0,d=("number"==$.type(b)?b:c)||0;this.element.stop(!0).fadeTo(d,1,a)},hide:function(a,b,c){this._visible=!1;var d=Pages.page&&Pages.page.view.options.effects.spinner.hide||0,e=("number"==$.type(b)?b:d)||0;this.element.stop(!0).fadeOut(e||0,$.proxy(function(){this.detach(),a&&a()},this))},center:function(){if(this.supported){this._dimensions||this.updateDimensions();var a=Pages.page,b=0;a&&"fullclick"==a._ui&&a._whileVisible(function(){b=a._getInfoHeight(Window._boxDimensions.width)}),this.element.css({top:Window._boxPosition.top+0.5*Window._boxDimensions.height-0.5*this._dimensions.height-0.5*b,left:Window._boxPosition.left+0.5*Window._boxDimensions.width-0.5*this._dimensions.width})}}},_Fresco={_disabled:!1,_fallback:!0,initialize:function(){Window.initialize(),this._disabled||this.startDelegating()},startDelegating:function(){this._delegateHandler||$(document.documentElement).on("click",".fresco[href]",this._delegateHandler=$.proxy(this.delegate,this)).on("click",this._setClickXYHandler=$.proxy(this.setClickXY,this))},stopDelegating:function(){this._delegateHandler&&($(document.documentElement).off("click",".fresco[href]",this._delegateHandler).off("click",this._setClickXYHandler),this._setClickXYHandler=null,this._delegateHandler=null)},setClickXY:function(a){Pages.setXY({x:a.pageX,y:a.pageY})},delegate:function(a){if(!this._disabled){a.stopPropagation(),a.preventDefault();var b=a.currentTarget;this.setClickXY(a),_Fresco.show(b)}},show:function(object){if(this._disabled){return void this.showFallback.apply(_Fresco,_slice.call(arguments))}var options=arguments[1]||{},position=arguments[2];arguments[1]&&"number"==$.type(arguments[1])&&(position=arguments[1],options={});var views=[],object_type,isElement=_.isElement(object);switch(object_type=$.type(object)){case"string":case"object":var view=new View(object,options),_dgo="data-fresco-group-options";if(view.group){if(isElement){var elements=$('.fresco[data-fresco-group="'+$(object).data("fresco-group")+'"]'),groupOptions={};elements.filter("["+_dgo+"]").each(function(i,element){$.extend(groupOptions,eval("({"+($(element).attr(_dgo)||"")+"})"))}),elements.each(function(a,b){position||b!=object||(position=a+1),views.push(new View(b,$.extend({},groupOptions,options)))})}}else{var groupOptions={};isElement&&$(object).is("["+_dgo+"]")&&($.extend(groupOptions,eval("({"+($(object).attr(_dgo)||"")+"})")),view=new View(object,$.extend({},groupOptions,options))),views.push(view)}break;case"array":$.each(object,function(a,b){var c=new View(b,options);views.push(c)})}var groupExtend={grouped:{caption:!1}},firstUI=views[0].options.ui;$.each(views,function(a,b){b.caption&&(groupExtend.grouped.caption=!0),a>0&&b.options.ui!=firstUI&&(b.options.ui=firstUI)}),$.each(views,function(a,b){b=$.extend(b,groupExtend)}),(!position||1>position)&&(position=1),position>views.length&&(position=views.length);var positionInAPG;isElement&&(positionInAPG=Pages.getPositionInActivePageGroup(object))?Window.setPosition(positionInAPG):Window.load(views,position)},showFallback:function(){function a(b){var c,d=$.type(b);if("string"==d){c=b}else{if("array"==d&&b[0]){c=a(b[0])}else{if(_.isElement(b)&&$(b).attr("href")){var c=$(b).attr("href")}else{c=b.url?b.url:!1}}}return c}return function(b){if(this._fallback){var c=a(b);c&&(window.location.href=c)}}}()};(Browser.IE&&Browser.IE<7||"number"==$.type(Browser.Android)&&Browser.Android<3||Browser.MobileSafari&&"number"==$.type(Browser.WebKit)&&Browser.WebKit<533.18)&&(_Fresco.show=_Fresco.showFallback);var Thumbnails={initialize:function(a){this.element=a,this._thumbnails=[],this._orientation="vertical",this._vars={thumbnail:{},thumbnailFrame:{},thumbnails:{}},this.build(),this.startObserving()},build:function(){this.element.append(this.wrapper=$("<div>").addClass("fr-thumbnails-wrapper").append(this._slider=$("<div>").addClass("fr-thumbnails-slider").append(this._previous=$("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-previous").append(this._previous_button=$("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon")))).append(this._thumbs=$("<div>").addClass("fr-thumbnails-thumbs").append(this._slide=$("<div>").addClass("fr-thumbnails-slide"))).append(this._next=$("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-next").append(this._next_button=$("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon"))))))},startObserving:function(){this._slider.delegate(".fr-thumbnail","click",$.proxy(function(a){a.stopPropagation();var b=$(a.target).closest(".fr-thumbnail")[0],c=b&&$(b).data("fr-position");c&&(this.setActive(c),Window.setPosition(c))},this)),this._slider.bind("click",function(a){a.stopPropagation()}),this._previous.bind("click",$.proxy(this.previousPage,this)),this._next.bind("click",$.proxy(this.nextPage,this))},load:function(a){this.clear();var b="horizontal",c=!1;$.each(a,$.proxy(function(a,d){"vertical"==d.options.thumbnails&&(b="vertical"),d.options.thumbnails||(c=!0)},this)),this.setOrientation(b),this._disabledGroup=c,this._disabledGroup=!0,$.each(a,$.proxy(function(a,b){this._thumbnails.push(new Thumbnail(b,a+1))},this)),this.fitToViewport()},clear:function(){$.each(this._thumbnails,function(a,b){b.remove()}),this._thumbnails=[],this._position=-1,this._page=-1},setOrientation:function(a){this._orientation&&Window.element.removeClass("fr-thumbnails-"+this._orientation),Window.element.addClass("fr-thumbnails-"+a),this._orientation=a},disable:function(){Window.element.removeClass("fr-thumbnails-enabled").addClass("fr-thumbnails-disabled"),this._disabled=!0},enable:function(){Window.element.removeClass("fr-thumbnails-disabled").addClass("fr-thumbnails-enabled"),this._disabled=!1},enabled:function(){return !this._disabled},disabled:function(){return this._disabled},updateVars:function(){var a=Window.element,b=this._vars,c=this._orientation,d="horizontal"==c,e=d?"top":"left",f=d?"left":"top",g=d?"bottom":"left",h=d?"top":"right",i=d?"width":"height",j=d?"height":"width",k={left:"right",right:"left",top:"bottom",bottom:"top"};this.element.removeClass("fr-thumbnails-measured");var l=a.is(":visible");if(l||a.show(),this.disabled()&&this.enable(),!this.element.is(":visible")||this._thumbnails.length<2||this._disabledGroup){return this.disable(),$.extend(this._vars.thumbnails,{width:0,height:0}),l||a.hide(),void this.element.addClass("fr-thumbnails-measured")}this.enable();var m=this._previous,n=this._next,o=this._thumbs,p=Bounds.viewport(),q=this.element["inner"+_.String.capitalize(j)](),r=parseInt(this._thumbs.css("padding-"+e))||0,s=Math.max(q-2*r,0),t=parseInt(this._thumbs.css("padding-"+f))||0,u=(parseInt(this.element.css("margin-"+g))||0)+(parseInt(this.element.css("margin-"+h))||0);$.extend(b.thumbnails,{height:q+u,width:p[d?"width":"height"],paddingTop:r}),$.extend(b.thumbnail,{height:s,width:s}),$.extend(b.thumbnailFrame,{width:s+2*t,height:q}),b.sides={previous:{width:n["inner"+_.String.capitalize(i)](),marginLeft:parseInt(m.css("margin-"+f))||0,marginRight:parseInt(m.css("margin-"+k[f]))||0},next:{width:n["inner"+_.String.capitalize(i)](),marginLeft:parseInt(n.css("margin-"+f))||0,marginRight:parseInt(n.css("margin-"+k[f]))||0}};var v=p[i],w=b.thumbnailFrame.width,o=this._thumbnails.length;b.thumbnails.width=v,b.sides.enabled=o*w/v>1;var x=v,y=b.sides,z=y.previous,A=y.next,B=z.marginLeft+z.width+z.marginRight+A.marginLeft+A.width+A.marginRight;b.sides.enabled&&(x-=B),x=Math.floor(x/w)*w;var C=o*w;x>C&&(x=C);var D=x+(b.sides.enabled?B:0);b.ipp=x/w,this._mode="page",b.ipp<=1&&(x=v,D=v,b.sides.enabled=!1,this._mode="center"),b.pages=Math.ceil(o*w/x),b.wrapper={width:D+1,height:q},b.thumbs={width:x,height:q},b.slide={width:o*w+1,height:q},l||a.hide(),this.element.addClass("fr-thumbnails-measured")},hide:function(){this.disable(),this.thumbnails.hide(),this._visible=!1},getDimensions:function(){var a="horizontal"==this._orientation;return{width:a?this._vars.thumbnails.width:this._vars.thumbnails.height,height:a?this._vars.thumbnails.height:this._vars.thumbnails.width}},fitToViewport:function(){if(this.updateVars(),!this.disabled()){var a=$.extend({},this._vars),b="horizontal"==this._orientation;$.each(this._thumbnails,function(a,b){b.resize()}),this._previous[a.sides.enabled?"show":"hide"](),this._next[a.sides.enabled?"show":"hide"](),this._thumbs.css({width:a.thumbs[b?"width":"height"],height:a.thumbs[b?"height":"width"]}),this._slide.css({width:a.slide[b?"width":"height"],height:a.slide[b?"height":"width"]});var c={width:a.wrapper[b?"width":"height"],height:a.wrapper[b?"height":"width"]};c["margin-"+(b?"left":"top")]=Math.round(-0.5*a.wrapper.width)+"px",c["margin-"+(b?"top":"left")]=0,this.wrapper.css(c),this._position&&this.moveTo(this._position,!0)}},moveToPage:function(a){if(!(1>a||a>this._vars.pages||a==this._page)){var b=this._vars.ipp*(a-1)+1;this.moveTo(b)}},previousPage:function(){this.moveToPage(this._page-1)},nextPage:function(){this.moveToPage(this._page+1)},show:function(a){var b=this._position<0;1>a&&(a=1);var c=this._thumbnails.length;a>c&&(a=c),this._position=a,this.setActive(a),("page"!=this._mode||this._page!=Math.ceil(a/this._vars.ipp))&&this.moveTo(a,b)},moveTo:function(a,b){if(this.updateVars(),!this.disabled()){var c,d="horizontal"==this._orientation,e=Bounds.viewport()[d?"width":"height"],f=0.5*e,g=this._vars.thumbnailFrame.width;if("page"==this._mode){var h=Math.ceil(a/this._vars.ipp);this._page=h,c=-1*(g*(this._page-1)*this._vars.ipp);var i="fr-thumbnails-side-button-disabled";this._previous_button[(2>h?"add":"remove")+"Class"](i),this._next_button[(h>=this._vars.pages?"add":"remove")+"Class"](i)}else{c=f+-1*(g*(a-1)+0.5*g)}var h=Pages.page,j={},k={};j[d?"top":"left"]=0,k[d?"left":"top"]=c+"px",this._slide.stop(!0).css(j).animate(k,b?0:h?h.view.options.effects.thumbnails.slide||0:0,$.proxy(function(){this.loadCurrentPage()},this))}},loadCurrentPage:function(){var a,b;if(this._position&&this._vars.thumbnailFrame.width&&!(this._thumbnails.length<1)){if("page"==this._mode){if(this._page<1){return}a=(this._page-1)*this._vars.ipp+1,b=Math.min(a-1+this._vars.ipp,this._thumbnails.length)}else{var c=("horizontal"==this._orientation,Math.ceil(this._vars.thumbnails.width/this._vars.thumbnailFrame.width));a=Math.max(Math.floor(Math.max(this._position-0.5*c,0)),1),b=Math.ceil(Math.min(this._position+0.5*c)),this._thumbnails.length<b&&(b=this._thumbnails.length)}for(var d=a;b>=d;d++){this._thumbnails[d-1].load()}}},setActive:function(a){this._slide.find(".fr-thumbnail-active").removeClass("fr-thumbnail-active");var b=a&&this._thumbnails[a-1];b&&b.activate()},refresh:function(){this._position&&this.setPosition(this._position)}};$.extend(Thumbnail.prototype,{initialize:function(a,b){this.view=a,this._dimension={},this._position=b,this.preBuild()},preBuild:function(){this.thumbnail=$("<div>").addClass("fr-thumbnail").data("fr-position",this._position)},build:function(){if(!this.thumbnailFrame){var a=this.view.options;Thumbnails._slide.append(this.thumbnailFrame=$("<div>").addClass("fr-thumbnail-frame").append(this.thumbnail.append(this.thumbnailWrapper=$("<div>").addClass("fr-thumbnail-wrapper")))),"image"==this.view.type&&this.thumbnail.addClass("fr-load-thumbnail").data("thumbnail",{view:this.view,src:a.thumbnail||this.view.url});var b=a.thumbnail&&a.thumbnail.icon;b&&this.thumbnail.append($("<div>").addClass("fr-thumbnail-icon fr-thumbnail-icon-"+b));var c;this.thumbnail.append(c=$("<div>").addClass("fr-thumbnail-overlay").append($("<div>").addClass("fr-thumbnail-overlay-background")).append(this.loading=$("<div>").addClass("fr-thumbnail-loading").append($("<div>").addClass("fr-thumbnail-loading-background")).append(this.spinner=$("<div>").addClass("fr-thumbnail-spinner").hide().append($("<div>").addClass("fr-thumbnail-spinner-spin")))).append($("<div>").addClass("fr-thumbnail-overlay-border"))),this.thumbnail.append($("<div>").addClass("fr-thumbnail-state")),this.resize()}},remove:function(){this.thumbnailFrame&&(this.thumbnailFrame.remove(),this.thumbnailFrame=null,this.image=null),this.ready&&(this.ready.abort(),this.ready=null),this.vimeoThumbnail&&(this.vimeoThumbnail.abort(),this.vimeoThumbnail=null),this._loading=!1,this._removed=!0,this.view=null,this._clearDelay()},load:function(){if(!(this._loaded||this._loading||this._removed)){this.thumbnailWrapper||this.build(),this._loading=!0;var a=this.view.options.thumbnail,b=a&&"boolean"==$.type(a)?this.view.url:a||this.view.url;if(this._url=b,b){if("vimeo"==this.view.type){if(b==a){this._url=b,this._load(this._url)}else{switch(this.view.type){case"vimeo":this.vimeoThumbnail=new VimeoThumbnail(this.view.url,$.proxy(function(a){this._url=a,this._load(a)},this),$.proxy(function(){this._error()},this))}}}else{this._load(this._url)}}}},activate:function(){this.thumbnail.addClass("fr-thumbnail-active")},_load:function(a){this.thumbnailWrapper.prepend(this.image=$("<img>").addClass("fr-thumbnail-image").attr({src:a}).css({opacity:0.0001})),this.fadeInSpinner(),this.ready=new ImageReady(this.image[0],$.proxy(function(a){var b=a.img;this.thumbnailFrame&&this._loading&&(this._loaded=!0,this._loading=!1,this._dimensions={width:b.naturalWidth,height:b.naturalHeight},this.resize(),this.show())},this),$.proxy(function(){this._error()},this),{method:this.view.options.loadedMethod})},_error:function(){this._loaded=!0,this._loading=!1,this.thumbnail.addClass("fr-thumbnail-error"),this.image.hide(),this.thumbnailWrapper.append($("<div>").addClass("fr-thumbnail-image")),this.show()},fadeInSpinner:function(){if(Spinner.supported&&this.view.options.spinner){this._clearDelay();var a=this.view.options.effects.thumbnail;this._delay=setTimeout($.proxy(function(){this.spinner.stop(!0).fadeTo(a.show||0,1)},this),this.view.options.spinnerDelay||0)}},show:function(){this._clearDelay();var a=this.view.options.effects.thumbnail;this.loading.stop(!0).delay(a.delay).fadeTo(a.show,0)},_clearDelay:function(){this._delay&&(clearTimeout(this._delay),this._delay=null)},resize:function(){if(this.thumbnailFrame){var a="horizontal"==Thumbnails._orientation;if(this.thumbnailFrame.css({width:Thumbnails._vars.thumbnailFrame[a?"width":"height"],height:Thumbnails._vars.thumbnailFrame[a?"height":"width"]}),this.thumbnailFrame.css({top:a?0:Thumbnails._vars.thumbnailFrame.width*(this._position-1),left:a?Thumbnails._vars.thumbnailFrame.width*(this._position-1):0}),this.thumbnailWrapper){var b=Thumbnails._vars.thumbnail;if(this.thumbnail.css({width:b.width,height:b.height,"margin-top":Math.round(-0.5*b.height),"margin-left":Math.round(-0.5*b.width),"margin-bottom":0,"margin-right":0}),this._dimensions){var c,d={width:b.width,height:b.height},e=Math.max(d.width,d.height),f=$.extend({},this._dimensions);if(f.width>d.width&&f.height>d.height){c=Fit.within(d,f);var g=1,h=1;c.width<d.width&&(g=d.width/c.width),c.height<d.height&&(h=d.height/c.height);var i=Math.max(g,h);i>1&&(c.width*=i,c.height*=i),$.each("width height".split(" "),function(a,b){c[b]=Math.round(c[b])})}else{c=Fit.within(this._dimensions,f.width<d.width||f.height<d.height?{width:e,height:e}:d)}var j=Math.round(0.5*d.width-0.5*c.width),k=Math.round(0.5*d.height-0.5*c.height);this.image.removeAttr("style").css($.extend({},c,{top:k,left:j}))}}}}});var UI={_modes:["fullclick","outside","inside"],_ui:!1,_validClickTargetSelector:[".fr-content-element",".fr-content",".fr-content > .fr-stroke",".fr-content > .fr-stroke .fr-stroke-color"].join(", "),initialize:function(a){$.each(this._modes,$.proxy(function(a,b){this[b].initialize()},this)),Window.element.addClass("fr-ui-inside-hidden fr-ui-fullclick-hidden")},set:function(a){this._ui&&(Window.element.removeClass("fr-window-ui-"+this._ui),Overlay.element.removeClass("fr-overlay-ui-"+this._ui)),Window.element.addClass("fr-window-ui-"+a),Overlay.element.addClass("fr-overlay-ui-"+a),this._enabled&&this._ui&&this._ui!=a&&(this[this._ui].disable(),this[a].enable(),UI[a].show()),this._ui=a},_onWindowResize:function(){Support.mobileTouch&&this.show()},enable:function(){$.each(this._modes,$.proxy(function(a,b){UI[b][b==this._ui?"enable":"disable"]()},this)),this._enabled=!0},disable:function(){$.each(this._modes,$.proxy(function(a,b){UI[b].disable()},this)),this._enabled=!1},adjustPrevNext:function(a,b){UI[this._ui].adjustPrevNext(a,b)},show:function(a,b){UI[this._ui].show(a,b)},hide:function(a,b){UI[this._ui].hide(a,b)},reset:function(){$.each(this._modes,$.proxy(function(a,b){UI[b].reset()},this))},update:function(){var a=Pages.page;a&&this.set(a._ui)}};return UI.fullclick={initialize:function(){this.build(),this._scrollLeft=-1},build:function(){Window._box.append(this._previous=$("<div>").addClass("fr-side fr-side-previous fr-side-previous-fullclick fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._next=$("<div>").addClass("fr-side fr-side-next fr-side-next-fullclick fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._close=$("<div>").addClass("fr-close fr-close-fullclick").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),Browser.IE&&Browser.IE<=7&&this._previous.add(this._next).add(this._close).hide(),this._close.on("click",$.proxy(function(a){a.preventDefault(),Window.hide()},this)),this._previous.on("click",$.proxy(function(a){Window.previous(),this._onMouseMove(a)},this)),this._next.on("click",$.proxy(function(a){Window.next(),this._onMouseMove(a)},this))},enable:function(){this.bind()},disable:function(){this.unbind()},reset:function(){Window.timers.clear("ui-fullclick"),this._x=-1,this._y=-1,this._scrollLeft=-1,this.resetPrevNext(),this._onMouseLeave()},resetPrevNext:function(){var a=this._previous.add(this._next);a.stop(!0).removeAttr("style")},bind:function(){this._onMouseUpHandler||(this.unbind(),Window._pages.on("mouseup",".fr-container",this._onMouseUpHandler=$.proxy(this._onMouseUp,this)),Support.mobileTouch||(Window.element.on("mouseenter",this._showHandler=$.proxy(this.show,this)).on("mouseleave",this._hideHandler=$.proxy(this.hide,this)),Window.element.on("mousemove",this._mousemoveHandler=$.proxy(function(a){var b=a.pageX,c=a.pageY;this._hoveringSideButton||c==this._y&&b==this._x||(this._x=b,this._y=c,this.show(),this.startTimer())},this)),Window._pages.on("mousemove",".fr-container",this._onMouseMoveHandler=$.proxy(this._onMouseMove,this)).on("mouseleave",".fr-container",this._onMouseLeaveHandler=$.proxy(this._onMouseLeave,this)).on("mouseenter",".fr-container",this._onMouseEnterHandler=$.proxy(this._onMouseEnter,this)),Window.element.on("mouseenter",".fr-side",this._onSideMouseEnterHandler=$.proxy(this._onSideMouseEnter,this)).on("mouseleave",".fr-side",this._onSideMouseLeaveHandler=$.proxy(this._onSideMouseLeave,this)),$(window).on("scroll",this._onScrollHandler=$.proxy(this._onScroll,this))))},unbind:function(){this._onMouseUpHandler&&(Window._pages.off("mouseup",".fr-container",this._onMouseUpHandler),this._onMouseUpHandler=null,this._showHandler&&(Window.element.off("mouseenter",this._showHandler).off("mouseleave",this._hideHandler).off("mousemove",this._mousemoveHandler),Window._pages.off("mousemove",".fr-container",this._onMouseMoveHandler).off("mouseleave",".fr-container",this._onMouseLeaveHandler).off("mouseenter",".fr-container",this._onMouseEnterHandler),Window.element.off("mouseenter",".fr-side",this._onSideMouseEnterHandler).off("mouseleave",".fr-side",this._onSideMouseLeaveHandler),$(window).off("scroll",this._onScrollHandler),this._showHandler=null))},adjustPrevNext:function(a,b){var c=Pages.page;if(!c){return void (a&&a())}var d=Window.element.is(":visible");d||Window.element.show();var e=this._previous.attr("style");this._previous.removeAttr("style");var f=parseInt(this._previous.css("margin-top"));this._previous.attr({style:e}),d||Window.element.hide();var g=c._infoHeight||0,h=this._previous.add(this._next),i={"margin-top":f-0.5*g},j="number"==$.type(b)?b:Pages.page&&Pages.page.view.options.effects.content.show||0;this.opening&&(j=0),h.stop(!0).animate(i,j,a),this._previous[(Window.mayPrevious()?"remove":"add")+"Class"]("fr-side-disabled"),this._next[(Window.mayNext()?"remove":"add")+"Class"]("fr-side-disabled"),h[(c._total<2?"add":"remove")+"Class"]("fr-side-hidden"),a&&a()},_onScroll:function(){this._scrollLeft=$(window).scrollLeft()},_onMouseMove:function(a){if(!Support.mobileTouch){var b=this._getEventSide(a),c=_.String.capitalize(b),d=b?Window["may"+c]():!1;if(b!=this._hoveringSide||d!=this._mayClickHoveringSide){switch(this._hoveringSide=b,this._mayClickHoveringSide=d,Window._box[(d?"add":"remove")+"Class"]("fr-hovering-clickable"),b){case"previous":Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");break;case"next":Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")}}}},_onMouseLeave:function(a){Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),this._hoveringSide=!1},_onMouseUp:function(a){if(!(a.which>1)){if(1==Pages.pages.length){return void Window.hide()}var b=this._getEventSide(a);Window[b](),this._onMouseMove(a)}},_onMouseEnter:function(a){this._onMouseMove(a)},_getEventSide:function(a){var b=(this._scrollLeft>-1?this._scrollLeft:this._scrollLeft=$(window).scrollLeft(),a.pageX-Window._boxPosition.left-this._scrollLeft),c=Window._boxDimensions.width;return 0.5*c>b?"previous":"next"},_onSideMouseEnter:function(a){this._hoveringSideButton=!0,this._hoveringSide=this._getEventSide(a),this._mayClickHoveringSide=Window["may"+_.String.capitalize(this._hoveringSide)](),this.clearTimer()},_onSideMouseLeave:function(a){this._hoveringSideButton=!1,this._hoveringSide=!1,this._mayClickHoveringSide=!1,this.startTimer()},show:function(a){return this._visible?(this.startTimer(),void ("function"==$.type(a)&&a())):(this._visible=!0,this.startTimer(),Window.element.addClass("fr-visible-fullclick-ui").removeClass("fr-hidden-fullclick-ui"),Browser.IE&&Browser.IE<=7&&this._previous.add(this._next).add(this._close).show(),void ("function"==$.type(a)&&a()))},hide:function(a){var b=Pages.page&&Pages.page.view.type;return !this._visible||b&&("youtube"==b||"vimeo"==b)?void ("function"==$.type(a)&&a()):(this._visible=!1,Window.element.removeClass("fr-visible-fullclick-ui").addClass("fr-hidden-fullclick-ui"),void ("function"==$.type(a)&&a()))},clearTimer:function(){Support.mobileTouch||Window.timers.clear("ui-fullclick")},startTimer:function(){Support.mobileTouch||(this.clearTimer(),Window.timers.set("ui-fullclick",$.proxy(function(){this.hide()},this),Window.view?Window.view.options.uiDelay:0))}},UI.inside={initialize:function(){},enable:function(){this.bind()},disable:function(){this.unbind()},bind:function(){this._onMouseUpHandler||(this.unbind(),Window._pages.on("mouseup",".fr-content",this._onMouseUpHandler=$.proxy(this._onMouseUp,this)),Window._pages.on("click",".fr-content .fr-close",$.proxy(function(a){a.preventDefault(),Window.hide()},this)).on("click",".fr-content .fr-side-previous",$.proxy(function(a){Window.previous(),this._onMouseMove(a)},this)).on("click",".fr-content .fr-side-next",$.proxy(function(a){Window.next(),this._onMouseMove(a)},this)),Window.element.on("click",".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper",this._delegateOverlayCloseHandler=$.proxy(this._delegateOverlayClose,this)),Support.mobileTouch||(Window.element.on("mouseenter",".fr-content",this._showHandler=$.proxy(this.show,this)).on("mouseleave",".fr-content",this._hideHandler=$.proxy(this.hide,this)),Window.element.on("mousemove",".fr-content",this._mousemoveHandler=$.proxy(function(a){var b=a.pageX,c=a.pageY;this._hoveringSideButton||c==this._y&&b==this._x||(this._x=b,this._y=c,this.show(),this.startTimer())},this)),Window._pages.on("mousemove",".fr-info, .fr-close",$.proxy(function(a){a.stopPropagation(),this._onMouseLeave(a)},this)),Window._pages.on("mousemove",".fr-info",$.proxy(function(a){this.clearTimer()},this)),Window._pages.on("mousemove",".fr-content",this._onMouseMoveHandler=$.proxy(this._onMouseMove,this)).on("mouseleave",".fr-content",this._onMouseLeaveHandler=$.proxy(this._onMouseLeave,this)).on("mouseenter",".fr-content",this._onMouseEnterHandler=$.proxy(this._onMouseEnter,this)),Window.element.on("mouseenter",".fr-side",this._onSideMouseEnterHandler=$.proxy(this._onSideMouseEnter,this)).on("mouseleave",".fr-side",this._onSideMouseLeaveHandler=$.proxy(this._onSideMouseLeave,this)),$(window).on("scroll",this._onScrollHandler=$.proxy(this._onScroll,this))))},unbind:function(){this._onMouseUpHandler&&(Window._pages.off("mouseup",".fr-content",this._onMouseUpHandler),this._onMouseUpHandler=null,Window._pages.off("click",".fr-content .fr-close").off("click",".fr-content .fr-side-previous").off("click",".fr-content .fr-side-next"),Window.element.off("click",".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper",this._delegateOverlayCloseHandler),this._showHandler&&(Window.element.off("mouseenter",".fr-content",this._showHandler).off("mouseleave",".fr-content",this._hideHandler).off("mousemove",".fr-content",this._mousemoveHandler),Window._pages.off("mousemove",".fr-info, .fr-close"),Window._pages.off("mousemove",".fr-info"),Window._pages.off("mousemove",".fr-content-element",this._onMouseMoveHandler).off("mouseleave",".fr-content",this._onMouseLeaveHandler).off("mouseenter",".fr-content",this._onMouseEnterHandler),Window.element.off("mouseenter",".fr-side",this._onSideMouseEnterHandler).off("mouseleave",".fr-side",this._onSideMouseLeaveHandler),$(window).off("scroll",this._onScrollHandler),this._showHandler=null))},reset:function(){Window.timers.clear("ui-fullclick"),this._x=-1,this._y=-1,this._scrollLeft=-1,this._hoveringSide=!1,this._onMouseLeave()},adjustPrevNext:function(a){a&&a()},_onScroll:function(){this._scrollLeft=$(window).scrollLeft()},_delegateOverlayClose:function(a){var b=Pages.page;b&&b.view.options.overlay&&!b.view.options.overlay.close||$(a.target).is(".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper")&&(a.preventDefault(),a.stopPropagation(),Window.hide())},_onMouseMove:function(a){if(!Support.mobileTouch){var b=this._getEventSide(a),c=_.String.capitalize(b),d=b?Window["may"+c]():!1;if((1==Pages.pages.length||Pages.page&&"close"==Pages.page.view.options.onClick)&&(b=!1),b!=this._hoveringSide||d!=this._mayClickHoveringSide){if(this._hoveringSide=b,this._mayClickHoveringSide=d,b){switch(Window._box[(d?"add":"remove")+"Class"]("fr-hovering-clickable"),b){case"previous":Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");break;case"next":Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")}}else{Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next")}}}},_onMouseLeave:function(a){Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),this._hoveringSide=!1},_onMouseUp:function(a){if(!(a.which>1)&&$(a.target).is(UI._validClickTargetSelector)){if(1==Pages.pages.length||Pages.page&&"close"==Pages.page.view.options.onClick){return void Window.hide()}var b=this._getEventSide(a);Window[b](),this._onMouseMove(a)}},_onMouseEnter:function(a){this._onMouseMove(a)},_getEventSide:function(a){var b=(this._scrollLeft>-1?this._scrollLeft:this._scrollLeft=$(window).scrollLeft(),a.pageX-Window._boxPosition.left-this._scrollLeft),c=Window._boxDimensions.width;return 0.5*c>b?"previous":"next"},_onSideMouseEnter:function(a){this._hoveringSideButton=!0,this._hoveringSide=this._getEventSide(a),this._mayClickHoveringSide=Window["may"+_.String.capitalize(this._hoveringSide)](),this.clearTimer()},_onSideMouseLeave:function(a){this._hoveringSideButton=!1,this._hoveringSide=!1,this._mayClickHoveringSide=!1,this.startTimer()},show:function(a){return this._visible?(this.startTimer(),void ("function"==$.type(a)&&a())):(this._visible=!0,this.startTimer(),Window.element.addClass("fr-visible-inside-ui").removeClass("fr-hidden-inside-ui"),void ("function"==$.type(a)&&a()))},hide:function(a){return this._visible?(this._visible=!1,Window.element.removeClass("fr-visible-inside-ui").addClass("fr-hidden-inside-ui"),void ("function"==$.type(a)&&a())):void ("function"==$.type(a)&&a())},clearTimer:function(){Support.mobileTouch||Window.timers.clear("ui-inside")},startTimer:function(){Support.mobileTouch||(this.clearTimer(),Window.timers.set("ui-inside",$.proxy(function(){this.hide()},this),Window.view?Window.view.options.uiDelay:0))}},UI.outside={initialize:function(){this.build(),this._scrollLeft=-1},build:function(){Window._box.append(this._previous=$("<div>").addClass("fr-side fr-side-previous fr-side-previous-outside").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._next=$("<div>").addClass("fr-side fr-side-next fr-side-next-outside").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._close=$("<div>").addClass("fr-close fr-close-outside").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),Browser.IE&&Browser.IE<=7&&this._previous.add(this._next).add(this._close).hide(),this._close.on("click",$.proxy(function(a){a.preventDefault(),Window.hide()},this)),this._previous.on("click",$.proxy(function(a){Window.previous(),this._onMouseMove(a)},this)),this._next.on("click",$.proxy(function(a){Window.next(),this._onMouseMove(a)},this))},enable:function(){this.bind()},disable:function(){this.unbind()},reset:function(){Window.timers.clear("ui-outside"),this._x=-1,this._y=-1,this._scrollLeft=-1,this._onMouseLeave()},bind:function(){this._onMouseUpHandler||(this.unbind(),Window.element.on("mouseup",".fr-content",this._onMouseUpHandler=$.proxy(this._onMouseUp,this)),Window.element.on("click",".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper",this._delegateOverlayCloseHandler=$.proxy(this._delegateOverlayClose,this)),Support.mobileTouch||(Window._pages.on("mousemove",".fr-content",this._onMouseMoveHandler=$.proxy(this._onMouseMove,this)).on("mouseleave",".fr-content",this._onMouseLeaveHandler=$.proxy(this._onMouseLeave,this)).on("mouseenter",".fr-content",this._onMouseEnterHandler=$.proxy(this._onMouseEnter,this)),Window.element.on("mouseenter",".fr-side",this._onSideMouseEnterHandler=$.proxy(this._onSideMouseEnter,this)).on("mouseleave",".fr-side",this._onSideMouseLeaveHandler=$.proxy(this._onSideMouseLeave,this)),$(window).on("scroll",this._onScrollHandler=$.proxy(this._onScroll,this))))},unbind:function(){this._onMouseUpHandler&&(Window.element.off("mouseup",".fr-content",this._onMouseUpHandler),this._onMouseUpHandler=null,Window.element.off("click",".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper",this._delegateOverlayCloseHandler),this._onMouseMoveHandler&&(Window._pages.off("mousemove",".fr-content",this._onMouseMoveHandler).off("mouseleave",".fr-content",this._onMouseLeaveHandler).off("mouseenter",".fr-content",this._onMouseEnterHandler),Window.element.off("mouseenter",".fr-side",this._onSideMouseEnterHandler).off("mouseleave",".fr-side",this._onSideMouseLeaveHandler),$(window).off("scroll",this._onScrollHandler),this._onMouseMoveHandler=null))},adjustPrevNext:function(a,b){var c=Pages.page;if(!c){return void (a&&a())}var d=this._previous.add(this._next);this._previous[(Window.mayPrevious()?"remove":"add")+"Class"]("fr-side-disabled"),this._next[(Window.mayNext()?"remove":"add")+"Class"]("fr-side-disabled"),d[(c._total<2?"add":"remove")+"Class"]("fr-side-hidden"),a&&a()},_onScroll:function(){this._scrollLeft=$(window).scrollLeft()},_delegateOverlayClose:function(a){var b=Pages.page;b&&b.view.options.overlay&&!b.view.options.overlay.close||$(a.target).is(".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper")&&(a.preventDefault(),a.stopPropagation(),Window.hide())},_onMouseMove:function(a){if(!Support.mobileTouch){var b=this._getEventSide(a),c=_.String.capitalize(b),d=b?Window["may"+c]():!1;if((1==Pages.pages.length||Pages.page&&"close"==Pages.page.view.options.onClick)&&(b=!1),b!=this._hoveringSide||d!=this._mayClickHoveringSide){if(this._hoveringSide=b,this._mayClickHoveringSide=d,b){switch(Window._box[(d?"add":"remove")+"Class"]("fr-hovering-clickable"),b){case"previous":Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");break;case"next":Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")}}else{Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next")}}}},_onMouseLeave:function(a){Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),this._hoveringSide=!1},_onMouseUp:function(a){if(!(a.which>1)&&$(a.target).is(UI._validClickTargetSelector)){if(1==Pages.pages.length||Pages.page&&"close"==Pages.page.view.options.onClick){return void Window.hide()}var b=this._getEventSide(a);Window[b](),this._onMouseMove(a)}},_onMouseEnter:function(a){this._onMouseMove(a)},_getEventSide:function(a){var b=(this._scrollLeft>-1?this._scrollLeft:this._scrollLeft=$(window).scrollLeft(),a.pageX-Window._boxPosition.left-this._scrollLeft),c=Window._boxDimensions.width;return 0.5*c>b?"previous":"next"},show:function(){Browser.IE&&Browser.IE<=7&&this._previous.add(this._next).add(this._close).show()},hide:function(){},_onSideMouseEnter:function(a){this._hoveringSideButton=!0,this._hoveringSide=this._getEventSide(a),this._mayClickHoveringSide=Window["may"+_.String.capitalize(this._hoveringSide)]()},_onSideMouseLeave:function(a){this._hoveringSideButton=!1,this._hoveringSide=!1,this._mayClickHoveringSide=!1},clearTimer:function(){}},$(document).ready(function(a){_Fresco.initialize()}),Fresco});
jQuery(document).ready(function($) {
    $(window).resize( function(){
            $(".slider").owlCarousel({
                items: 3,
                nav: false,
                responsive: true,
                lazyLoad: true,
                autoPlay : 5000,
                stopOnHover: true,
            });

            $(".post-slider").owlCarousel({
                items: 3,
                nav: false,
                responsive: true,
                lazyLoad: true,
                autoPlay : 5000,
                stopOnHover: true,
            });
        });
        $(".twitter-feed").owlCarousel({
            paginationSpeed : 400,
            singleItem: true,
            autoPlay : 4000,
            stopOnHover: true,
        });
        $(window).resize();
        $('#sticky').scrollToFixed();
        Placeholdem( document.querySelectorAll( '[placeholder]' ) );

        $('#open-button').click(function(){
            $('body').addClass('show-menu');
        });

        $('#close-button').click(function(){
            $('body').removeClass('show-menu');
        });

        $('#facebook__share').click(function(){
            var urlToBePosted = 'http://hangi.club'+$('#urlToBePosted').val();
            FB.ui(
                {
                    method: 'share',
                    href: urlToBePosted
                }, function(response){});
        });
});