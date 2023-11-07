const selectionRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
selectionRect.setAttribute('stroke', 'lightgray');
selectionRect.setAttribute('fill', 'transparent');

const selectRectMenu = document.createElement("ul");
const groupItem = document.createElement("li");

groupItem.textContent = "Group";

selectRectMenu.classList.add("menu");
selectRectMenu.appendChild(groupItem);
selectRectMenu.style.position = "fixed";
selectRectMenu.style.display = "none";

body.appendChild(selectRectMenu);
svg.appendChild(selectionRect);

var selectedElements = [];
var selectedElementsFlag = [];

var groupId = 0;

groupItem.addEventListener("click", function() {
    gEdit = "group graphics" + groupId + " mem graphics" + groupId + "[" +
            selectedElementsFlag + "]";
        
    groupId++;

    selectionRect.setAttribute('width', 0);
    selectionRect.setAttribute('height', 0);

    selectRectMenu.style.display = "none";

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const corner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const rotateHandler = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const wrapperGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    wrapperGroup.classList.add("wrapper");
    border.classList.add("group-border");
    
    corner.classList.add("group-corner");
    corner.classList.add("corner");
    corner.setAttribute("r", 5);

    rotateHandler.classList.add("group-rotate-handler");
    rotateHandler.classList.add("corner");
    rotateHandler.setAttribute("r", 5);

    selectedElements.forEach(function(element) {
        group.appendChild(element);
    });

    group.setAttribute("transform", "rotate(0)");
    setRotation(group);

    setGroupMenu(group, border);
    dragGroup(group, border);
    resizeGroup(group, corner);
    rotate(group, rotateHandler);

    svg.prepend(wrapperGroup);
    
    wrapperGroup.appendChild(group);
    wrapperGroup.appendChild(corner);
    wrapperGroup.appendChild(border);
    wrapperGroup.appendChild(rotateHandler);
    setAllGroups();

    selectedElements = [];
    selectedElementsFlag = [];
});

svg.addEventListener('mousedown', function(e) {
    if (e.target === svg && svgState === 0) {

        let startX, startY, endX, endY;

        startX = e.clientX - svgRect.left;
        startY = e.clientY - svgRect.top;
        selectionRect.setAttribute('x', startX);
        selectionRect.setAttribute('y', startY);
        selectionRect.setAttribute('width', 0);
        selectionRect.setAttribute('height', 0);

        selectRectMenu.style.display = "none";

        svg.addEventListener('mousemove', moveHandler);
        svg.addEventListener('mouseup', upHandler);

        function moveHandler(e) {
            if (svgState === 0 && startX !== undefined) {
                endX = e.clientX - svgRect.left;
                endY = e.clientY - svgRect.top;
                selectionRect.setAttribute('width', Math.abs(endX - startX));
                selectionRect.setAttribute('height', Math.abs(endY - startY));
                selectionRect.setAttribute('x', Math.min(startX, endX));
                selectionRect.setAttribute('y', Math.min(startY, endY));
            }
        }
        
        function upHandler(e) {
            if(svgState === 0) {
                startX = undefined;
                startY = undefined;
                endX = undefined;
                endY = undefined;
            
                selectedElements = Array.from(svg.children).filter(function(shape) {
                    const selectX = parseInt(selectionRect.getAttribute('x'));
                    const selectY = parseInt(selectionRect.getAttribute('y'));
                    const selectWidth = parseInt(selectionRect.getAttribute('width'));
                    const selectHeight = parseInt(selectionRect.getAttribute('height'));
                    
                    const shapeBounds = shape.getBBox();

                    return selectX <= shapeBounds.x &&
                        selectY <= shapeBounds.y &&
                        selectX + selectWidth >= shapeBounds.x + shapeBounds.width &&
                        selectY + selectHeight >= shapeBounds.y + shapeBounds.height;
                });

                if (selectedElements.length > 1) {
                    selectRectMenu.style.left = e.pageX + "px";
                    selectRectMenu.style.top = e.pageY + "px";
                    selectRectMenu.style.display = "block";

                    selectedElementsFlag = Array.from(svg.children).map(child => selectedElements.includes(child));
                    selectedElementsFlag.pop();
                } else {
                    selectionRect.setAttribute('width', 0);
                    selectionRect.setAttribute('height', 0);
                }

                svg.removeEventListener('mousemove', moveHandler);
                svg.removeEventListener('mouseup', upHandler);
            }
        }
    }
});