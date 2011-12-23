/*
Copyright (c) 2011 Lajos Koszti http://ajnasz.hu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/**
 * yafov
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
            kbSelectors: ':input:not(:submit,:button)',
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

    validatorMethods = (function () {
        var methods = [],
            groupMethods = [],
            /* an object to store the method indexes by their name */
            methodsByName = {},
            groupMethodsByName = {},
            interf = {
                /**
                 * When we add a new validator a name must be given. If a
                 * validator already exists with the same name, it will be
                 * overwritten
                 * @param String name the name of the validator, eg.: required, number
                 * @param jQuerySelectorString selector The selector of the
                 * element what should match. Only those elements will be
                 * validated which are matching to this selector (see
                 * $(element).is('selector'))
                 * @param Function fn The validator function. The function must handle 3 arguments:
                 * value: the current value of the element: which the
                 *   $(element).val() except for checboxes and radio fields,
                 *   because then $(element).is(':checked')
                 * element: the element which needs to be validated (jQuery object)
                 * callback: a callback function what you should call when you
                 *   figured out that the element is valid or not. You must
                 *   pass the result as a boolean. It must bee true if the
                 *   field is valid or false if it's invalid
                 */
                add: function (selector, name, fn) {
                    var existIndex, index, item;

                    existIndex = interf.indexByName(name);
                    index = existIndex > -1 ? existIndex : methods.length;
                    item = {
                        selector: selector,
                        fn: fn,
                        name: name
                    };
                    methodsByName[name] = index;
                    methods[index] = item;
                },
                /**
                 * When we add a new validator a name must be given. If a
                 * validator already exists with the same name, it will be
                 * overwritten
                 * @param String name the name of the validator, eg.: required, number
                 * @param jQuerySelectorString selector The selector of the
                 * element what should match. Only those elements will be
                 * validated which are matching to this selector (see
                 * $(element).is('selector'))
                 * @param Function fn The validator function. The function must handle 3 arguments:
                 * value: the current value of the element: which the
                 *   $(element).val() except for checboxes,
                 *   because then $(element).is(':checked')
                 * element: the element which needs to be validated (jQuery object)
                 * callback: a callback function what you should call when you
                 *   figured out that the element is valid or not. You must
                 *   pass the result as a boolean. It must bee true if the
                 *   field is valid or false if it's invalid
                 */
                addGroup: function (selector, name, fn, getGroupItems) {
                    var existIndex, index, item;

                    existIndex = interf.indexByName(name, true);
                    index = existIndex > -1 ? existIndex : interf.len(true);
                    item = {
                        selector: selector,
                        fn: fn,
                        name: name,
                        getGroupItems: getGroupItems
                    };
                    groupMethodsByName[name] = index;
                    groupMethods[index] = item;
                },
                /**
                 * method to get the validator object's index by it's name
                 * @param String name the name of the validator
                 * @param Boolean isGroup if true, it will search in group methods
                 */
                indexByName: function (name, isGroup) {
                    var index = isGroup ? groupMethodsByName[name] : methodsByName[name];
                    return typeof index !== 'undefined' ? index : -1;
                },
                /**
                 * method to get the validator object by it's index
                 * @param Int the index of the validator
                 */
                get: function (index, isGroup) {
                    return interf.getAll(isGroup)[index];
                },
                getAll: function (isGroup) {
                    return isGroup ? groupMethods : methods;
                },
                /**
                 * method to get the validator object by it's name
                 * @param String the name of the validator
                 */
                getByName: function (name, isGroup) {
                    return interf.get(interf.indexByName(name, isGroup), isGroup);
                },
                /**
                 * Method to get the number of the validators have added
                 */
                len: function (isGroup) {
                    return isGroup ? groupMethods.length : methods.length;
                }
            };
        // finally return the interface
        return interf;
    }()),

    addMethod = function (selector, name, fn) {
        validatorMethods.add(selector, name, fn);
    },

    addGroupMethod = function (selector, name, fn, getGroupItems) {
        validatorMethods.addGroup(selector, name, fn, getGroupItems);
    },

    /**
     * @param HTMLElement element A input or textarea or select which will be validated
     * @param String name The validator name, defines which validator needs to be used
     * @param String value The current value of the element. Don't
     * need to pass the value, because we will get it if it's not a string, but
     * if you already have it, you can pass it here so we don't need to ask for
     * it again
     * @param Function cb Callback function. This is NOT optional. The third or
     * fourth argument must be the callback. It will receive one argument,
     * which will be a boolean: true if the field is valid, false if not
     */
    validateWith = function validateWith(element, name, cb, value, isGroup) {
        var args = arguments,
            method, callback;

        callback = function (isValid) {
            cb(isValid, element);
        };
        method = validatorMethods.getByName(name, isGroup);

        if (typeof method !== 'undefined') {
            if (isGroup) {
                element = method.getGroupItems(element);
            } else {
                element = $(element);
            }
            if (typeof value !== 'string' && !isGroup) {
                value = (element) ?
                            element.is(':checked') :
                            element.val();
            }
            method.fn(value, element, callback);
        } else {
            callback(true);
        }
    },

    isOptional = function isOptional(element, value) {
        return !element.is('[required],.required') && value === '';
    },

    /* method which finds out if an element belongs to a group */
    isGroupElement = function (element) {
        var groupValidators = validatorMethods.getAll(true),
            gl = groupValidators.length,
            matching = false,
            elem = $(element),
            i;

        for (i = 0; !matching && i < gl; i += 1) {
            matching = elem.is(groupValidators[i].selector);
        }
        return matching;
    },

    /**
     *
     */
    validateElement = function (element, cb) {
        var $this = $(element),

            isGroup = isGroupElement(element),

            // length of the validator methods
            vl = validatorMethods.len(isGroup),
            // loop index: get validators by their index
            index = 0,
            // default result object
            result = {
                isValid: true,
                name: '',
                field: $this,
                isGroup: isGroup
            },
            // method run when a validation finished
            onValidate,
            validatorItemCb,
            value,
            validate;

          // get the value once, so it gonna be cached
        value = ($this.is('[type=checkbox]')) ?  $this.is(':checked') : $this.val();

        validate = function () {
            var validator = validatorMethods.get(index, isGroup);
            // check if need to validate
            if (result.isValid && $this.is(validator.selector)) {
                result.name = validator.name;
                validateWith($this, validator.name, validatorItemCb, value, isGroup);
            } else {
                onValidate();
            }
        };
        onValidate = function () {
            if (index + 1 < vl) {
                index += 1;
                validate();
            } else {
                cb(result);
            }
        };
        // the elem gonna be all the elements which were validated by this validatior action
        // normally it's the same what we pass ($this) to the validateWith
        // function, but when it's a group validator then all of the elements
        // will be listed here
        validatorItemCb = function (valid, validatedElements) {
            // update result
            result.isValid = valid;
            result.field = validatedElements;
            // if not valid make sure we don't run the next validator
            if (!valid) {
                index = vl - 1;
            }
            onValidate();
        };
        validate(index);
    },

    methods = {
        validate: function (element, cb) {
            var $element = $(element);
            validateElement($element.get(0), function (result) {
                if (result.isValid) {
                    $element.trigger('validfound', result);
                } else {
                    $element.trigger('invalidfound', result);
                }
                if (typeof cb === 'function') {
                    cb(result);
                }
            });
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
              $element = $(element),
              key, validate, i, el;

            validate = function (e) {
                methods.validate(this);
            };
            $.each(eventFlags, function (key, value) {
                if (value) {
                    events.push(key);
                }
            });
            key = 0;

            for (i = 0, el = events.length; i < el; i += 1) {
                $element.delegate(selectors, events[i] + '.yafov', validate);
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
            // bind to forms
            this.filter('form').attr('novalidate', 'novalidate')
                .find('form').attr('novalidate', 'novalidate')
                .parents('form').attr('novalidate', 'novalidate');

            this.submit(function (e) {
                // prevent submitting the form before validation
                e.preventDefault();

                var form = $(this),
                    errors = [],
                    groupMethods = validatorMethods.getAll(true),
                    groupSelectors = $.unique($.map(groupMethods, function (method) {
                        return method.selector;
                    })),
                    fieldsValidated = false,
                    groupFieldsValidated = false,
                    fields,
                    groupFields,
                    collectInvalids,
                    groupFieldsArr,
                    finish;

                // if finished both the simple and group validators formvalid
                // or forminvalid events gonna be triggered
                finish = function () {
                    if (fieldsValidated && groupFieldsValidated) {
                        if (errors.length < 1) {
                            errors = null;
                            form.trigger('formvalid');
                        } else {
                            form.trigger('forminvalid', {errors: errors});
                        }
                    }
                };
                collectInvalids = function (fields, group) {
                    var validated = 0;
                    return function () {
                        methods.validate(this, function (result) {
                            if (result.isValid !== true) {
                                errors.push(result);
                            }
                            validated += 1;
                            if (validated >= fields.length) {
                                if (group) {
                                    groupFieldsValidated = true;
                                } else {
                                    fieldsValidated = true;
                                }
                                finish();
                            }
                        });
                    }
                };
                fields = form.find(settings.kbSelectors + ',' +
                  settings.mSelectors + ',' +
                  settings.activeClassSelector).not(groupSelectors.join(','));
                if (fields.length > 0) {
                    fields.each(collectInvalids(fields, false));
                } else {
                    fieldsValidated = true;
                    finish();
                }

                // here comes the slow part
                // first we search for all elements which are belongs to a group validator
                groupFields = form.find(groupSelectors.join(','));
                groupFieldsArr = [];
                // then we go through all of the found elements
                // and keep only one element from each group
                // So a group will be validated only once
                //
                // The best would be if it would be possible to find only the
                // first element for each group by the first time
                // But that would require to make the getGroupItems too
                // complex (which isn't so simple already)
                if (groupFields.length > 0) {
                    groupFields.each(function (gfIndex, field) {
                        // create a jquery object from the field, because in the
                        // collector probably that will be used and then don't need
                        // to get an object each time the getGroupItems method
                        // called
                        var jqField = $(field);
                        $.each(groupMethods, function (gmIndex, method) {
                            var fields = method.getGroupItems(jqField);
                            if (fields.length > 0) {
                                groupFieldsArr.push(fields[0]);
                            }
                        });
                    });
                } else {
                    groupFieldsValidated = true;
                    finish();
                }
                $.each($.unique(groupFieldsArr), collectInvalids(groupFieldsArr, true));
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
         * Validate an element
         * @param HTMLElement element The element what you want to validate
         * @param Function cb Callback function, with one argument which is a
         * result object {isValid: bool, name: validatorName, field: element, isGroup: bool}
         */
        validate: function (element, cb) {
            methods.validate(element, cb);
        },
        /**
         * Checks if an element is valid or not
         * @param HTMLElement element The element what you want to validate
         * @param Function cb Callback function, with one argument, which is a result object
         */
        elementIsValid: function (element, cb) {
            validateElement(element, function (result) {
                cb(result.isValid);
            });
        },
        /**
        * @param jQueryObject element A input or textarea or select which will be validated as jQuery object
        * @param String name The validator name, defines which validator needs to be used
        * @param Function cb Callback function. This is NOT optional. The third or
        * fourth argument must be the callback. It will receive one argument,
        * which will be a boolean: true if the field is valid, false if not
        * @param String value Optional The current value of the element. Don't
        * need to pass the value, because we will get it if it's not a string, but
        * if you already have it, you can pass it here so we don't need to ask for
        * it again
        */
        validateWith: function (element, name, cb, isGroup) {
            validateWith(element, name, cb, null, isGroup);
        },
        /**
         * Adds a new validator method
         * @param jQuerySelecotorString selector jQuery selector string.
         * The selector of the
         * element what should match. Only those elements will be
         * validated which are matching to this selector (see
         * $(element).is('{selector}'))
         * @param String name String the name of the validator, eg.: required,
         * number
         * When we add a new validator a name must be given. If a validator
         * already exists with the same name, the old one will be overwritten
         * @param Function fn The validator function. The function must handle 3 arguments:
         * value: the current value of the element: which the
         * $(element).val() except for checboxes because then $(element).is(':checked')
         * element: the element which needs to be validated (jQuery object)
         * callback: a callback function what you should call when you
         * figured out that the element is valid or not. You must
         * pass the result as a boolean. It must bee true if the
         * field is valid or false if it's invalid
         */
        addMethod: function (selector, name, fn) {
            addMethod(selector, name, fn);
        },
        /**
         * @param jQuerySelectorString selector The selector of the element
         * what should match. Only those elements will be validated which are
         * matching to this selector (see $(element).is('{selector}'))
         * @param String name the name of the validator, eg.: required, number
         * When we add a new validator a name must be given. If a validator
         * already exists with the same name, it will be overwritten
         * @param Function fn The validator function. The function must handle 3 arguments:
         * value: _doesn't make any sense here, would be better to remove, no?_
         * because then $(element).is(':checked')
         * elements: The group of the elements which needs to be validated (jQuery object).
         * callback: a callback function what you should call when you
         * figured out that the element is valid or not. You must
         * pass the result as a boolean. It must bee true if the
         * field is valid or false if it's invalid
         * @param Function getGroupItems The function which collects the
         * elements which are belonging to the same group element: The element
         * which is a member of a group. The method should find the other
         * members of the group and return them as a jQuery object.
         */
        addGroupMethod: function (selector, name, fn, getGroupItems) {
            addGroupMethod(selector, name, fn, getGroupItems);
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
        /*
         * value shouldn't be empty
         * <input type="text" required />
         * <input type="text" class="required" />
         */
        ['[required],.required', 'required', function (value, element, cb) {
            var valid = !!value;
            cb(valid);
        }],
        /*
         * value must be a valid url
         * <input type="url" />
         * <input type="text" class="url" />
         */
        ['[type="url"],.url', 'url', function (value, element, cb) {
            var valid = isOptional(element, value) ||
                yafov.defaults.patternLibrary.url.test(value);
            cb(valid);
        }],
        /*
         * value must be a valid email address
         * <input type="email" />
         * <input type="text" class="email" />
         */
        ['[type="email"],.email', 'email', function (value, element, cb) {
            var valid = isOptional(element, value) ||
                yafov.defaults.patternLibrary.email.test(value);
            cb(valid);
        }],
        /*
         * value must be a valid tel number
         * <input type="tel" />
         * <input type="text" class="tel" />
         */
        ['[type="tel"],.tel', 'tel', function (value, element, cb) {
            var valid = isOptional(element, value) ||
                yafov.defaults.patternLibrary.phone.test(value);
            cb(valid);
        }],
        /*
         * value must contain only numeric chars
         * <input type="text" class="numeric" />
         */
        ['[type="number"],.number', 'number', function (value, element, cb) {
            // +null returns 0
            var valid = isOptional(element, value) || value !== null && !isNaN(+value);
            cb(valid);
        }],
        /*
         * Value must be equal or less then max and more or equal then min
         * range validator: <input type="text" min="3" max="5" ...
         */
        ['[type="range"],.range', 'range', function (value, element, cb) {
            var optional = isOptional(element, value);
            if (!optional) {
                validateWith(element, 'min', function (minValid) {
                    if (minValid) {
                        validateWith(element, 'max', function (maxValid) {
                            cb(minValid && maxValid);
                        }, value, false);
                    } else {
                        cb(minValid);
                    }
                }, value, false);
            } else {
                cb(true);
            }
        }],
        /*
         * Value must be equal or less
         * max validator: <input type="text" max="5" ...
         */
        ['[max],.max', 'max', function (value, element, cb) {
            validateWith(element, 'number', function (valid) {
                // +null returns 0
                var optional = isOptional(element, value),
                    maxVal;
                if (!optional) {
                    if (element.is('[max]')) {
                        maxVal = element.attr('max');
                    } else {
                        maxVal = element.attr('data-max');
                    }
                    valid = +maxVal >= +value && valid;
                }
                cb(valid);
            }, value, false);
        }],
        /*
         * Value must be equal or more
         * min validator: <input type="text" min="5" ...
         */
        ['[min],.min', 'min', function (value, element, cb) {
            validateWith(element, 'number', function (valid) {
                var optional = isOptional(element, value),
                    minVal;

                if (!optional) {
                    if (element.is('[min]')) {
                        minVal = element.attr('min');
                    } else {
                        minVal = element.attr('data-min');
                    }
                    valid = +minVal <= +value && valid;
                }
                cb(valid);
            }, value, false);

        }],
        /*
         * value must contain only alpha chars
         * <input type="text" class="alpha" />
         */
        ['.alpha', 'alpha', function (value, element, cb) {
            var valid = isOptional(element, value) ||
                        yafov.defaults.patternLibrary.alpha.test(value);
            cb(valid);
        }],
        /*
         * value must contain only alphanumeric chars
         * <input type="text" class="alphanumeric" />
         */
        ['.alphanumeric', 'alphanumeric', function (value, element, cb) {
            var valid = isOptional(element, value) ||
                    yafov.defaults.patternLibrary.alphanumeric.test(value);
            cb(valid);
        }]
    ]).each(function () {
        addMethod.apply(null, this);
    });
    $([
        /*
         * value shouldn't be empty
         * <input type="text" required />
         * <input type="text" class="required" />
         */
        [
            'input[type="radio"][required],input[type="radio"].required',
            'required',
            function requiredGroupValiadator(value, element, cb) {
                var valid = element.filter(':checked').length > 0;
                cb(valid);
            },
            /*
             * collects all elements which belongs to the group
             * one parameter, which is the reference element
             */
            function requiredRadioGroupCollector(element) {
                var elem = $(element),
                    form = elem.closest('form'),
                    elements;

                elements = form.find('input[type="radio"][name="' + elem.attr('name') + '"]');
                return elements;
            }
        ]
    ]).each(function () {
        addGroupMethod.apply(null, this);
    });
}(jQuery));
