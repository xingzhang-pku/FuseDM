let enode = document.createElement("div");
enode.id = "editor";
enode.style.setProperty('position','fixed');
document.getElementById("body").appendChild(enode);

let editor = ace.edit("editor");
editor.setFontSize("13px");
editor.session.setMode("ace/mode/elm");
editor.getSession().setValue("main = [];");

let exebtn = document.getElementById("execute-button");
exebtn.onclick = function() {
    app.ports.exeCode.send(editor.getSession().getDocument().getValue());
};

app.ports.retNewCode.subscribe(function(newCode) {
    editor.getSession().setValue(newCode);
});

app.ports.retCodeFile.subscribe(function(fileN) {
    if (fileN === "New File") {
        editor.getSession().setValue("");
    } else {
        readTextFile("/src/Examples/" + fileN + ".txt", function(text) {
            editor.getSession().setValue(text);});
    }
});