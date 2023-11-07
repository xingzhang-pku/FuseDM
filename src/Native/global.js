const body = document.getElementById("body");
const svg = document.getElementById("output-svg");
const svgRect = svg.getBoundingClientRect();
const menuBar = document.getElementById("menu-bar");
const backbtn = document.getElementById("back-button");

// editBar.style.display = "flex-box";

const editMenu = document.createElement("ul");
const attrItem = document.createElement("li");
const copyItem = document.createElement("li");
const colorItem = document.createElement("li");
const delItem = document.createElement("li");

const colorMenu = document.createElement("ul");
const attrMenu = document.createElement("ul");


editMenu.classList.add("menu");
attrMenu.classList.add("sub-menu");
colorMenu.classList.add("sub-menu");


colorItem.textContent = "Set Color";
attrItem.textContent = "Select";
copyItem.textContent = "Copy";
delItem.textContent = "Delete";

const colorPicker = document.createElement("li");
const colorGradient = document.createElement("div");
const colorSlider = document.createElement("input");

colorPicker.appendChild(colorGradient);
colorPicker.appendChild(colorSlider);

colorPicker.classList.add("color-picker");
colorGradient.classList.add("color-gradient");

colorSlider.classList.add("color-slider");
colorSlider.id = "color-slider";
colorSlider.type = "range";
colorSlider.min = "0";
colorSlider.max = "360";
colorSlider.value = "0";

colorMenu.appendChild(colorPicker);

attrItem.appendChild(attrMenu);
colorItem.appendChild(colorMenu);

editMenu.appendChild(attrItem);
editMenu.appendChild(colorItem);
editMenu.appendChild(copyItem);
editMenu.appendChild(delItem);

editMenu.style.position = "fixed";
editMenu.style.display = "none";
body.appendChild(editMenu);

const groupMenu = document.createElement("ul");
const xAlignItem = document.createElement("li");
const yAlignItem = document.createElement("li");
const delGroupItem = document.createElement("li");
const copyGroupItem = document.createElement("li");
const equiangleItem = document.createElement("li");
const equidistantXItem = document.createElement("li");
const equidistantYItem = document.createElement("li");
const equiradiusItem = document.createElement("li");
const centerAlignItem = document.createElement("li");

groupMenu.classList.add("menu");
copyGroupItem.textContent = "Copy";
delGroupItem.textContent = "Delete";
xAlignItem.textContent = "Align (-X)";
yAlignItem.textContent = "Align (-Y)";
equiangleItem.textContent = "Equiangle";
equidistantXItem.textContent = "EquidistantX";
equidistantYItem.textContent = "EquidistantY";
equiradiusItem.textContent = "Equiradius";
centerAlignItem.textContent = "Align (Center)";

groupMenu.appendChild(copyGroupItem);
groupMenu.appendChild(delGroupItem);
groupMenu.appendChild(xAlignItem);
groupMenu.appendChild(yAlignItem);
groupMenu.appendChild(equiangleItem);
groupMenu.appendChild(equidistantXItem);
groupMenu.appendChild(equidistantYItem);
groupMenu.appendChild(equiradiusItem);
groupMenu.appendChild(centerAlignItem);

const equiangleMenu = document.createElement("ul");
const rotateCenterItem = document.createElement("li");
rotateCenterItem.style.display = "inline-flex";

equiangleMenu.classList.add("sub-menu");
equiangleMenu.appendChild(rotateCenterItem);
equiangleItem.appendChild(equiangleMenu);

const rotateCenterInput = document.createElement("input");
const rotateCenterConfirm = document.createElement("button");
rotateCenterInput.style.width = "70px";
rotateCenterInput.style.fontFamily = "verdana";
rotateCenterInput.placeholder = "x,y";
rotateCenterConfirm.textContent = "√";
rotateCenterConfirm.classList.add("btn");
rotateCenterConfirm.style.width = "22px";
rotateCenterConfirm.style.fontSize = "12px";
rotateCenterItem.appendChild(rotateCenterInput);
rotateCenterItem.appendChild(rotateCenterConfirm);

const graphicSelector  = document.createElement("select");
const drawButton = document.createElement("button");
const drawNoneOption = document.createElement("option");

drawButton.classList.add("btn");
drawButton.textContent = "Draw";
drawButton.style.width = "50px";
drawButton.style.marginLeft = "5px";

drawNoneOption.value = "none";
drawNoneOption.textContent = "None";

