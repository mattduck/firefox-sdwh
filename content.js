/*
IDEAS:
- [ ] Keep selections after page refresh
- [ ] Remove selections
- [ ] Fix allowing multiple highlights on same thing
- [ ] Fix issue where things not always highlighted
*/

const buildKey = (text) => {
    const key = window.location.toString() + text;
    return key
}

const copyAll = () => {
    const spans = document.querySelectorAll(".matt-highlight");
    var s = window.location.toString();
    for (var i=0; i < spans.length; i++) {
        s += "\n\n";
        s += "------------------------------------------------------------";
        s += "\n";
        s += spans[i].textContent.trim();
    }
    navigator.clipboard.writeText(s);
    alert("Copied highlights");
}

const highlightSelection = () => {
    const sel = document.getSelection();
    const range = sel.getRangeAt(0);
    const wrapper = document.createElement("span");
    wrapper.style.backgroundColor = "#EEEE00";
    wrapper.style.color = "#111111";
    wrapper.classList.add("matt-highlight");
    wrapper.style.fontSize = "1.2em";
    range.surroundContents(wrapper);
}

const handle = (message) => {
    if (message == "highlight") {
        highlightSelection();
    } else if (message == "copy") {
        copyAll();
    }
}
browser.runtime.onMessage.addListener(handle);

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == "L") {
        highlightSelection();
    }
    if (event.ctrlKey && event.key == ":") {
        copyAll();
    }
}, false);
