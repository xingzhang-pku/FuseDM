function setGroupMenu(group, border) {
    border.addEventListener("dblclick", function(event) {
        clear();
        
        selectedGroup = group;

        border.style.display = "block";
        border.classList.add("highlight");

        groupMenu.style.left = event.pageX + "px";
        groupMenu.style.top = event.pageY + "px";
        groupMenu.style.display = "block";

        xAlignItem.removeEventListener("click", xAlignItem.clickHandler);
        yAlignItem.removeEventListener("click", yAlignItem.clickHandler);
        delGroupItem.removeEventListener("click", delGroupItem.clickHandler);
        copyGroupItem.removeEventListener("click", copyGroupItem.clickHandler);
        equidistantXItem.removeEventListener("click", equidistantXItem.clickHandler);
        equidistantYItem.removeEventListener("click", equidistantYItem.clickHandler);
        rotateCenterConfirm.removeEventListener("click", rotateCenterConfirm.clickHandler);
        equiradiusItem.removeEventListener("click", equiradiusItem.clickHandler);
        centerAlignItem.removeEventListener("click", centerAlignItem.clickHandler);

        xAlignItem.clickHandler = () => xAlign(group);
        yAlignItem.clickHandler = () => yAlign(group);
        delGroupItem.clickHandler = () => delGroup(group);
        copyGroupItem.clickHandler = () => copyGroup(group);
        equidistantXItem.clickHandler = () => equidistantx(group);
        equidistantYItem.clickHandler = () => equidistanty(group);
        rotateCenterConfirm.clickHandler = () => equiangle(group);
        equiradiusItem.clickHandler = () => equiradius(group);
        centerAlignItem.clickHandler = () => centerAlign(group);

        xAlignItem.addEventListener("click", xAlignItem.clickHandler);
        yAlignItem.addEventListener("click", yAlignItem.clickHandler);
        delGroupItem.addEventListener("click", delGroupItem.clickHandler);
        copyGroupItem.addEventListener("click", copyGroupItem.clickHandler);
        equidistantXItem.addEventListener("click", equidistantXItem.clickHandler);
        equidistantYItem.addEventListener("click", equidistantYItem.clickHandler);
        rotateCenterConfirm.addEventListener("click", rotateCenterConfirm.clickHandler);
        equiradiusItem.addEventListener("click", equiradiusItem.clickHandler);
        centerAlignItem.addEventListener("click", centerAlignItem.clickHandler);
    });
}


function dragGroup(group, border) {
    border.addEventListener('mousedown', function(event) {
        let startX = event.clientX;
        let startY = event.clientY;
        let dx = 0, dy = 0;

        const clonedGroup = group.cloneNode(true);

        const rotation = getRotationCenter(group);
        const angle = rotation.rotation;
        const centerX = rotation.centerX;
        const centerY = rotation.centerY; 

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);

        function moveHandler(event) {
            dx = Math.round(event.clientX - startX);
            dy = Math.round(event.clientY - startY);

            setGroupPos(clonedGroup, group, dx, dy);
            group.setAttribute("transform", `rotate(${angle} ${centerX+dx} ${centerY+dy})`);
            
            setAllGroups();
        }
        
        function upHandler() {
            gEdit = dragGroupEdit(group, dx, dy);
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
    });
}


function resizeGroup(group, corner) {
    corner.addEventListener("mousedown", function(event){
        let startX = event.clientX;
        let startY = event.clientY;
        let dx = 0, dy = 0;

        const clonedGroup = group.cloneNode(true);
        const rotation = getRotationCenter(group);

        document.addEventListener("mouseup", upHandler);
        document.addEventListener("mousemove", moveHandler);

        function moveHandler(event) {
            const deltaX = Math.round(event.clientX - startX);
            const deltaY = Math.round(event.clientY - startY);
            
            dx = Math.round(deltaY * Math.sin(rotation.rotation * Math.PI / 180) + deltaX * Math.cos(rotation.rotation * Math.PI / 180));
            dy = Math.round(deltaY * Math.cos(rotation.rotation * Math.PI / 180) - deltaX * Math.sin(rotation.rotation * Math.PI / 180));

            setGroupSize(clonedGroup, group, dx, dy, rotation);
            setAllGroups();
        }

        function upHandler() {
            gEdit = resizeGroupEdit(group, dx, dy);
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("mousemove", moveHandler);
        }
    });
}


