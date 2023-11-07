function drag(graphic) {
    graphic.addEventListener('mousedown', function(event) {
        let startX = event.clientX;
        let startY = event.clientY;
        let dx = 0, dy = 0;
        let gx = 0, gy = 0, gx1 = 0, gy1 = 0;

        const tag = graphic.tagName;

        if (tag === "line") {
            gx1 = parseInt(graphic.getAttribute("x2"));
            gy1 = parseInt(graphic.getAttribute("y2"));
        }

        gx = parseInt(graphic.getAttribute(graphicAttrs[tag][1]));
        gy = parseInt(graphic.getAttribute(graphicAttrs[tag][2]));

        const rotation = getRotationCenter(graphic);
        const angle = rotation.rotation;
        const centerX = rotation.centerX;
        const centerY = rotation.centerY; 

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);

        function moveHandler(event) {
            dx = Math.round(event.clientX - startX);
            dy = Math.round(event.clientY - startY);

            if (tag === "line") {
                graphic.setAttribute("x2", gx1+dx);
                graphic.setAttribute("y2", gy1+dy);
            }

            graphic.setAttribute(graphicAttrs[tag][1], gx+dx);
            graphic.setAttribute(graphicAttrs[tag][2], gy+dy);

            graphic.setAttribute("transform", `rotate(${angle} ${centerX+dx} ${centerY+dy})`);
            
            setAtomicGroup(graphic.parentNode);
            setAllGroups();
        }
        
        function upHandler() {
            if (graphic.classList.contains("highlight")) {
                const index = Array.from(graphic.parentNode.parentNode.children).indexOf(graphic.parentNode);
                switch (graphic.tagName) {
                    case "rect": 
                        iterateEdits[index][2] = dx; iterateEdits[index][3] = dy; break;
                    case "ellipse": 
                        iterateEdits[index][2] = dx; iterateEdits[index][3] = dy; break;
                    case "circle": 
                        iterateEdits[index][2] = dx; iterateEdits[index][3] = dy; break;
                    case "line": 
                        iterateEdits[index][2] = dx; iterateEdits[index][3] = dy; 
                        iterateEdits[index][4] = dx; iterateEdits[index][5] = dy; break;
                }
            } else {
                gEdit = dragEdit(graphic, dx, dy);
            }
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
    });
}