graphicSelector.appendChild(drawNoneOption);
graphicSelector.classList.add("btn");

menuBar.appendChild(graphicSelector);
menuBar.appendChild(drawButton);

groupMenu.style.position = "fixed";
groupMenu.style.display = "none";
body.appendChild(groupMenu);

const groupButton  = document.createElement("button");

groupButton.id = "group-button";
groupButton.textContent = "Group";
groupButton.classList.add("btn");

menuBar.appendChild(groupButton);

groupButton.addEventListener("click", function() {
    const groupBorderElements = svg.querySelectorAll(".group-border");
    const groupCornerElements = svg.querySelectorAll(".group-corner");
    const groupRotateHandlers = svg.querySelectorAll(".group-rotate-handler");

    groupBorderElements.forEach(function(groupBorder) {
        groupBorder.style.display = "block";
    });

    groupCornerElements.forEach(function(groupCorner) {
        groupCorner.style.display = "block";
    });

    groupRotateHandlers.forEach(function(groupRotateHandler) {
        groupRotateHandler.style.display = "block";
    });
});

svg.addEventListener('dblclick', function(e) {
    if(e.target === svg) {
        clear();
    }
});

var gEdit = "";
var svgState = 0; // 0: selectionRect, 1: draw, 2: drawPolygon
var iterateObject = null;

var graphicIndex = {
    "rect"    : 0,
    "line"    : 0,
    "circle"  : 0,
    "ellipse" : 0,
    "polygon" : 0
}

backbtn.addEventListener("click", function() {
    app.ports.getEdit.send(gEdit);
    gEdit = "";
});

const graphicAttrs = {
    "rect" : ["fill", "x", "y", "width", "height"],
    "circle" : ["fill", "cx", "cy", "r"],
    "ellipse" : ["fill", "cx", "cy", "rx", "ry"],
    "line" : ["stroke", "x1", "y1", "x2", "y2"],
    "polygon": ["fill", "points"],
}


function setAtomicGroup(group) {
    let graphic = group.childNodes[0];
    let corner = group.childNodes[1];
    let label = group.childNodes[2];

    let cx = 0, cy = 0, x = 0, y = 0, gcx = 0, gcy = 0;

    switch(graphic.tagName) {
        case "rect": 
            const gx = parseInt(graphic.getAttribute("x"));
            const gy = parseInt(graphic.getAttribute("y"));
            cx = gx + parseInt(graphic.getAttribute("width"));
            cy = gy + parseInt(graphic.getAttribute("height"));
            x = gx;
            y = gy-4;
            break;
        case "ellipse":
            const grx = parseInt(graphic.getAttribute("rx"));
            const gry = parseInt(graphic.getAttribute("ry"));
            gcx = parseInt(graphic.getAttribute("cx"));
            gcy = parseInt(graphic.getAttribute("cy"));
            cx = gcx + grx;
            cy = gcy + gry;
            x = gcx - grx;
            y = gcy - gry;
            break;
        case "circle":
            const gr = parseInt(graphic.getAttribute("r"));
            gcx = parseInt(graphic.getAttribute("cx"));
            gcy = parseInt(graphic.getAttribute("cy"));
            cx = gcx + gr;
            cy = gcy;
            x = gcx - gr;
            y = gcy - gr;
            break;
        case "line":
            cx = parseInt(graphic.getAttribute("x2"));
            cy = parseInt(graphic.getAttribute("y2"));
            x = parseInt(graphic.getAttribute("x1"));
            y = parseInt(graphic.getAttribute("y1"))-5;
            break;
    }
    
    corner.setAttribute("cx", cx);
    corner.setAttribute("cy", cy);
    label.setAttribute("x", x);
    label.setAttribute("y", y);

    setTimeout(function() {
        const rotation = graphic.getAttribute('transform');
        corner.setAttribute("transform", rotation);
        label.setAttribute("transform", rotation);
    }, 0);
}


function getHslAttr(graphic, attr) {
    let hslRegex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
    let hslMatch = graphic.getAttribute(attr).match(hslRegex);

    if (hslMatch) {
        return parseInt(hslMatch[1]);
    } else {
        throw new Error("Get Hsl Attribute " + attr + " Error.");
    }
}


function setGraphicId(graphic) {
    const tagName = graphic.tagName;

    graphicIndex[tagName]++;
    graphic.id = tagName + graphicIndex[tagName];
}