function setGroupPos(clonedGroup, group, dx, dy) {
    for(let i = 0; i < clonedGroup.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            setGroupPos(clonedGroup.children[i].firstChild, group.children[i].firstChild, dx, dy); 
            continue;
        }
        
        const graphic = group.children[i].firstChild;
        const clonedGraphic = clonedGroup.children[i].firstChild;

        const tag = graphic.tagName;
        if (tag === "line") {
            graphic.setAttribute("x2", parseInt(clonedGraphic.getAttribute("x2"))+dx);
            graphic.setAttribute("y2", parseInt(clonedGraphic.getAttribute("y2"))+dy);
        }

        graphic.setAttribute(graphicAttrs[tag][1], parseInt(clonedGraphic.getAttribute(graphicAttrs[tag][1]))+dx);
        graphic.setAttribute(graphicAttrs[tag][2], parseInt(clonedGraphic.getAttribute(graphicAttrs[tag][2]))+dy);

        setAtomicGroup(group.children[i]);
    }
}


function setGroupSize(clonedGroup, group, dx, dy) {
    for(let i = 0; i < clonedGroup.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            setGroupSize(
                clonedGroup.children[i].firstChild, 
                group.children[i].firstChild,
                dx, 
                dy);
            continue;
        }
        
        const graphic = group.children[i].firstChild;
        const clonedGraphic = clonedGroup.children[i].firstChild;

        if (graphic.tagName === "circle") {
            graphic.setAttribute("r", parseInt(clonedGraphic.getAttribute("r"))+dx);
        } else {
            graphic.setAttribute(graphicAttrs[graphic.tagName][3], parseInt(clonedGraphic.getAttribute(graphicAttrs[graphic.tagName][3]))+dx);
            graphic.setAttribute(graphicAttrs[graphic.tagName][4], parseInt(clonedGraphic.getAttribute(graphicAttrs[graphic.tagName][4]))+dy);
        }

        setAtomicGroup(group.children[i]);
    }
}


function copyGroup(group) {
    gEdit = copyGroupEdit(group);

    const wrappedGroup = group.parentNode;
    const outerGroup = wrappedGroup.parentNode;
    const clonedGroup = wrappedGroup.cloneNode(true);

    const innerGroup = clonedGroup.children[0];
    const clonedCorner = clonedGroup.children[1];
    const clonedBorder = clonedGroup.children[2];
    const clonedRotateHandler = clonedGroup.children[3];

    outerGroup.insertBefore(clonedGroup, wrappedGroup.nextSibling);

    setGroupMenu(innerGroup, clonedBorder);
    dragGroup(innerGroup,  clonedBorder);
    resizeGroup(innerGroup, clonedCorner);
    rotate(innerGroup, clonedRotateHandler);

    setGroupMembers(innerGroup);

    clear();

    colorSlider.removeEventListener('input', colorSlider.inputHandler);
    colorSlider.removeEventListener('mouseup', colorSlider.mouseUpHandler);
}


function delGroup(group) {
    gEdit = delGroupEdit(group);

    const wrappedGroup = group.parentNode;
    const outerGroup = wrappedGroup.parentNode;

    outerGroup.removeChild(wrappedGroup);
    clear();
}


function setGroupMembers(group) {
    for(let i = 0; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            setGroupMembers(group.children[i].firstChild);
            continue;
        }

        const atomicGroup = group.children[i];
        const graphic = atomicGroup.children[0];
        const corner = atomicGroup.children[1];
        const label = atomicGroup.children[2];

        setGraphicId(graphic);
        label.textContent = graphic.id;

        drag(graphic);
        setMenu(graphic);
        resize(graphic, corner);
        rotate(graphic, label);
    }
}


function equidistantx(group) {

    const graphic1 = group.children[0].firstChild;
    const graphic2 = group.children[1].firstChild;

    const attr = graphicAttrs[graphic1.tagName][1];
    const x1 = parseInt(graphic1.getAttribute(attr));
    const x2 = parseInt(graphic2.getAttribute(attr));

    const dis = x2 - x1;

    gEdit = equidistantXEdit(group, x1, dis);

    for (let i = 2; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("Equidistantx groups are not supported");
        }

        const graphic = group.children[i].firstChild;
        graphic.setAttribute(attr, x1 + dis * i);
        setAtomicGroup(group.children[i]);
    }

    setAllGroups();
    clear();
}

