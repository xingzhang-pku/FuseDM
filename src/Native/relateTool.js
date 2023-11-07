var graph2AttrsInCtt = new Map();
var attr2Value = new Map();

const relateInput1 = document.createElement("input");
const relateInput2 = document.createElement("input");
const relateSubmit = document.createElement("button");
const equalSym = document.createElement("a");

relateSubmit.id = "relate-button";
relateInput1.id = "relate-input-1";
relateInput2.id = "relate-input-2";

equalSym.textContent = "=";
equalSym.style.marginTop = "0.6%";

relateSubmit.textContent = "Relate";
relateSubmit.classList.add("btn");

menuBar.appendChild(relateSubmit);
menuBar.appendChild(relateInput1);
menuBar.appendChild(equalSym);
menuBar.appendChild(relateInput2);

relateSubmit.addEventListener("click", function() {
    let relateExpr = relateInput2.value;

    const replacedExpression = relateExpr.replace(/[a-z]+[0-9]+_[a-z]+[0-9]*/g, (match) => {
        if (attr2Value.has(match)) {
            return attr2Value.get(match);
        }
        throw new Error(`Undefined Variable: ${match}`);
    });

    let attrVal = eval(replacedExpression);
    let relateTarget = relateInput1.value.split("_");
    let relateGraphic = relateTarget[0];
    let relateAttr = relateTarget[1];
    let graphic = document.getElementById(relateGraphic);

    if (relateAttr === "fill" || relateAttr === "stroke") {
        graphic.setAttribute(relateAttr, "hsl(" + attrVal + ", 100%, 50%)");
    } else {
        if (graphic.tagName === "polygon") {
            let newPoints = Array.from(graphic.points).map(point => {
                const newPoint = svg.createSVGPoint();
                newPoint.x = point.x;
                newPoint.y = point.y;
                return newPoint;
            });
            
            let index = parseInt(relateAttr.slice(1), 10);

            if (relateAttr[0] === "x") {
                newPoints[index].x = attrVal;
            } else {
                newPoints[index].y = attrVal;
            }
    
            const newPointsString = newPoints.map(point => `${point.x},${point.y}`).join(' ');
            graphic.setAttribute('points', newPointsString);
            setPolygon(graphic.parentNode);
        } else {
            graphic.setAttribute(relateAttr, attrVal);
            setAtomicGroup(graphic.parentNode);
        }
    }

    setAllGroups();
    
    gEdit = relateEdit(relateTarget, relateExpr, attr2Value, graph2AttrsInCtt);
    colorSlider.removeEventListener('input', colorSlider.inputHandler);
    colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
    relateInput1.value = "";
    relateInput2.value = "";

    attr2Value.clear();
    graph2AttrsInCtt.clear();
});