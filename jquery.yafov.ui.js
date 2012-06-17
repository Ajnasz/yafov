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

    var messages = {};
    function getMessage(which) {
        return messages[which];
    }
    function setMessage(name, msg) {
        messages[name] = msg;
    }
    $.yafov.setMessage = setMessage;
    $.yafov.getMessage = getMessage;

    setMessage('required', 'The field is required.');
    setMessage('url', 'Please enter a valid url.');
    setMessage('email', 'Please enter a valid email address.');
    setMessage('tel', 'Please enter a valid phone number.');
    setMessage('number', 'The value must be a number.');
    setMessage('alpha', 'Only alpha characters are allowed.');
    setMessage('alphanumeric', 'Only alphanumeric characters are allowed.');
    setMessage('range', function (error) {
        var max, min;
        if (error.field.is('[max]')) {
            max = $(error.field).attr('max');
        } else {
            max = $(error.field).attr('data-max');
        }
        if (error.field.is('[min]')) {
            min = $(error.field).attr('min');
        } else {
            min = $(error.field).attr('data-min');
        }
        return 'Value must be between ' + min + ' and ' + max + '.';
    });
    setMessage('max', function (error) {
        var max;
        if (error.field.is('[max]')) {
            max = $(error.field).attr('max');
        } else {
            max = $(error.field).attr('data-max');
        }
        return 'Maximum value is ' + max + '.';
    });
    setMessage('min', function (error) {
        var min;
        if (error.field.is('[min]')) {
            min = $(error.field).attr('min');
        } else {
            min = $(error.field).attr('data-min');
        }
        return 'Minimum value is ' + min + '.';
    });

    $.fn.yafovUI = function (options) {
        var validator = $(this).yafov(options);
        validator.bind('invalidfound', function (e, error) {
            var field = $(error.field),
                fieldId = field.attr('id'),

                // default error message
                // msg = 'Error found: ' + error.name,
                msg = getMessage(error.name),
                msgType = typeof msg,
                label;

            if (msgType === 'function') {
                msg = msg(error);
            } else if (msgType === 'undefined') {
                msg = 'Error found: ' + error.name;
            }

            // add error class to field
            field.addClass('error').removeClass('valid');

            label = $('<label />');
            label.addClass('error').attr('for', fieldId).text(msg);
            // remove existing error message
            field.parent().find('label.error').remove()
            // add new error message
                .end().append(label);
        });

        // Listen to validfound event and remove the error message if needed
        validator.bind('validfound', function (e, error, element) {
            var field = $(error.field);
            field.removeClass('error').addClass('valid');
            field.parent().find('label.error').remove();
        });

        return validator;
    };
}(jQuery));
