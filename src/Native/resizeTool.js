function resize(graphic, corner) {
    corner.addEventListener("mousedown", function(){
        let w = 0, h = 0;
        let dx = 0, dy = 0;
        let x1 = 0, y1 = 0;
        let ogx = 0, ogy = 0;
        let newPoint1 = null;
        let globalPoint = null;

        ogx = parseInt(graphic.getAttribute(graphicAttrs[graphic.tagName][1]));
        ogy = parseInt(graphic.getAttribute(graphicAttrs[graphic.tagName][2]));
        
        w = parseInt(graphic.getAttribute(graphicAttrs[graphic.tagName][3]));
        
        if (graphic.tagName !== "circle") {
            h = parseInt(graphic.getAttribute(graphicAttrs[graphic.tagName][4]));
        }

        const rotation = getRotationCenter(graphic);

        if (graphic.tagName === "line" && rotation.rotation !== 0) {
            x1 = parseInt(graphic.getAttribute("x1"));
            y1 = parseInt(graphic.getAttribute("y1"));
            newPoint1 = rotatePoint(x1, y1, rotation);
            
            graphic.setAttribute("x1", Math.round(newPoint1[0]));
            graphic.setAttribute("y1", Math.round(newPoint1[1]));

            graphic.setAttribute("transform", "rotate(0 0 0)");
        }

        document.addEventListener("mouseup", upHandler);
        document.addEventListener("mousemove", moveHandler);

        function upHandler() {
            if (graphic.classList.contains("highlight")) {
                const index = 
                Array.from(graphic.parentNode.parentNode.children).indexOf(graphic.parentNode);

                if (graphic.tagName === "circle") {
                    iterateEdits[index][4] = dx;
                } else {
                    iterateEdits[index][4] = dx; 
                    iterateEdits[index][5] = dy;
                }
            } else {
                if (graphic.tagName === "line" && rotation.rotation !== 0) {
                    gEdit = resizeLineEdit(graphic, 
                        Math.round(newPoint1[0]), Math.round(newPoint1[1]), 
                        Math.round(globalPoint.x), Math.round(globalPoint.y));
                } else {
                    gEdit = resizeEdit(graphic, dx, dy);
                }
            }
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("mousemove", moveHandler);
        }

        function moveHandler(event) {
            let pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;

            globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

            let deltaX = Math.round(globalPoint.x) - rotation.centerX;
            let deltaY = Math.round(globalPoint.y) - rotation.centerY;

            let rotatedPoint = {
                x: rotation.centerX + deltaX * Math.cos(rotation.rotation * Math.PI / 180) + deltaY * Math.sin(rotation.rotation * Math.PI / 180),
                y: rotation.centerY - deltaX * Math.sin(rotation.rotation * Math.PI / 180) + deltaY * Math.cos(rotation.rotation * Math.PI / 180)
            };

            const width = Math.abs(rotatedPoint.x - ogx);
            const height = Math.abs(rotatedPoint.y - ogy);

            dx = Math.round(width - w);
            dy = Math.round(height - h);

            if (graphic.tagName === "circle") { 
                graphic.setAttribute(graphicAttrs[graphic.tagName][3], width);

            } else if (graphic.tagName === "line") {
                dx = Math.round(globalPoint.x - w);
                dy = Math.round(globalPoint.y - h);
                graphic.setAttribute("x2", Math.round(globalPoint.x));
                graphic.setAttribute("y2", Math.round(globalPoint.y));
                
            } else {
                graphic.setAttribute(graphicAttrs[graphic.tagName][3], width);
                graphic.setAttribute(graphicAttrs[graphic.tagName][4], height);
            }

            setAtomicGroup(graphic.parentNode);
            setAllGroups();
        }
    });
}