let polygonPoints = [];
let polygonGroup = null;
const pointsMenu = document.createElement("ul");
pointsMenu.classList.add("sub-menu");

svg.addEventListener('click', function(event) {
    if (svgState === 2) {
        const mouseX = Math.round(event.clientX - svgRect.left);
        const mouseY = Math.round(event.clientY - svgRect.top);

        const corner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        corner.setAttribute('cx', mouseX);
        corner.setAttribute('cy', mouseY);
        corner.classList.add('corner');
        corner.setAttribute('r', 5);
        polygonGroup.children[1].appendChild(corner);

        polygonPoints.push({ x: mouseX, y: mouseY });

        drawPolygon();
    }
});

function drawPolygon() {
    if (polygonPoints.length >= 2) {

        let polygonPointstring = polygonPoints.map(point => `${point.x},${point.y}`).join(' ');
        polygonGroup.firstChild.setAttribute('points', polygonPointstring);
        
        if (isClosedShape()) {
            polygonPoints.pop();
            polygonPointstring = polygonPoints.map(point => `${point.x},${point.y}`).join(' ');
            polygonGroup.firstChild.setAttribute('points', polygonPointstring);

            const polygon = polygonGroup.firstChild;
            polygon.setAttribute("transform", "rotate(0)");
            setRotation(polygon);

            let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.classList.add("graphic-label");
            label.innerHTML = polygonGroup.firstChild.id;

            const polygonBBox = polygonGroup.firstChild.getBBox();
            label.setAttribute('x', polygonBBox.x);
            label.setAttribute('y', polygonBBox.y - 10);

            polygonGroup.appendChild(label);
            polygonGroup.firstChild.setAttribute('fill', 'hsl(0, 100%, 50%)');

            const corners = polygonGroup.children[1];
            corners.removeChild(corners.lastChild);

            dragPolygon(polygonGroup);
            resizePolygon(polygonGroup);
            setMenuPolygon(polygonGroup);
            rotate(polygon, label);

            gEdit = drawEdit(polygonGroup);

            svgState = 0;
            polygonGroup = null;
            polygonPoints = [];  
        }
    }
}

function isClosedShape() {
    const firstPoint = polygonPoints[0];
    const lastPoint = polygonPoints[polygonPoints.length - 1];
    const radius = 6;

    const distance = Math.sqrt(
    Math.pow(lastPoint.x - firstPoint.x, 2) +
    Math.pow(lastPoint.y - firstPoint.y, 2)
    );

    return distance <= radius;
}


function dragPolygon(atomicGroup) {
    const polygon = atomicGroup.children[0];

    polygon.addEventListener('mousedown', function(event) {
        let startX = event.clientX;
        let startY = event.clientY;
        let deltaX = 0, deltaY = 0;
    
        const polygonPoints = Array.from(polygon.points);

        const rotation = getRotationCenter(polygon);
        const angle = rotation.rotation;
        const centerX = rotation.centerX;
        const centerY = rotation.centerY;
    
        svg.addEventListener('mousemove', dragP);
        svg.addEventListener('mouseup', stopDragP);
    
        function dragP(event) {
            deltaX = event.clientX - startX;
            deltaY = event.clientY - startY;
    
            const newPoints = polygonPoints.map(point => {
                const newPoint = svg.createSVGPoint();
                newPoint.x = point.x + deltaX;
                newPoint.y = point.y + deltaY;
                return newPoint;
            });
    
            const newPointsString = newPoints.map(point => `${point.x},${point.y}`).join(' ');
            polygon.setAttribute('points', newPointsString);
            polygon.setAttribute('transform', `rotate(${angle} ${centerX+deltaX} ${centerY+deltaY})`);
    
            setPolygon(atomicGroup);
            setAllGroups();
        }
    
        function stopDragP() {
            gEdit = dragPolygonEdit(polygon, deltaX, deltaY);
            svg.removeEventListener('mousemove', dragP);
            svg.removeEventListener('mouseup', stopDragP);
        }
    });   
}


function resizePolygon(atomicGroup){
    const polygon = atomicGroup.children[0];
    const corners = atomicGroup.children[1];

    Array.from(corners.children).forEach(corner => {
        corner.addEventListener('mousedown', function(event) {
            let deltaX = 0, deltaY = 0;

            const polygonPoints = Array.from(polygon.points);
            const index = Array.from(corners.children).indexOf(corner);
        
            svg.addEventListener('mousemove', resizeP);
            svg.addEventListener('mouseup', stopResizeP);
        
            function resizeP(event) {
                const pt = svg.createSVGPoint();
                pt.x = event.clientX;
                pt.y = event.clientY;

                const globalPt = pt.matrixTransform(polygon.getScreenCTM().inverse());

                deltaX = Math.round(globalPt.x - polygonPoints[index].x);
                deltaY = Math.round(globalPt.y - polygonPoints[index].y);

                let newPoints = polygonPoints.map(point => {
                    const newPoint = svg.createSVGPoint();
                    newPoint.x = point.x;
                    newPoint.y = point.y;
                    return newPoint;
                });
                
                newPoints[index].x = globalPt.x;
                newPoints[index].y = globalPt.y;
        
                const newPointsString = newPoints.map(point => `${point.x},${point.y}`).join(' ');
                polygon.setAttribute('points', newPointsString);
        
                setPolygon(atomicGroup);
                setAllGroups();
            }
        
            function stopResizeP() {
                gEdit = resizePolygonEdit(polygon, index, deltaX, deltaY);
                svg.removeEventListener('mousemove', resizeP);
                svg.removeEventListener('mouseup', stopResizeP);
            }
        });
    });
}


function setMenuPolygon(atomicGroup) {
    const polygon = atomicGroup.firstChild;

    polygon.addEventListener("dblclick", function(event) {
            
        getEditMenuSelectOptions(polygon);
    
        editMenu.style.left = event.pageX + "px";
        editMenu.style.top = event.pageY + "px";
        editMenu.style.display = "block";
    
        const color = getHslAttr(polygon, "fill");
    
        colorSlider.removeEventListener('input', colorSlider.inputHandler);
        colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);

        colorSlider.inputHandler = () => inputColor(polygon);
        colorSlider.mouseUpHandler = () => setColor(polygon, color);
        
        colorSlider.addEventListener('input', colorSlider.inputHandler);
        colorSlider.addEventListener('mouseup', colorSlider.mouseUpHandler);
        
        delItem.removeEventListener("click", delItem.clickHandler);
        copyItem.removeEventListener("click", copyItem.clickHandler);

        delItem.clickHandler = () => del(polygon);
        copyItem.clickHandler = () => copyPolygon(polygon);

        delItem.addEventListener("click", delItem.clickHandler);
        copyItem.addEventListener("click", copyItem.clickHandler);
    });
}


function copyPolygon(polygon) {
    gEdit = copyEdit(polygon);

    const curGroup = polygon.parentNode;
    const outerGroup = curGroup.parentNode;
    const clonedGroup = curGroup.cloneNode(true);

    const clonedLabel = clonedGroup.children[2];
    const clonedPolygon = clonedGroup.children[0];

    outerGroup.insertBefore(clonedGroup, curGroup.nextSibling);

    setGraphicId(clonedPolygon);
    clonedLabel.textContent = clonedPolygon.id;

    dragPolygon(clonedGroup);
    resizePolygon(clonedGroup);
    setMenuPolygon(clonedGroup);
    rotate(clonedPolygon, clonedLabel);

    editMenu.style.display = "none";

    colorSlider.removeEventListener('input', colorSlider.inputHandler);
    colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
}