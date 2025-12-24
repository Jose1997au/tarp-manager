const NOTES_PREFIX = "notes_"
const AUTOSAVE_DELAY = 300;

const params = new URLSearchParams(window.location.search);
const tarpID = params.get("id");

const $ = (id) => document.getElementById(id);

if (!tarpID) {
    
    throw new Error("Missing tarp ID.");
}

fetch("data.json").then(res => res.json()).then(data => {
    const tarp = data[tarpID];

    if (!tarp) {

        console.log("Tarp is missing.");       
        return;
    }

    const elements = {
        size: $("size"),
        type: $("type"),
        color: $("color"),
        weightClass: $("weight_class"),
        id: $("id")
    }

    elements.size.textContent = tarp.size;
    elements.type.textContent = tarp.type;
    elements.color.textContent = tarp.color;
    elements.weightClass.textContent = tarp.weight_class;
    elements.id.textContent = tarp.id;

}).catch(err => {
    console.log(err);
    $("tarp-title").textContent = "Error loading tarp data";
});

const notesEl = $("notes");
const storageKey = `${NOTES_PREFIX}${tarpID}`;

notesEl.value = localStorage.getItem(storageKey) ?? "";

let saveTimeout = null;

notesEl.addEventListener("input", () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(storageKey, notesEl.value)
    }, AUTOSAVE_DELAY);
});

function clearNotes() {
    if (!notesEl) return;

    const OK = confirm("Clear notes for this tarp? (This device only)");
    if (!OK) return;

    localStorage.removeItem(storageKey);
    notesEl.value = "";
}
