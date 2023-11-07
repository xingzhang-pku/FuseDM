function getElementPosition(element) {
    let curElement = element;
    let position = [];

    while (curElement.tagName.toLowerCase() !== 'svg') {
        const parentElement = curElement.parentNode;
        if (!parentElement) break;
        if (!parentElement.classList.contains("wrapper")) {
            const childElements = parentElement.children;
            const index = Array.from(childElements).indexOf(curElement);
            position.unshift(index);
        }
        curElement = parentElement;
    }
    return position;
}

function getGroupPosEdit(group) {
    let position = getElementPosition(group);
    let edit = "";

    edit += "modify " + position[0];
    if (position.length > 2) {

        for (let i = 1; i < position.length; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";
            edit += " modify " + index;
        }
    }
    
    return edit + " ";
}


function getGraphicPosEdit(graphic) {
    let position = getElementPosition(graphic);
    let edit = "";

    edit += "modify " + position[0];
    if (position.length > 2) {

        for (let i = 1; i < position.length - 1; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";
            edit += " modify " + index;
        }

    }

    return edit + " ";
}


function dragEdit(graphic, dx, dy) {
    let edit = "";
    edit += getGraphicPosEdit(graphic);

    if (graphic.tagName === "circle") {
        edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ", id]"; 
    } else if (graphic.hasAttribute("x") || graphic.hasAttribute("cx")) {
        edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ", id, id]"; 
    } else if (graphic.tagName === "line") {
        edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ",+" + dx + ",+" + dy + "]";
    }

    return edit;
}


function dragPolygonEdit(polygon, dx, dy) {
    let edit = "";
    edit += getGraphicPosEdit(polygon);
    edit += "Graphic.map [id, id,[";

    let points = [];
    for (let i = 0; i < polygon.points.length; i++) {
        points.push("(+" + dx + ",+" + dy+")");
    }
    edit += points.join(",") + "]]";
    return edit;
}


function dragGroupEdit(group, dx, dy) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += setGroupPosEdit(group, dx, dy);
    return edit;
}


function setGroupPosEdit(group, dx, dy) {
    let edit = "Graphic.map [ id, [";

    for(let i = 0; i < group.children.length; i++) {
        if (group.children[i].classList.contains("atomic")) {
            const graphic = group.children[i].firstChild;
            if (graphic.tagName === "line") {
                edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ",+" + dx + ",+" + dy + "]";
            } else if (graphic.tagName === "circle") {
                edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ", id]";
            } else if (graphic.tagName === "polygon") {
                edit += "Graphic.map [id, id,[";

                let points = [];
                for (let j = 0; j < graphic.points.length; j++) {
                    points.push("(+" + dx + ",+" + dy+")");
                }
                edit += points.join(",") + "]]";
            } else {
                edit += "Graphic.map [id, id,+" + dx + ",+" + dy + ", id, id]";
            } 
        } else if (group.children[i].classList.contains("wrapper")) {
            edit += setGroupPosEdit(group.children[i].firstChild, dx, dy); 
        }

        if (i !== group.children.length - 1) {
            edit += ",";
        }
    }

    return edit + "]]";
}


function resizeEdit(graphic, dx, dy) {
    let edit = "";
    edit += getGraphicPosEdit(graphic);

    if (graphic.tagName !== "circle") {
        edit += "Graphic.map [id,id,id,id,+" + dx + ",+" + dy + "]"; 
    } else {
        edit += "Graphic.map [id,id,id,id,+" + dx + "]";
    }

    return edit;
}


function resizeLineEdit(graphic, x1, y1, x2, y2) {
    let edit = "";
    edit += getGraphicPosEdit(graphic);
    edit += "Graphic.map [rewr 0,id, rewr " + x1 + ", rewr " + y1 + ", rewr " + x2 + ", rewr " + y2 + "]";
    return edit;
}


