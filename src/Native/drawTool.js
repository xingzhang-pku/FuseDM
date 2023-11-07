var graphicOptions = ["line", "rect", "circle", "ellipse", "polygon"];

for (let i = 0; i<graphicOptions.length; i++){
    const tag = graphicOptions[i];
    const option = document.createElement("option");

    option.value = tag;
    option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

    graphicSelector.appendChild(option);
}

drawButton.addEventListener("click", function(){
    const selected = graphicSelector.value;
    if (selected == "none"){
        return;
    }

    if (selected === "polygon"){
        svgState = 2;

        const atomicGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const cornerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        cornerGroup.classList.add("corner-group");

        polygon.setAttribute("fill", "lightgray");
        setGraphicId(polygon);
        
        atomicGroup.appendChild(polygon);
        atomicGroup.appendChild(cornerGroup);
        atomicGroup.classList.add("atomic");
        svg.insertBefore(atomicGroup, selectionRect);

        polygonGroup = atomicGroup;
    } else {
        svgState = 1;
    }
});

svg.addEventListener("mousedown", function(e){
    if (e.target === svg && svgState === 1){
        const startX = e.clientX;
        const startY = e.clientY;
        const tag = graphicSelector.value;
        const graphic = document.createElementNS("http://www.w3.org/2000/svg", tag);

        setGraphicId (graphic);
        
        if (tag === "line") {
            graphic.setAttribute("stroke-width", 3);
            graphic.setAttribute(graphicAttrs[tag][3], Math.round(e.clientX - svgRect.left));
            graphic.setAttribute(graphicAttrs[tag][4], Math.round(e.clientY - svgRect.top));
        }

        graphic.setAttribute(graphicAttrs[tag][1], Math.round(e.clientX - svgRect.left));
        graphic.setAttribute(graphicAttrs[tag][2], Math.round(e.clientY - svgRect.top));
        graphic.setAttribute(graphicAttrs[tag][0], "hsl(0, 100%, 50%)");

        svg.appendChild(graphic);

        svg.addEventListener("mousemove", draw);
        svg.addEventListener("mouseup", drawEnd);

        function draw(e) {
            if (svgState === 1) {
                const dx = Math.round(e.clientX - startX);
                const dy = Math.round(e.clientY - startY);
                
                if (tag === "circle") {
                    graphic.setAttribute("r", dx);  
                } else if (tag === "line") {
                    const x1 = parseInt(graphic.getAttribute("x1"));
                    const y1 = parseInt(graphic.getAttribute("y1"));
                    graphic.setAttribute(graphicAttrs[graphic.tagName][3], x1+dx);
                    graphic.setAttribute(graphicAttrs[graphic.tagName][4], y1+dy);
                } else {
                    graphic.setAttribute(graphicAttrs[graphic.tagName][3], dx);
                    graphic.setAttribute(graphicAttrs[graphic.tagName][4], dy);
                }
            }
        }

        function drawEnd() {
            if (svgState === 1) {
                const atomicGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                const corner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

                corner.classList.add("corner");
                corner.setAttribute("r", 5);
                
                label.classList.add("graphic-label");
                label.innerHTML = graphic.id;
                
                graphic.setAttribute("transform", "rotate(0)");
                setRotation(graphic);
                
                atomicGroup.classList.add("atomic");
                atomicGroup.style.cursor = "pointer";

                atomicGroup.appendChild(graphic);
                atomicGroup.appendChild(corner);
                atomicGroup.appendChild(label);
                
                setAtomicGroup(atomicGroup);

                svg.insertBefore(atomicGroup, selectionRect);
                gEdit = drawEdit(atomicGroup);

                drag(graphic);
                setMenu(graphic);
                resize(graphic, corner);
                rotate(graphic, label);
                
                svgState = 0;

                svg.removeEventListener("mousemove", draw);
                svg.removeEventListener("mouseup", drawEnd);
            }
        }
    }
});