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
(function ($) {
    var patterns = {
        phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance
        // Validation plugin
        // http://projects.scottsplayground.com/email_address_validation/
        email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance
        // Validation plugin http://projects.scottsplayground.com/iri/
        url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

        // Number, including positive, negative, and floating decimal.
        // Credit: bassistance
        // number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

        // Date in ISO format. Credit: bassistance
        dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,

        alpha: /[a-zA-Z]+/,
        alphaNumeric: /\w+/
    };
    function isOptional(element, value) {
        return !element.is('[required],.required') && value === '';
    }

    $.yafov.isOptional = isOptional;


    $.yafov.patternLibrary = patterns;

    /**
     * Predefined validator methods
     */
    $([
        /**
         * value shouldn't be empty
         * <input type="text" required />
         * <input type="text" class="required" />
         */
        ['[required],.required', 'required', function requiredValidator(value, element, cb) {
            var valid = !!value;
            cb(valid);
        }],
        /**
         * value must be a valid url
         * <input type="url" />
         * <input type="text" class="url" />
         */
        ['[type="url"],.url', 'url', function urlValidator(value, element, cb) {
            var valid = isOptional(element, value) ||
                patterns.url.test(value);
            cb(valid);
        }],
        /**
         * value must be a valid email address
         * <input type="email" />
         * <input type="text" class="email" />
         */
        ['[type="email"],.email', 'email', function emailValidator(value, element, cb) {
            var valid = isOptional(element, value) ||
                patterns.email.test(value);
            cb(valid);
        }],
        /**
         * value must be a valid tel number
         * <input type="tel" />
         * <input type="text" class="tel" />
         */
        ['[type="tel"],.tel', 'tel', function telValidator(value, element, cb) {
            var valid = isOptional(element, value) ||
                patterns.phone.test(value);
            cb(valid);
        }],
        /**
         * value must contain only numeric chars
         * <input type="text" class="numeric" />
         */
        ['[type="number"],.number', 'number', function numberValidator(value, element, cb) {
            value = value.replace(/(^\s+|\s+$)/g, '');
            // +null and +'\s+ returns 0
            var valid = isOptional(element, value) ||
                (value !== null && value !== '' && !isNaN(+value));
            cb(valid);
        }],
        /**
         * Value must be equal or less then max and more or equal then min
         * range validator: <input type="text" min="3" max="5" ...
         */
        ['[type="range"],.range', 'range', function rangeValidator(value, element, cb) {
            var optional = isOptional(element, value);
            if (!optional) {
                $.yafov.validateWith(element, 'min', function (minValid) {
                    if (minValid) {
                        $.yafov.validateWith(element, 'max', function (maxValid) {
                            cb(minValid && maxValid);
                        }, value, false);
                    } else {
                        cb(minValid);
                    }
                }, false);
            } else {
                cb(true);
            }
        }],
        /**
         * Value must be equal or less
         * max validator: <input type="text" max="5" ...
         */
        ['[max],.max', 'max', function maxValidator(value, element, cb) {
            $.yafov.validateWith(element, 'number', function (valid) {
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
            }, false);
        }],
        /**
         * Value must be equal or more
         * min validator: <input type="text" min="5" ...
         */
        ['[min],.min', 'min', function minValidator(value, element, cb) {
            $.yafov.validateWith(element, 'number', function (valid) {
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
            }, false);

        }],
        /**
         * value must contain only alpha chars
         * <input type="text" class="alpha" />
         */
        ['.alpha', 'alpha', function alphaValidator(value, element, cb) {
            var valid = isOptional(element, value) ||
                        patterns.alpha.test(value);
            cb(valid);
        }],
        /**
         * value must contain only alphanumeric chars
         * <input type="text" class="alphanumeric" />
         */
        ['.alphanumeric', 'alphanumeric', function alphaNumbericValidator(value, element, cb) {
            var valid = isOptional(element, value) ||
                    patterns.alphanumeric.test(value);
            cb(valid);
        }]
    ]).each(function () {
        $.yafov.addMethod.apply(null, this);
    });
    $([
        /**
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
            /**
             * collects all elements which belongs to the group
             * one parameter, which is the reference element
             */
            function requiredRadioGroupCollector(element) {
                var elem = $(element),
                    form = elem.closest('form'),
                    elements;

                elements = form.find(':radio[name="' + elem.attr('name') + '"]');
                return elements;
            }
        ]
    ]).each(function () {
        $.yafov.addGroupMethod.apply(null, this);
    });
}(jQuery));
