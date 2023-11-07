function setMenu(graphic) {
    graphic.addEventListener("dblclick", function(event) {
            
        getEditMenuSelectOptions(graphic);
    
        editMenu.style.left = event.pageX + "px";
        editMenu.style.top = event.pageY + "px";
        editMenu.style.display = "block";
    
        const color = getHslAttr(graphic, graphicAttrs[graphic.tagName][0]);

        colorSlider.removeEventListener('input', colorSlider.inputHandler);
        colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
    
        colorSlider.removeEventListener('input', colorSlider.inputHandler);
        colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
        colorSlider.inputHandler = () => inputColor(graphic);
        colorSlider.mouseUpHandler = () => setColor(graphic, color);
        
        colorSlider.addEventListener('input', colorSlider.inputHandler);
        colorSlider.addEventListener('mouseup', colorSlider.mouseUpHandler);
        
        delItem.removeEventListener("click", delItem.clickHandler);
        copyItem.removeEventListener("click", copyItem.clickHandler);

        delItem.clickHandler = () => del(graphic);
        copyItem.clickHandler = () => copy(graphic);

        delItem.addEventListener("click", delItem.clickHandler);
        copyItem.addEventListener("click", copyItem.clickHandler);
    });
}


function getEditMenuSelectOptions(graphic) {
    attrMenu.innerHTML = "";

    const items = graphicAttrs[graphic.tagName].slice();

    items.push("rotation");
    
    for (let i = 0; i < items.length; i++) {
        let li = document.createElement("li");

        li.textContent = items[i];
        if(items[i] === "points") {
            let points = graphic.points;
            let pointsMenu  =  document.createElement("ul");
            pointsMenu.classList.add("sub-sub-menu");
            for(let j = 0; j < points.length; j++) {
                let pointXLi = document.createElement("li");
                let pointYLi = document.createElement("li");
                pointXLi.textContent = "x" + j;
                pointYLi.textContent = "y" + j;
                pointXLi.addEventListener("click", () => {
                    let varName = graphic.id + "_x" + j;
                    if (relateInput1.value !== "") { 
                        relateInput2.value += varName;
                        attr2Value.set(varName, points[j]["x"]);
                        if (graph2AttrsInCtt.has(graphic.id)) {
                            graph2AttrsInCtt.get(graphic.id).add("x" + j);
                        }
                        else {
                            graph2AttrsInCtt.set(graphic.id, new Set().add("x" + j));
                        }
                    }else{
                        relateInput1.value += varName;
                    }
                    editMenu.style.display = "none";
                });
                pointYLi.addEventListener("click", () => {
                    let varName = graphic.id + "_y" + j;
                    if (relateInput1.value !== "") { 
                        relateInput2.value += varName;
                        attr2Value.set(varName, points[j]["y"]);
                        if (graph2AttrsInCtt.has(graphic.id)) {
                            graph2AttrsInCtt.get(graphic.id).add("y" + j);
                        }
                        else {
                            graph2AttrsInCtt.set(graphic.id, new Set().add("y" + j));
                        }
                    }else{
                        relateInput1.value += varName;
                    }
                    editMenu.style.display = "none";
                });
                pointsMenu.appendChild(pointXLi);
                pointsMenu.appendChild(pointYLi);
                // TODO: fix hover of points menu
            }
            li.appendChild(pointsMenu);
        }else{
            li.addEventListener("click", () => {
            
                let varName = graphic.id + "_" + items[i]

                if (relateInput1.value !== "") {
                    relateInput2.value += varName;

                    if (items[i] === "fill" || items[i] === "stroke") {
                        const val = getHslAttr(graphic, items[i]);
                        attr2Value.set(varName, val);
                    } else if (items[i] === "rotation") {
                        const angle = getRotationCenter(graphic).rotation;
                        attr2Value.set(varName, angle);
                    } else {
                        attr2Value.set(varName, graphic.getAttribute(items[i]));
                    }

                    if (graph2AttrsInCtt.has(graphic.id)) {
                        graph2AttrsInCtt.get(graphic.id).add(items[i]);
                    }
                    else {
                        graph2AttrsInCtt.set(graphic.id, new Set().add(items[i]));
                    }
                } else {
                    relateInput1.value += varName;
                }

                editMenu.style.display = "none";
            });
        }
        

        attrMenu.appendChild(li);
    }
}


function inputColor(graphic) {
    const hue = colorSlider.value;
    const hslColor = "hsl(" + hue +", 100%, 50%)";

    if (graphic.tagName !== "line") {
        graphic.setAttribute("fill", hslColor);
    } else {
        graphic.setAttribute("stroke", hslColor);
    }
}


function setColor(graphic, color) {
    if (graphic.classList.contains("highlight")) {
        const index = 
        Array.from(graphic.parentNode.parentNode.children).indexOf(graphic.parentNode);

        iterateEdits[index][1] = colorSlider.value - color;
    
    } else {
        gEdit = setColorEdit(graphic, colorSlider.value - color);
    }
    
    editMenu.style.display = "none";
    colorSlider.removeEventListener('input', colorSlider.inputHandler);
    colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
}


function copy(graphic) {
    gEdit = copyEdit(graphic);

    const curGroup = graphic.parentNode;
    const outerGroup = curGroup.parentNode;
    const clonedGroup = curGroup.cloneNode(true);

    const clonedGraphic = clonedGroup.children[0];
    const clonedCorner = clonedGroup.children[1];
    const clonedLabel = clonedGroup.children[2];

    outerGroup.insertBefore(clonedGroup, curGroup.nextSibling);

    setGraphicId(clonedGraphic);
    clonedLabel.textContent = clonedGraphic.id;

    drag(clonedGraphic);
    setMenu(clonedGraphic);
    resize(clonedGraphic, clonedCorner);

    editMenu.style.display = "none";

    colorSlider.removeEventListener('input', colorSlider.inputHandler);
    colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
}


function del(graphic) {
    gEdit = delEdit(graphic);

    const curGroup = graphic.parentNode;
    const outerGroup = curGroup.parentNode;

    outerGroup.removeChild(curGroup);
    editMenu.style.display = "none";
}