function equidistanty(group) {

    const graphic1 = group.children[0].firstChild;
    const graphic2 = group.children[1].firstChild;

    const attr = graphicAttrs[graphic1.tagName][2];
    const y1 = parseInt(graphic1.getAttribute(attr));
    const y2 = parseInt(graphic2.getAttribute(attr));

    const dis = y2 - y1;

    gEdit = equidistantYEdit(group, y1, dis);

    for (let i = 2; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("Equidistanty groups are not supported");
        }

        const graphic = group.children[i].firstChild;
        graphic.setAttribute(attr, y1 + dis * i);
        setAtomicGroup(group.children[i]);
    }

    setAllGroups();
    clear();
}

function equiradius(group) {
    const graphic1 = group.children[0].firstChild;
    const graphic2 = group.children[1].firstChild;

    const attr = graphicAttrs[graphic1.tagName][3];
    const r1 = parseInt(graphic1.getAttribute(attr));
    const r2 = parseInt(graphic2.getAttribute(attr));

    const dis = r1 - r2;// r1 > r2

    gEdit = equiradiusEdit(group, r1, dis);

    for (let i = 2; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("Equiraduis groups are not supported");
        }

        const graphic = group.children[i].firstChild;
        graphic.setAttribute(attr, r1 - dis * i);
        setAtomicGroup(group.children[i]);
    }

    setAllGroups();
    clear();
}


function yAlign(group) {
    const graphic = group.children[0].firstChild;
    const attr = graphicAttrs[graphic.tagName][2];
    const y = parseInt(graphic.getAttribute(attr));

    for (let i = 1; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("Y-align groups are not supported");
        }

        const g = group.children[i].firstChild;
        g.setAttribute(attr, y);
        setAtomicGroup(group.children[i]);
    }

    gEdit = yAlignEdit(group);
    setAllGroups();
    clear();
}


function xAlign(group) {
    const graphic = group.children[0].firstChild;
    const attr = graphicAttrs[graphic.tagName][1];
    const x = parseInt(graphic.getAttribute(attr));

    for (let i = 1; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("X-align groups are not supported");
        }

        const g = group.children[i].firstChild;
        g.setAttribute(attr, x);
        setAtomicGroup(group.children[i]);
    }

    gEdit = xAlignEdit(group);
    setAllGroups();
    clear();
}


function centerAlign(group) {
    const graphic = group.children[0].firstChild;
    const attrx = graphicAttrs[graphic.tagName][1];
    const attry = graphicAttrs[graphic.tagName][2];
    const x = parseInt(graphic.getAttribute(attrx));
    const y = parseInt(graphic.getAttribute(attry));

    for (let i = 1; i < group.children.length; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("center-align groups are not supported");
        }

        const g = group.children[i].firstChild;
        g.setAttribute(attrx, x);
        g.setAttribute(attry, y);
        setAtomicGroup(group.children[i]);
    }

    gEdit = centerAlignEdit(group);
    setAllGroups();
    clear();
}


function equiangle(group) {
    const rotateCenter = rotateCenterInput.value.split(",");
    const cx = parseInt(rotateCenter[0]);
    const cy = parseInt(rotateCenter[1]);

    const n = group.children.length;
    const angle = 360 / n;
    const attrX = graphicAttrs[group.children[0].firstChild.tagName][1];
    const attrY = graphicAttrs[group.children[0].firstChild.tagName][2];
    const x1 = parseInt(group.children[0].firstChild.getAttribute(attrX));
    const y1 = parseInt(group.children[0].firstChild.getAttribute(attrY));

    for (let i = 1; i < n; i++) {
        if (group.children[i].classList.contains("wrapper")) {
            throw new Error("Equiangle groups are not supported");
        }

        const graphic = group.children[i].firstChild;

        const newPoint = rotatePoint(x1, y1, {rotation:i*angle,centerX:cx,centerY:cy});
        graphic.setAttribute(attrX, newPoint[0]);
        graphic.setAttribute(attrY, newPoint[1]);

        setAtomicGroup(group.children[i]);
    }
    gEdit = equiangleEdit(group, cx, cy);
    setAllGroups();
    clear();
}