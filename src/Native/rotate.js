function rotate(element, label) {
    label.addEventListener("mousedown", function(event) {
        let svgPoint = svg.createSVGPoint();
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;

        let angleDiff = 0;
        
        let transformedPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

        const rotation = getRotationCenter(element);
        const rotationCenter = {x:rotation.centerX, y:rotation.centerY};
        const startAngle = getAngle(transformedPoint, rotationCenter);

        const oriAngle = getRotationCenter(element).rotation;

        document.addEventListener('mousemove', rotating);
        document.addEventListener('mouseup', stopRotate);

        function rotating(event) {
            svgPoint = svg.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            transformedPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
    
            const currentAngle = getAngle(transformedPoint, rotationCenter);
    
            angleDiff = Math.round(currentAngle - startAngle);
            const angle = (oriAngle + angleDiff) % 360;
    
            element.setAttribute("transform", "rotate(" + angle + " " + rotationCenter.x + " " + rotationCenter.y + ")");
            if (element.tagName === "polygon") {
                setPolygon(element.parentNode);
            } else if (element.tagName === "g"){
                setAllGroups();
            } else {
                setAtomicGroup(element.parentNode);
            }
        };

        function stopRotate() {
            if (element.classList.contains("highlight")) {
                const index = 
                Array.from(element.parentNode.parentNode.children).indexOf(element.parentNode);
        
                iterateEdits[index][0] = angleDiff;
            } else {
                gEdit = rotateEdit(element, angleDiff);
            }
            document.removeEventListener('mousemove', rotating);
            document.removeEventListener('mouseup', stopRotate);
        }
    });
}


function getAngle(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
}