function resizePolygonEdit(polygon, index, dx, dy) {
    let edit = "";
    edit += getGraphicPosEdit(polygon);
    edit += "Graphic.map modify 2 modify " + index + " (+" + dx + ",+" + dy + ")";
    return edit;
}


function resizeGroupEdit(group, dx, dy) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += setGroupSizeEdit(group, dx, dy);
    return edit;
}


function setGroupSizeEdit(group, dx, dy) {
    let edit = "Graphic.map [id,[";

    for(let i = 0; i < group.children.length; i++) {
        if (group.children[i].classList.contains("atomic")) {
            const graphic = group.children[i].firstChild;
            if (graphic.tagName === "circle") {
                edit += "Graphic.map [id, id, id, id, +" + dx + "]";
            } else {
                edit += "Graphic.map [id, id, id, id, +" + dx + ",+" + dy + "]";
            }
        } else if (group.children[i].classList.contains("wrapper")) {
            edit += setGroupSizeEdit(group.children[i].firstChild, dx, dy); 
        }

        if (i !== group.children.length - 1) {
            edit += ",";
        }
    }

    return edit + "]]";
}


function relateEdit(relateGoal, relateExpr, varsUsed, varsEachGraphic) {
    let edit = "";

    varsUsed.forEach((value, key) => {
        edit += "?" + key + "=>";
    });

    varsEachGraphic.forEach((value, key) =>{
        let graphic = document.getElementById(key);
        let abst = "";
        abst += getGraphicPosEdit(graphic);
        abst += setAttrAbst(graphic, graphic.id, value);
        edit += "(" + abst + ")."
    });

    edit += "(";
    
    let goalGraphic = document.getElementById(relateGoal[0]);
    let goalAttr = relateGoal[1];
    edit += getGraphicPosEdit(goalGraphic);
    edit += setAttrRewr(goalGraphic, goalAttr, relateExpr);
    edit += ")";

    return edit;
}

// guo 0607
function setPointRewr(len, attr, expr) {
    let deltaList = [];
    for(i = 0; i < len; i++) {
        deltaList.push(["id", "id"].slice());
    }
    let index = parseInt(attr.slice(1));
    if(attr[0] === "x") {
        deltaList[index][0] = "rewr (" + expr + ")";
    }else{
        deltaList[index][1] = "rewr (" + expr + ")";
    }
    let newDeltaList = [];
    for(i = 0; i < deltaList.length; i++) {
        newDeltaList.push("(" + deltaList[i][0] + "," + deltaList[i][1] + ")");
    }
    return "[" + newDeltaList.join(",") + "]";
}

function setAttrRewr(graphic, attr, expr) {
    const tagName = graphic.tagName;
    const items = graphicAttrs[tagName].slice();
    items.unshift("rotation");
    const index = items.indexOf(attr);

    let deltaList = new Array(items.length).fill("id");
    expr = expr.replace(/([a-zA-Z_][0-9a-zA-Z_]*)/g, '$1');
    if(tagName === "polygon" && (attr[0] === "x" || attr[0] === "y")) {
        deltaList[2] = setPointRewr(graphic.points.length, attr, expr);
    }else{
        deltaList[index] = "rewr (" + expr +")";
    }
    
    return "Graphic.map [" + deltaList.join(",") + "]";
}

// guo 0607
function setPointsAbst(id, len, locs) {
    let deltaList = [];
    for(i = 0; i < len; i++) {
        deltaList.push(["id", "id"].slice());
    }
    locs.forEach(loc => {
        let index = parseInt(loc.slice(1));
        
        if (loc[0] === "x") {
            deltaList[index][0] = "&" + id + "_x" + index;
        }else{
            deltaList[index][1] = "&" + id + "_y" + index;
        }
    });
    let newDeltaList = [];
    for(i = 0; i < deltaList.length; i++) {
        newDeltaList.push("(" + deltaList[i][0] + "," + deltaList[i][1] + ")");
    }
    return "[" + newDeltaList.join(",") + "]";

}

