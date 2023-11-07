app.ports.genCanvas.subscribe(function(code) {
    svg.innerHTML = "";
    gEdit = "";
    
    Object.keys(graphicIndex).forEach(key => {
        graphicIndex[key] = 0;
    });

    attr2Value.clear();
    graph2AttrsInCtt.clear();

    relateInput1.value = "";
    relateInput2.value = "";

    selectedGroup = null;
    iterateEdits = null;
    
    svg.insertAdjacentHTML('afterbegin', code);

    setGraphics();
    setPolygons();
    wrapGroups();
    setAllGroups();
    svg.appendChild(selectionRect);
});


function setPolygons() {
    const polygons = svg.querySelectorAll("polygon");
    polygons.forEach(function(polygon) {
        
        setGraphicId (polygon);
        
        let atomicGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let corners = document.createElementNS("http://www.w3.org/2000/svg", "g");

        for (let i = 0; i < polygon.points.length; i++) {
            const corner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            corner.classList.add("corner");
            corner.setAttribute("r", 5);
            corners.appendChild(corner);
        }

        corners.classList.add("corner-group");

        label.classList.add("graphic-label");
        label.innerHTML = polygon.id;
    
        let clonedPolygon = polygon.cloneNode(true);
        setRotation(clonedPolygon);

        atomicGroup.classList.add("atomic");
        atomicGroup.style.cursor = "pointer";

        atomicGroup.appendChild(clonedPolygon);
        atomicGroup.appendChild(corners);
        atomicGroup.appendChild(label);

        setPolygon(atomicGroup);
        dragPolygon(atomicGroup);
        resizePolygon(atomicGroup);
        setMenuPolygon(atomicGroup);
        rotate(clonedPolygon, label);

        polygon.parentNode.replaceChild(atomicGroup, polygon);
    });
}


function setGraphics() {
    const graphics = svg.querySelectorAll("rect, circle, ellipse, line");
    graphics.forEach(function(graphic) {
        let atomicGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        setGraphicId (graphic);

        let corner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        let label = document.createElementNS("http://www.w3.org/2000/svg", "text");

        corner.classList.add("corner");
        corner.setAttribute("r", 5);
        
        label.classList.add("graphic-label");
        label.innerHTML = graphic.id;

        let clonedGraphic = graphic.cloneNode(true);
        setRotation(clonedGraphic);

        atomicGroup.classList.add("atomic");
        atomicGroup.style.cursor = "pointer";

        atomicGroup.appendChild(clonedGraphic);
        atomicGroup.appendChild(corner);
        atomicGroup.appendChild(label);

        setAtomicGroup(atomicGroup);

        graphic.parentNode.replaceChild(atomicGroup, graphic);

        drag(clonedGraphic);
        setMenu(clonedGraphic);
        resize(clonedGraphic, corner);
        rotate(clonedGraphic, label);
    });
}


function wrapGroups() {
    const groups = Array.from(svg.querySelectorAll("g"));
    const majorGroups = groups.filter(element => 
        !(element.classList.contains("atomic")||element.classList.contains("corner-group")));

    majorGroups.forEach(function(group) {
        const wrapperGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const corner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const rotateHandler = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        wrapperGroup.classList.add("wrapper");
        border.classList.add("group-border");
        corner.classList.add("group-corner");
        corner.classList.add("corner");
        corner.setAttribute("r", 5);
        
        rotateHandler.classList.add("group-rotate-handler");
        rotateHandler.classList.add("corner");
        rotateHandler.setAttribute("r", 5);

        setRotation(group);

        setGroupMenu(group, border);
        dragGroup(group, border);
        resizeGroup(group, corner);
        rotate(group, rotateHandler);

        group.parentNode.insertBefore(wrapperGroup, group);
        
        wrapperGroup.appendChild(group);
        wrapperGroup.appendChild(corner);
        wrapperGroup.appendChild(border);
        wrapperGroup.appendChild(rotateHandler);
    });
}