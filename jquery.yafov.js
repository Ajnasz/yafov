/**
 * yafov
 * http://www.gnu.org/licenses/gpl.html
 * A fork of https://github.com/dilvie/h5Validate
 */

/*global jQuery, window */
/*jslint browser: true, devel: true, onevar: true, undef: true, nomen: true,
        eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
(function ($) {
    var yafov = { // Public API
        defaults: {
            debug: false,

            // HTML5-compatible validation pattern library that can be extended and/or overriden.
            //** TODO: Test the new regex patterns. Should I apply these to the new input types?
            patternLibrary: {
                // **TODO: password
                phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/,

                // Shamelessly lifted from Scott Gonzalez via the Bassistance
                // Validation plugin
                // http://projects.scottsplayground.com/email_address_validation/
                email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

                // Shamelessly lifted from Scott Gonzalez via the Bassistance
                // Validation plugin http://projects.scottsplayground.com/iri/
                url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

                // Number, including positive, negative, and floating decimal. Credit: bassistance
                number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

                // Date in ISO format. Credit: bassistance
                dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,

                alpha: /[a-zA-Z]+/,
                alphaNumeric: /\w+/,
                integer: /-?\d+/
            },

            // Setup KB event delegation.
            kbSelectors: 'input:not([type="submit"]), select, textarea',
            focusout: true,
            focusin: false,
            change: true,
            keyup: false,

            // Setup mouse event delegation.
            mSelectors: '[type="range"], :radio, :checkbox, select, option',
            click: true,

            activeKeyup: true,

            stripMarkup: true,

            // Validate on submit?
            // **TODO: This isn't implemented, yet.
            submit: true,

            // Callback stubs
            invalidCallback: function () {},
            validCallback: function () {},

            // When submitting, validate elements that haven't been validated yet?
            validateOnSubmit: true,

            // Elements to validate with allValid (only validating visible elements)
            allValidSelectors: 'input:visible, textarea:visible, select:visible'
        }
    },
    // Aliases
    defaults = yafov.defaults,
    patternLibrary = defaults.patternLibrary,

    // Object represents a validation result
    ValidationResult = function (isValid, reason, field) {
        return {
            isValid: isValid,
            reason: reason,
            field: field
        };
    },

    validatorMethods = {},

    addMethod = function (selector, reason, fn) {
        validatorMethods[reason] = {
            selector: selector,
            fn: fn,
            reason: reason
        };
    },

    validateWith = function validateWith(element, reason, value) {
        var isValid, $this;
        if (typeof validatorMethods[reason] !== 'undefined') {
            $this = $(element);
            value = value || ($this.is('[type=checkbox]') || $this.is('[type=radio]')) ?
                        $this.is(':checked') :
                        $this.val();
            isValid = validatorMethods[reason].fn(value, $this);
        }
        return isValid;
    },

    isOptional = function isOptional(element, value) {
        return !element.is('[required],.required') && value === '';
    },

    validateElement = function (element) {
        var $this = $(element),

        value = ($this.is('[type=checkbox]') || $this.is('[type=radio]')) ?
                $this.is(':checked') :
                $this.val(),
        // Add the hash for convenience. This is done in two steps to avoid
        // two attribute lookups.
        isValid = true,
        reason = '',
        result;
        $.each(validatorMethods, function (name, validator) {
            if ($this.is(validator.selector)) {
                isValid = validateWith($this, name);
                if (!isValid) {
                    reason = validator.reason;
                    return false;
                }
            }
        });
        result = new ValidationResult(isValid, reason, $this.get(0));
        return result;
    },

    methods = {
        validate: function (element) {
            var $element = $(element),
                result = validateElement($element.get(0));
            if (result.isValid) {
                $element.trigger('validfound', result);
            } else {
                $element.trigger('invalidfound', result);
            }
            return result;
        },

        /**
        * Take the event preferences and delegate the events to selected
        * objects.
        *
        * @param {object} eventFlags The object containing event flags.
        *
        * @returns {element} The passed element (for method chaining).
        */
        delegateEvents: function (selectors, eventFlags, element, settings) {
            var events = [],
              key, validate;

            validate = function () {
                var result = methods.validate(this);
            };
            $.each(eventFlags, function (key, value) {
                if (value) {
                    events[key] = key;
                }
            });
            key = 0;
            for (key in events) {
                if (events.hasOwnProperty(key)) {
                    $(element).delegate(selectors, events[key] + '.yafov', validate);
                }
            }
            return element;
        },
        /**
        * Prepare for event delegation.
        *
        * @param {object} settings The full plugin state, including
        * options.
        *
        * @returns {object} jQuery object for chaining.
        */
        bindDelegation: function (settings) {
            this.filter('form').attr('novalidate', 'novalidate');
            this.find('form').attr('novalidate', 'novalidate');
            this.parents('form').attr('novalidate', 'novalidate');

            this.submit(function (e) {
                console.log('submit');
                e.preventDefault();
                var valid = true,
                    form = $(this),
                    errors = [],
                    collectInvalids;

                collectInvalids = function () {
                    var result = methods.validate(this);
                    valid = valid && result.isValid;
                    if (result.isValid !== true) {
                        errors.push(result);
                    }
                };
                form.find(settings.kbSelectors + ',' +
                  settings.mSelectors + ',' +
                  settings.activeClassSelector).each(collectInvalids);
                if (valid) {
                    errors = null;
                    form.trigger('formvalid');
                } else {
                    form.trigger('forminvalid', {errors: errors});
                }
            });

            return this.each(function () {
                var kbEvents = {
                    focusout: settings.focusout,
                    focusin: settings.focusin,
                    change: settings.change,
                    keyup: settings.keyup
                },
                mEvents = {
                    click: settings.click
                };

                settings.delegateEvents(settings.kbSelectors, kbEvents, this, settings);
                settings.delegateEvents(settings.mSelectors, mEvents, this, settings);
            });
        }
    };

    $.yafov = {
        /**
        * Take a map of pattern names and HTML5-compatible regular
        * expressions, and add them to the patternLibrary. Patterns in
        * the library are automatically assigned to HTML element pattern
        * attributes for validation.
        *
        * @param {Object} patterns A map of pattern names and HTML5 compatible
        * regular expressions.
        *
        * @returns {Object} patternLibrary The modified pattern library
        */
        addPatterns: function (patterns) {
            var patternLibrary = defaults.patternLibrary,
                key;
            for (key in patterns) {
                if (patterns.hasOwnProperty(key)) {
                    patternLibrary[key] = patterns[key];
                }
            }
            return patternLibrary;
        },
        validate: function (element) {
            return methods.validate(element);
        },
        elementIsValid: function (element) {
            return validateElement(element).isValid;
        },
        validateWith: function (element, reason, value) {
            return validateWith(element, reason, value);
        }
    };

    $.fn.yafov = function (options) {
        // Combine defaults and options to get current settings.
        var settings = $.extend({}, defaults, options, methods),
            action,
            args;

        // Expose public API.
        $.extend($.fn.yafov, yafov);

        if (typeof options === 'string' && typeof methods[options] === 'function') {
            args = $.makeArray(arguments);
            action = options;
            args.shift();
            args = $.merge(args, [settings]);

            return settings[action].apply(this, args);
        }

        // Returning the jQuery object allows for method chaining.
        return methods.bindDelegation.call(this, settings);
    };

    $([
        ['[required],.required', 'required', function (value, element) {
            return !!value;
        }],
        ['[type="url"],.url', 'url', function (value, element) {
            return isOptional(element, value) || yafov.defaults.patternLibrary.url.test(value);
        }],
        ['[type="email"],.email', 'email', function (value, element) {
            return isOptional(element, value) || yafov.defaults.patternLibrary.email.test(value);
        }],
        ['[type="tel"],.tel', 'tel', function (value, element) {
            return isOptional(element, value) || yafov.defaults.patternLibrary.phone.test(value);
        }],
        ['[type="number"],.number', 'number', function (value, element) {
            // +null returns 0
            return isOptional(element, value) || value !== null && !isNaN(+value);
        }],
        ['[max],.max', 'max', function (value, element) {
            // +null returns 0
            var optional = isOptional(element, value),
                valid = true,
                maxVal;
            if (!optional) {
                if (element.is('[max]')) {
                    maxVal = element.attr('max');
                } else {
                    maxVal = element.attr('data-max');
                }
                valid = +maxVal >= +value && validateWith(element, 'number', value);
            }
            return valid;
        }],
        ['[min],.min', 'min', function (value, element) {

            var optional = isOptional(element, value),
                valid = true,
                minVal;

            if (!optional) {
                if (element.is('[min]')) {
                    minVal = element.attr('min');
                } else {
                    minVal = element.attr('data-min');
                }
                valid = +minVal <= +value && validateWith(element, 'number', value);
            }
            return valid;
        }],
        // hovewer min and max will validate it
        ['[range],.range', 'range', function (value, element) {
            return true;
            /*
            var optional = isOptional(element, value),
                valid = true;
            if (!optional) {
                valid = validateWith(element, 'min', value) &&
                    validateWith(element, 'max', value);
            }
            return valid;
            */
        }],
        ['.alpha', 'alpha', function (value, element) {
            return isOptional(element, value) || yafov.defaults.patternLibrary.alpha.test(value);
        }],
        ['.alphanumeric', 'alphanumeric', function (value, element) {
            return isOptional(element, value) ||
                    yafov.defaults.patternLibrary.alphanumeric.test(value);
        }]
    ]).each(function () {
        addMethod.apply(null, this);
    });
}(jQuery));
