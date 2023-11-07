const everySelector  = document.createElement("select");
const iterateConfirm = document.createElement("button");
const noneOption     = document.createElement("option");

iterateConfirm.classList.add("btn");
iterateConfirm.textContent = "√";
iterateConfirm.style.width = "22px";
iterateConfirm.style.fontSize = "12px";
iterateConfirm.style.marginLeft = "5px";

noneOption.value = 0;
noneOption.textContent = "None";

everySelector.appendChild(noneOption);
everySelector.classList.add("btn");
everySelector.style.marginLeft = "5px";

menuBar.appendChild(everySelector);
menuBar.appendChild(iterateConfirm);


for (let i = 1; i<4; i++){
    const option = document.createElement("option");
    option.value = i;
    option.textContent = "Every " + i;
    everySelector.appendChild(option);
}

iterateConfirm.addEventListener("click", function() {
    gEdit = iterateEdit(iterateEdits, selectedGroup);

    const n = everySelector.value;
    const len = selectedGroup.children.length;
    const tag = selectedGroup.children[0].children[0].tagName;
    
    for (let i = n; i < len; i++) {
        const e = iterateEdits[i%n];
        const graphic = selectedGroup.children[i].children[0];
        const items = graphicAttrs[tag].slice();
        items.unshift("rotation");
        
        for (let j = 0; j < e.length; j++) {
            const attr = items[j];
            if (attr === "fill" || attr === "stroke") {
                const val = getHslAttr(graphic, attr) + e[j];
                graphic.setAttribute(attr, "hsl(" + val + ", 100%, 50%)");
            } else if (attr === "rotation") {
                const rotation = getRotationCenter(graphic);
                graphic.setAttribute("transform", 
                "rotate(" + (rotation.rotation + e[j]) + " " + rotation.centerX + " " + rotation.centerY + ")" );
            } else {
                const attrVal = parseInt(graphic.getAttribute(attr));
                graphic.setAttribute(attr, attrVal + e[j]);
            }
            setAtomicGroup(graphic.parentNode);
            setAllGroups();
        }
    }
    
    clear();
});


everySelector.addEventListener("change", function() {
    groupMenu.style.display = "none";
    const n = parseInt(everySelector.value);

    const highlightedElements = selectedGroup.querySelectorAll(".highlight");
    highlightedElements.forEach(element => {
        element.classList.remove("highlight");
    });
    
    const len = graphicAttrs[selectedGroup.children[0].children[0].tagName].length;
    iterateEdits = new Array(n);

    for (let i = 0; i < n; i++) {
        selectedGroup.children[i].firstChild.classList.add("highlight");
        iterateEdits[i] = new Array(len+1).fill(0);
    }
});