var jsJAM = {};

jsJAM.Application = function (global, $) {
    var Application, self;

    Application = function () {
        self = this;
    };

    Application.prototype.init = function () {

        self.editor = new jsJAM.Editor();
        self.console = new jsJAM.Console(self.editor);
    };

    return new Application;

}(window, jQuery);


jsJAM.Editor = function ($) {
    var JamEditor, self, editor;

    JamEditor = function () {
        self = this;

        self.editor = ace.edit("editor");
        self.editor.setTheme("ace/theme/twilight");
        self.editor.getSession().setMode("ace/mode/javascript");
    };

    JamEditor.prototype.getValue = function () {
        return self.editor.getValue();
    }

    return JamEditor;

}(jQuery);


jsJAM.Console = function ($, window) {
    var JamConsole, self, $btnRun, $btnClear;

    JamConsole = function (editor) {
        self = this;

        self.editor = editor;

        self.$output = $('.output');
        $btnClear = $('#clear');
        $btnRun = $('#run');

        $btnRun.on('click', self.evalJam);
        $btnClear.on('click', self.clear);

    };

    JamConsole.prototype.evalJam = function () {

        self.clear();

        try {
            window.console.log = self.print;
            eval(self.editor.getValue());
        } catch (e) {
            self.print(e.toString());
        }
    }

    JamConsole.prototype.print = function (msg) {
        self.$output.append(msg + '<br/>')
    }

    JamConsole.prototype.clear = function () {
        self.$output.html('');
    }

    return JamConsole;

}(jQuery, window);