function setAttrAbst(graphic, id, attrs) {
    const tagName = graphic.tagName;
    const items = graphicAttrs[tagName].slice();
    items.unshift("rotation");
    let deltaList = new Array(items.length).fill("id");
    if(tagName === "polygon") {
        attrs.forEach(attr => {
            if (attr === "rotation" || attr === "fill") {
                const index = items.indexOf(attr);
                deltaList[index] = "&" + id + "_" + attr;
            }
        });

        let locs = Array.from(attrs).filter(attr => attr !== "fill" && attr !== "rotation");
        if(locs.length > 0) {
            deltaList[items.indexOf("points")] = setPointsAbst(id, graphic.points.length, locs);
        }
    } else {
        attrs.forEach(attr => {
            const index = items.indexOf(attr);
            deltaList[index] = "&" + id + "_" + attr;
        });
    }
    return "Graphic.map [" + deltaList.join(",") + "]";
}


function iterateEdit(iterateEdits, selectedGroup) {
    let posEdit = "";
    posEdit += getGroupPosEdit(selectedGroup) + "Graphic.map modify 1 ";

    const tagName = selectedGroup.children[0].children[0].tagName;
    const pars = graphicAttrs[tagName].slice().map(str => "d" + str);
    pars.unshift("drotation");

    const parsStr = "[" + pars.join(",") + "]";
    
    let deltaFun = "";
    const deltaItem = pars.map(str => "+" + str);
    const deltaItemStr = "Graphic.map [" + deltaItem.join(",") + "]";
    deltaFun = "\\" + parsStr + "->" + deltaItemStr;

    let branchList = [];
    let genFun = "\\seed->case seed%";
    const len = iterateEdits.length;
    
    genFun += len + " of ";
    
    for (let i = 0; i < len; i++) {
        let branch = "";
        const returnStr = "[" + iterateEdits[i].join(",") + "]";
        branch += i + "->("+ returnStr +",seed+1)"

        branchList.push(branch);
    }

    genFun += branchList.join("|");

    return posEdit + "{" + deltaFun + "|" + genFun + "<|0}";
}


function setColorEdit(graphic, dc) {
    let edit = "";
    edit += getGraphicPosEdit(graphic);
    edit += "Graphic.map modify 1 +" + dc;
    return edit;
}


function copyEdit(graphic) {
    let position = getElementPosition(graphic);
    let edit = "";
    
    if (position.length <= 2) {
        edit += "copy " + position[0];
    } else {
        edit += "modify " + position[0];

        for (let i = 1; i < position.length - 1; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";

            if (i !== position.length - 2) {
                edit = edit + " modify " + index;
            }
        }

        edit += " copy " + (position[position.length - 2]);
    }

    return edit;
}


function delEdit(graphic) {
    let position = getElementPosition(graphic);
    let edit = "";

    if (position.length <= 2) {
        edit += "delete " + position[0];
    } else {
        edit += "modify " + position[0];

        for (let i = 1; i < position.length - 1; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";

            if (i !== position.length - 2) {
                edit = edit + " modify " + index;
            }
        }

        edit += " delete " + (position[position.length - 2]);
    }

    return edit;
}


function copyGroupEdit(group) {
    let position = getElementPosition(group);
    let edit = "";

    if (position.length < 2) {
        edit += "copy " + position[0];
    } else {
        edit += "modify " + position[0];

        for (let i = 1; i < position.length; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";

            if (i !== position.length - 1) {
                edit = edit + " modify " + index;
            } else {
                edit += " copy " + (position[position.length - 1]);
            }
        }
    }

    return edit;
}


function delGroupEdit(group) {
    let position = getElementPosition(group);
    let edit = "";

    if (position.length < 2) {
        edit += "delete " + position[0];
    } else {
        edit += "modify " + position[0];

        for (let i = 1; i < position.length; i++) {
            let index = position[i];
            edit += " Graphic.map modify 1";

            if (i !== position.length - 1) {
                edit = edit + " modify " + index;
            } else {
                edit += " delete " + (position[position.length - 1]);
            }
        }
    }

    return edit;
}


