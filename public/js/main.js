var jsJAM = {};

jsJAM.Application = function (global, $) {
    var Application, self;

    Application = function () {
        self = this;
    };

    Application.prototype.init = function () {

        self.editor = new jsJAM.Editor();
        self.console = new jsJAM.Console(self.editor);

        window.editor = self.editor;
    };

    return new Application;

}(window, jQuery);


jsJAM.Editor = function ($) {
    var JamEditor, self, editor;

    JamEditor = function () {
        self = this;
        self.jamCode = "(function() {\n\tconsole.log('Start Jam');\n\n})();";

        self.editor = ace.edit("editor");
        self.editor.setTheme("ace/theme/twilight");
        self.editor.getSession().setMode("ace/mode/javascript");
        self.editor.setReadOnly(true);

        self.editor.on('changeSelection', function() {

        });

        window.e = self.editor;

        self.setValue(self.jamCode);
        self.gotoLine(0);
    };

    JamEditor.prototype.getValue = function () {
        return self.editor.getValue();
    }

    JamEditor.prototype.setValue = function (code) {
        return self.editor.setValue(code);
    }

    JamEditor.prototype.insert = function (code) {
        return self.editor.insert(code);
    }

    JamEditor.prototype.gotoLine = function (lineNumber) {
        return self.editor.gotoLine(lineNumber);
    }

    return JamEditor;

}(jQuery);

jsJAM.Console = function ($, window) {
    var JamConsole, self, $btnRun, $btnClear;

    JamConsole = function (editor) {
        self = this;

        self.editor = editor;
        self.maxChars = 250;

        self.$output = $('.output');
        $btnClear = $('#clear');
        self.$jamInput = $('#jamInput');
        $btnRun = $('#run');
        self.$remainingCount = $('#remainingCount');
        self.$remainingCount.attr('maxlength', self.maxChars);

        $btnRun.on('click', self.evalJam);
        $btnClear.on('click', self.clear);
        self.$jamInput.on('keydown', self.remainingCars);
        self.$jamInput.on('keyup', function (e) {
            self.remainingCars();
        });

        self.remainingCars();
    };

    JamConsole.prototype.evalJam = function () {

        self.clear();

        var code = self.$jamInput.val();
        var byUser = ' // by Stefan';

        if (code.length == 0) {
            return;
        }

        if (code.charAt(code.length - 1) == '{') {
            code += byUser;
            code += '\n\t\n}';
        } else {
            code += byUser;
        }

        self.editor.insert(code + '\n');

        try {
            window.console.log = self.print;
            var code = self.editor.getValue();
            eval(code);
            self.editor.jamCode = code;
            self.$jamInput.val('');

        } catch (e) {
            self.print(e.toString());
            self.editor.setValue(self.editor.jamCode);
        }
    }

    JamConsole.prototype.print = function (msg) {
        self.$output.append(msg + '<br/>')
    }

    JamConsole.prototype.clear = function () {
        self.$output.html('');
    }

    JamConsole.prototype.remainingCars = function () {
        var count = self.maxChars - self.$jamInput.val().length;
        self.$remainingCount.html(count);
    }

    return JamConsole;

}(jQuery, window);

