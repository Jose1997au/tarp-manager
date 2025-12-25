const NOTES_PREFIX = "notes_"
const AUTOSAVE_DELAY = 300; //ms
const MSG_DURATION = 20; // s

const params = new URLSearchParams(window.location.search);
const tarpID = params.get("id");

const $ = (id) => document.getElementById(id);

let displayTimeout = null;

function displayMessage(msg, duration) {
    if (!duration) duration = MSG_DURATION;
    duration *= 1000;

    const messageDisplayer = $("displayer");
    messageDisplayer.textContent = msg;
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        messageDisplayer.textContent = "";
    }, duration);
}

async function fileExists(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

if (!tarpID) {
    displayMessage("Missing Tarp ID", 30)
    throw new Error("Missing tarp ID.");
}

fetch("data.json").then(res => res.json()).then(data => {
    const tarp = data[tarpID];

    if (!tarp) {
        displayMessage("Tarp data is missing.")
        return;
    }

    const elements = {
        image: $("tarp_image"),
        size: $("size"),
        type: $("type"),
        color: $("color"),
        weightClass: $("weight_class"),
        id: $("id")
    };

    (async () => {
        const filePath = `images/tarps/${tarpID}.png`;
        if (await fileExists(filePath)) {
            elements.image.src = filePath;
        } else {
            console.log("Image does not exist. Displaying default image instead.");
        }
    })();

    elements.size.textContent = tarp.size;
    elements.type.textContent = tarp.type;
    elements.color.textContent = tarp.color;
    elements.weightClass.textContent = tarp.weight_class;
    elements.id.textContent = tarp.id;

}).catch(err => {
    console.error(err);
    displayMessage("Error loading tarp data", 20);
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
