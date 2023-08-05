/*
  IDEAS:
  - [ ] Remove selections
  - [ ] Fix allowing multiple highlights on same thing
  - [ ] Keep selections after page refresh
*/

// Return unique-ish ID. Used to group all the spans that were highlighted together.
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
}

// Create the span element that will wrap the text to be highlighted
const createHighlightWrapper = (uniqueId) => {
    const wrapper = document.createElement('span');
    wrapper.style.backgroundColor = "#EEEE00";
    wrapper.style.color = "#111111";
    wrapper.classList.add("sdwh-highlight");
    wrapper.setAttribute("sdwh-highlight-id", uniqueId);
    wrapper.style.fontSize = "1.1em";
    return wrapper;
};

// Helpers to traverse the DOM, which is something we have to do if
// a selection spans multiple elements.
const getNextNode = (node) => {
    if (node.nextSibling) {
        return getDeepFirstChild(node.nextSibling);
    }
    while (node.parentNode && !node.parentNode.nextSibling) {
        node = node.parentNode;
    }
    return node.parentNode ? getDeepFirstChild(node.parentNode.nextSibling) : null;
};
const getDeepFirstChild = (node) => {
    while (node && node.firstChild) {
        node = node.firstChild;
    }
    return node;
};

// How we detect whether the user can "see" this item. Used to fix issue
// where sometimes extra text could appear in the clipboard output, because
// it was part of an html element that wasn't actually visible.
const isVisible = (node) => {
    const style = window.getComputedStyle(node.parentNode, null);
    return style.display !== "none";
};

// Detect if an element overlaps with the given selection range. Used as part
// of detecting whether to continue traversing the DOM.
const isAnyPartOfElementInsideRange = (element, range) => {
    const elemRange = document.createRange();
    elemRange.selectNode(element);
    const startsBeforeRangeEnds = range.compareBoundaryPoints(Range.END_TO_START, elemRange) <= 0;
    const endsAfterRangeStarts = range.compareBoundaryPoints(Range.START_TO_END, elemRange) >= 0;
    return startsBeforeRangeEnds && endsAfterRangeStarts;
}

// Entrypoint for the highlight action. If the highlighted text is all contained
// in one span, then it's easy - we just wrap that text in a new span with our
// "highlight" class. If the selected text is split across multiple HTML
// elements (which is fairly likely), then we have to run the same process
// individually on all those elements, and figure out when to stop traversing
// the DOM.
const commandHighlightSelection = () => {
    const sel = document.getSelection();
    if (!sel.rangeCount) return;

    for (let i = 0; i < sel.rangeCount; i++) {
        const range = sel.getRangeAt(i);
        const uniqueId = generateId();

        if (range.startContainer === range.endContainer) {
            const wrapper = createHighlightWrapper(uniqueId);
            range.surroundContents(wrapper);
            continue;
        }

        let currentNode = range.startContainer;
        const nodesToWrap = [];
        while (currentNode) {
            if (!isAnyPartOfElementInsideRange(currentNode, range)){
                break;
            }
            if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim() !== "" && isVisible(currentNode)) {
                nodesToWrap.push(currentNode);
            }
            currentNode = currentNode === range.endContainer ? null : getNextNode(currentNode);
        }

        nodesToWrap.forEach(node => {
            const wrapperRange = document.createRange();
            if (node === range.startContainer) {
                wrapperRange.setStart(node, range.startOffset);
                wrapperRange.setEnd(node, node.length);
            } else if (node === range.endContainer) {
                wrapperRange.setStart(node, 0);
                wrapperRange.setEnd(node, range.endOffset);
            } else {
                wrapperRange.selectNodeContents(node);
            }
            const wrapper = createHighlightWrapper(uniqueId);
            wrapperRange.surroundContents(wrapper);
        });
    }
};


// Entrypoint for copy action. We mostly just store the highlighted text
// content, with a separator to represent each individual highlight.
// We do very basic formatting of the plain text - eg. to make sure
// we put headings on a newline. But mostly it's just copied as it
// is in the HTML.
const commandCopyAll = () => {
    const spans = document.querySelectorAll(".sdwh-highlight");
    var s = window.location.toString();
    var currentId;
    for (var i=0; i < spans.length; i++) {
        var thisId = spans[i].getAttribute("sdwh-highlight-id");
        if (thisId != currentId) {
            // We're now on a new highlight, so store this text separately.
            s += "\n\n";
            s += "----------";
            s += "\n";
        }
        currentId = thisId;
        s += spans[i].textContent.trim();

        parent = spans[i].parentNode;
        if (parent && ["h1", "h2", "h3", "h4", "h5"].includes(parent.tagName.toLowerCase())) {
            s += "\n\n"
        } else {
            s += " "
        }
    }
    navigator.clipboard.writeText(s);
    alert("Copied highlights");
}


// Handles messages from the context menu.
const handle = (message) => {
    if (message == "highlight") {
        commandHighlightSelection();
    } else if (message == "copy") {
        commandCopyAll();
    }
}
browser.runtime.onMessage.addListener(handle);

// Listen for our hard-coded keypresses and run the appropriate actions.
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == "L") {
        commandHighlightSelection();
    }
    if (event.ctrlKey && event.key == ":") {
        commandCopyAll();
    }
}, false);