function drawEdit(atomicGroup) {
    const index = Array.from(svg.children).indexOf(atomicGroup);
    const graphic = atomicGroup.firstChild;
    const color = getHslAttr(graphic, graphicAttrs[graphic.tagName][0]);
    const rotation = getRotationCenter(graphic).rotation;

    if (graphic.tagName !== "polygon") {
        let otherAttrs = [];
        for (let i=1; i< graphicAttrs[graphic.tagName].length; i++) {
            otherAttrs.push(graphic.getAttribute(graphicAttrs[graphic.tagName][i]));
        }
        const graphicParam = graphic.tagName + " [" + rotation + ", " + color + ", " + otherAttrs + "]";

        return "insert " + index + " " + graphicParam;
    } else {
        let points = [];
        Array.from(graphic.points).map(point => {points.push ("(" + point.x +"," + point.y + ")")});
        return "insert " + index + " " + graphic.tagName + " [" + rotation + ", " + color + ", [" + points + "]]";
    }
}


function rotateEdit(element, angleDiff) {
    let edit = "";
    if (element.tagName === "g") {
        edit += getGroupPosEdit(element);
    } else {
        edit += getGraphicPosEdit(element);
    }
    edit += "Graphic.map modify 0 +" + angleDiff;

    return edit;
}


function equidistantXEdit(group, x1, dis) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 "
    edit += "{\\x->Graphic.map modify 2 (rewr x)|";
    edit += "\\i->(" + x1 + "+i*" + dis +", i+1)<|0}";
    return edit;
}

function equidistantYEdit(group, x1, dis) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 "
    edit += "{\\y->Graphic.map modify 3 (rewr y)|";
    edit += "\\i->(" + x1 + "+i*" + dis +", i+1)<|0}";
    return edit;
}

function equiradiusEdit(group, r1, dis) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 "
    edit += "{\\x->Graphic.map modify 4 (rewr x)|";
    edit += "\\i->(" + r1 + "-i*" + dis +", i+1)<|0}";
    return edit;
}

function centerAlignEdit(group) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 ?x1=>?y1=>((Graphic.map (modify 2 &x1).(modify 3 &y1))::";
    edit += "{\\x->Graphic.map (modify 2 (rewr x1)).(modify 3 (rewr y1))|\\i->(0, i+1)<|0})";
    return edit;
}

function xAlignEdit(group) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 ?x1=>((Graphic.map modify 2 &x1)::";
    edit += "{\\x->Graphic.map modify 2 (rewr x1)|\\i->(0, i+1)<|0})";
    return edit;
}

function yAlignEdit(group) {
    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 ?y1=>((Graphic.map modify 3 &y1)::";
    edit += "{\\x->Graphic.map modify 3 (rewr y1)|\\i->(0, i+1)<|0})";
    return edit;
}

function equiangleEdit(group, cx, cy) {
    const n = group.children.length;
    const angle = (360 / n) * Math.PI / 180;
    const sinV = Math.sin(angle).toFixed(2);
    const cosV = Math.cos(angle).toFixed(2);
    const graphic = group.children[0].firstChild;
    const attr1 = graphicAttrs[graphic.tagName][1];
    const attr2 = graphicAttrs[graphic.tagName][2];
    const x1 = graphic.getAttribute(attr1);
    const y1 = graphic.getAttribute(attr2);

    let edit = "";
    edit += getGroupPosEdit(group);
    edit += "Graphic.map modify 1 (id::";
    edit += "{\\(x,y)->Graphic.map [id,id,rewr x, rewr y,id,id]|\\(x,y)->let dx=x-"+cx+" in let dy=y-"+cy+
            " in let dx1=dx*("+cosV+")-dy*("+sinV+") in let dy1=dx*("+sinV+")+dy*("+cosV+") in ((dx1+"+cx+",dy1+"+cy+"),(dx1+"+cx+",dy1+"+cy+"))<|("+x1+","+y1+")})"
    return edit;
}