function clear() {
    const groupBorderElements = svg.querySelectorAll(".group-border");
    const groupCornerElements = svg.querySelectorAll(".group-corner");
    const groupRotateHandlers = svg.querySelectorAll(".group-rotate-handler");
    const highlightedElements = svg.querySelectorAll(".highlight");

    groupBorderElements.forEach(element => {
        element.style.display = "none";
    });

    groupCornerElements.forEach(element => {
        element.style.display = "none";
    });

    groupRotateHandlers.forEach(element => {
        element.style.display = "none";
    });

    highlightedElements.forEach(element => {
        element.classList.remove("highlight");
    });

    selectedGroup = null;
    selectedElements = [];
    selectedElementsFlag = [];
    editMenu.style.display = "none";
    groupMenu.style.display = "none";
    selectRectMenu.style.display = "none";
}


function setAllGroups() {
    const groups = svg.querySelectorAll(".wrapper");

    groups.forEach(function(group) {
        setBoundingRect(group);
    });
}


function setBoundingRect(group) {
    const corner = group.childNodes[1];
    const border = group.childNodes[2];
    const rotateHandler = group.childNodes[3];

    setTimeout(() => {
        const boundingRect = group.firstChild.getBBox();
        const rotationAttr = group.firstChild.getAttribute('transform');

        border.setAttribute("x", boundingRect.x);
        border.setAttribute("y", boundingRect.y);
        border.setAttribute("width", boundingRect.width);
        border.setAttribute("height", boundingRect.height);
        corner.setAttribute("cx", boundingRect.x + boundingRect.width + 3);
        corner.setAttribute("cy", boundingRect.y + boundingRect.height + 3);
        rotateHandler.setAttribute("cx", boundingRect.x + boundingRect.width/2);
        rotateHandler.setAttribute("cy", boundingRect.y);

        border.setAttribute("transform", rotationAttr);
        corner.setAttribute("transform", rotationAttr);
        rotateHandler.setAttribute("transform", rotationAttr);
    }, 0);
}


function setPolygon(group) {
    const polygon = group.children[0];
    const corners = group.children[1];
    const label = group.children[2];

    for(let i = 0; i < polygon.points.length; i++) {
        corners.children[i].setAttribute("cx", polygon.points[i].x);
        corners.children[i].setAttribute("cy", polygon.points[i].y);
    }

    setTimeout(() => {
        const boundingRect = polygon.getBBox();
        const rotation = polygon.getAttribute('transform');

        label.setAttribute("x", boundingRect.x);
        label.setAttribute("y", boundingRect.y - 10);
        label.setAttribute("transform", rotation);
        corners.setAttribute("transform", rotation);
    }, 0);
}


function getRotationCenter(element) {
    const transformAttr = element.getAttribute("transform");

    const rotationRegex = /rotate\(([-0-9.e]+)\s+([-0-9.e]+)\s+([-0-9.e]+)\)/;

    const rotationMatch = transformAttr.match(rotationRegex);

    if (rotationMatch) {
        const rotationAngle = parseFloat(rotationMatch[1]);
        const centerX = parseFloat(rotationMatch[2]);
        const centerY = parseFloat(rotationMatch[3]);

        return {
            rotation: rotationAngle,
            centerX: centerX,
            centerY: centerY
        };
    }
    
    return {
        rotation: 0,
        centerX: 0,
        centerY: 0
    };
}


function setRotation(element) {
    const transformAttr = element.getAttribute("transform");
    const rotationRegex = /rotate\(([-0-9.e]+)\)/;
    const rotationMatch = transformAttr.match(rotationRegex);

    if (rotationMatch) {
        const rotationAngle = parseInt(rotationMatch[1]);

        setTimeout(() => {
            const boundingBox = element.getBBox();
            const rotationCenterX = boundingBox.x + boundingBox.width / 2;
            const rotationCenterY = boundingBox.y + boundingBox.height / 2;
            element.setAttribute("transform", "rotate(" + rotationAngle + " " + rotationCenterX + " " + rotationCenterY + ")");
        }, 0);
    }
}


function rotatePoint(x1, y1, rotation) {
    const theta = rotation.rotation * Math.PI / 180;
    const px = rotation.centerX;
    const py = rotation.centerY;

    const x = x1 - px;
    const y = y1 - py;

    let x_new = x * Math.cos(theta) - y * Math.sin(theta);
    let y_new = x * Math.sin(theta) + y * Math.cos(theta);

    x_new = Math.round(x_new + px);
    y_new = Math.round(y_new + py);

    return [x_new, y_new];
}