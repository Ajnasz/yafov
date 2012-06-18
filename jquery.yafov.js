/*
Copyright (c) 2011-2012 Lajos Koszti http://ajnasz.hu

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
 * Event based and highly customizable form validator plugin for jQuery.
 * A fork of https://github.com/dilvie/h5Validate
 */

/*global jQuery */
/*jslint browser: true, devel: true, undef: true, bitwise: true, regexp: true, newcap: true */
(function ($) {
    "use strict";
    var yafov, defaults, patternLibrary, validatorMethods, methods;
    yafov = { // Public API
        defaults: {
            debug: false,

            // Setup KB event delegation.
            kbSelectors: ':input:not(:submit,:button)',
            /**
             * Validate on focus out event
             * @property {Boolean} focusout
             * @default false
             */
            focusout: false,
            /**
             * Validate on focus in event
             * @property {Boolean} focusin
             * @default false
             */
            focusin: false,
            /**
             * Validate on change event
             * @property {Boolean} change
             * @default true
             */
            change: true,
            /**
             * Validate on keyup event
             * @property {Boolean} keyup
             * @default keyup
             */
            keyup: false,
            /**
             * Validate on click event
             * @property {Boolean} click
             * @default true
             */
            click: true,
            /**
             * Validate on form submit event
             * @property {Boolean} submit
             * @default true
             */
            submit: true,

            // Setup mouse event delegation.
            mSelectors: '[type="range"], :radio, :checkbox, select, option'
        }
    };

    defaults = yafov.defaults;

    validatorMethods = (function () {
        var methods = [],
            groupMethods = [],
            /* an object to store the method indexes by their name */
            methodsByName = {},
            groupMethodsByName = {},
            interf;

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
    }());

    function addMethod(selector, name, fn) {
        validatorMethods.add(selector, name, fn);
    }

    function addGroupMethod(selector, name, fn, getGroupItems) {
        validatorMethods.addGroup(selector, name, fn, getGroupItems);
    }

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
    function validateWith(element, name, cb, value, isGroup) {

        var method, callback;

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
                value = (element.is('[type="checkbox"],[type="radio"]')) ?
                            element.is(':checked') :
                            element.val();
            }
            method.fn(value, element, callback);
        } else {
            callback(true);
        }
    }

    /* method which finds out if an element belongs to a group */
    function isGroupElement(element) {
        var groupValidators = validatorMethods.getAll(true),
            gl = groupValidators.length,
            matching = false,
            elem = $(element),
            i;

        for (i = 0; !matching && i < gl; i += 1) {
            matching = elem.is(groupValidators[i].selector);
        }
        return matching;
    }

    /**
     *
     */
    function validateElement(element, cb) {
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
            value;

          // get the value once, so it gonna be cached
        value = ($this.is('[type=checkbox]')) ?  $this.is(':checked') : $this.val();

        function onValidate(next) {
            if (index + 1 < vl) {
                index += 1;
                next();
            } else {
                $this.trigger('validateFinish', $this);
                cb(result);
            }
        }
        // the elem gonna be all the elements which were validated
        // by this validatior action normally it's the same what we
        // pass ($this) to the validateWith function, but when it's
        // a group validator then all of the elements will be
        // listed here
        function validatorItemCb(valid, validatedElements) {
            // update result
            result.isValid = valid;
            result.field = validatedElements;
            // if not valid make sure we don't run the next validator
            if (!valid) {
                index = vl - 1;
            }
            onValidate(validate);
        }
        function validate() {
            $this.trigger('validateStart', $this);
            // check if need to validate
            if (!result.isValid) {
                onValidate(validate);
                return;
            }
            var validator = validatorMethods.get(index, isGroup);
            if (!$this.is(validator.selector)) {
                onValidate(validate);
                return;
            }
            result.name = validator.name;
            validateWith($this, validator.name,
                validatorItemCb, value, isGroup);
        }
        validate();
    }

    methods = {
        validate: function validate(element, cb) {
            var $element = $(element);
            validateElement($element[0], function validateElementCallback(result) {
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
        delegateEvents: function delegateEvents(selectors, eventFlags, element, settings) {
            var events = [],
                $element = $(element),
                key,
                i,
                el,
                validate;

            validate = function validate(e) {
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
        bindDelegation: function bindDelegates(settings) {
            // bind to forms
            this.filter('form').attr('novalidate', 'novalidate').end()
                .find('form').attr('novalidate', 'novalidate')
                .parents('form').attr('novalidate', 'novalidate');

            function onSubmit(e) {
                // prevent submitting the form before validation
                e.preventDefault();

                var form = $(e.target),
                    errors = [],
                    groupMethods = validatorMethods.getAll(true),
                    groupSelectors = $.unique($.map(groupMethods, function (method) {
                        return method.selector;
                    })),
                    fieldsValidated = false,
                    groupFieldsValidated = false,
                    fields,
                    groupFields,
                    groupFieldsArr;

                // if finished both the simple and group validators formvalid
                // or forminvalid events gonna be triggered
                function finish() {
                    if (fieldsValidated && groupFieldsValidated) {
                        if (errors.length < 1) {
                            errors = null;
                            form.trigger('formvalid');
                        } else {
                            form.trigger('forminvalid', {errors: errors});
                        }
                    }
                }
                function collectInvalids(fields, group) {
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
                    };
                }
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
            }

            if (settings.submit) {
                this.submit(onSubmit);
            }

            this.settings = function getSettings() {
                return settings;
            };

            return this.each(function () {
                var kbEvents, mEvents;
                kbEvents = {
                    focusout: settings.focusout,
                    focusin: settings.focusin,
                    change: settings.change,
                    keyup: settings.keyup
                };
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
        * @param jQueryObject element A input or textarea or select which will
        * be validated as jQuery object
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
         * @method addGroupMethod
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
        },
        /**
         * Returns the default settings
         * @method getDefaults
         */
        getDefaults: function getDefaults() {
            return defaults;
        },
        /**
         * Sets (extends) the default settngs
         * @method setDefaults
         * @param {Object} options
         */
        setDefaults: function setDefaults(options) {
            $.extend(defaults, options);
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
}(jQuery));
