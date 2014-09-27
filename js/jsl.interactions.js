/*jslint white: true, devel: true, onevar: true, browser: true, undef: true, nomen: true, regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50, indent: 4 */
var jsl = typeof jsl === 'undefined' ? {} : jsl;

/**
 * Helper Function for Caret positioning
 * Gratefully borrowed from the Masked Input Plugin by Josh Bush
 * http://digitalbush.com/projects/masked-input-plugin
**/
$.fn.caret = function (begin, end) {
    if (this.length === 0) {
        return;
    }
    if (typeof begin === 'number') {
        end = (typeof end === 'number') ? end : begin;
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(begin, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', begin);
                range.select();
            }
        });
    } else {
        if (this[0].setSelectionRange) {
            begin = this[0].selectionStart;
            end   = this[0].selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange();
            begin = -range.duplicate().moveStart('character', -100000);
            end   = begin + range.text.length;
        }
        return {"begin": begin, "end": end};
    }
};


/**
 * jsl.interactions - provides support for interactions within JSON Lint.
 *
**/
jsl.interactions = (function () {
    var reformatParam,
        reformat,
        compress;


    /******* UTILITY METHODS *******/

    /**
     * Get the Nth position of a character in a string
     * @searchStr the string to search through
     * @char the character to find
     * @pos int the nth character to find, 1 based.
     *
     * @return int the position of the character found
    **/
    function getNthPos(searchStr, char, pos) {
        var i,
            charCount = 0,
            strArr = searchStr.split(char);

        if (pos === 0) {
            return 0;
        }

        for (i = 0; i < pos; i++) {
            if (i >= strArr.length) {
                return -1;
            }

            // +1 because we split out some characters
            charCount += strArr[i].length + char.length;
        }

        return charCount;
    }

    /**
     * Get a URL parameter from the current windows URL.
     * Courtesy Paul Oppenheim: http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
     * @param name the parameter to retrieve
     * @return string the url parameter's value, if any
    **/
    function getURLParameter(name) {
        param = (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || ['', null])[1];
        if (param) {
            return decodeURIComponent(param);
        } else {
            return null;
        }
    }

    /******* INTERACTION METHODS *******/

    /**
     * Validate the JSON we've been given, displaying an error or success message.
     * @return void
    **/
    function validate() {
        var lineNum,
            lineMatches,
            lineStart,
            lineEnd,
            jsonVal,
            result,
            $json = $("#beautify"),
            $results = $("#results");

        jsonVal = $json.val();

        try {
            result = jsl.parser.parse(jsonVal);

            if (result) {
                $results.removeClass('error').addClass('success');
                $('div.linedwrap').removeClass('redBorder').addClass('greenBorder');
                $results.show().text('Valid JSON');

                if (reformat) {
                    $json.val(JSON.stringify(JSON.parse(jsonVal), null, "    "));
                }

                if (compress) {
                    $json.val(JSON.stringify(JSON.parse(jsonVal), null, ""));
                }
            } else {
                alert("An unknown error occurred. Please contact Jay Kanakiya.");
            }
        } catch (parseException) {

            /**
             * If we failed to validate, run our manual formatter and then re-validate so that we
             * can get a better line number. On a successful validate, we don't want to run our
             * manual formatter because the automatic one is faster and probably more reliable.
            **/
            try {
                if (reformat) {
                    jsonVal = jsl.format.formatJson($json.val());
                    $json.val(jsonVal);
                    result = jsl.parser.parse($json.val());
                }
            } catch(e) {
                parseException = e;
            }

            lineMatches = parseException.message.match(/line ([0-9]*)/);
            if (lineMatches && typeof lineMatches === "object" && lineMatches.length > 1) {
                lineNum = parseInt(lineMatches[1], 10);

                if (lineNum === 1) {
                    lineStart = 0;
                } else {
                    lineStart = getNthPos(jsonVal, "\n", lineNum - 1);
                }

                lineEnd = jsonVal.indexOf("\n", lineStart);
                if (lineEnd < 0) {
                    lineEnd = jsonVal.length;
                }
                $json.focus().caret(lineStart, lineEnd);
            }
            $results.show().text(parseException.message);
            $results.removeClass('success').addClass('error');
        }
        window.cm = CodeMirror.fromTextArea(document.getElementById("beautify"), {
            mode: "text/javascript",
            lineNumbers: true
        });
    }

    /**
     * Initialize variables, add event listeners, etc.
     *
     * @return void
    **/
    function init() {
        reformatParam = getURLParameter('reformat');
        reformat      = reformatParam !== '0' && reformatParam !== 'no';
        compress      = reformatParam === 'compress',
        jsonParam     = getURLParameter('json'),
        $json = $("#beautify");

        $('#validate').click(function () {
            hide();
            cm.save();
            cm.toTextArea();
            var jsonVal = $.trim($json.val());
            validate();
            return false;
        });
    }

    return {
        'init': init
    };
}());

$(function () {
    jsl.interactions.init();
});
