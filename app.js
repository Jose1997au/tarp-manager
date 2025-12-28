const NOTES_PREFIX = "notes_"
const AUTOSAVE_DELAY = 300; //ms
const MSG_DURATION = 10; // s
const BULLET = "|• ";

const params = new URLSearchParams(window.location.search);
const tarpID = params.get("id");

async function fileExists(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

if (!tarpID) {
    utilities.toast("Missing Tarp ID.")
    throw new Error("Missing tarp ID.");
}

fetch("data.json").then(res => res.json()).then(data => {
    const tarp = data[tarpID];

    if (!tarp) {
        utilities.toast("Tarp data is missing.")
        return;
    }

    const elements = {
        image: utilities.$("tarp_image"),
        size: utilities.$("size"),
        type: utilities.$("type"),
        color: utilities.$("color"),
        weightClass: utilities.$("weight"),
        id: utilities.$("id")
    };

    (async () => {
        const filePath = `images/tarps/${tarpID}.png`;
        if (await fileExists(filePath)) {
            elements.image.src = filePath;
        } else {
            utilities.toast(`Image for tarp with ID ${tarpID} not available.`);
            console.log("Image does not exist. Displaying default image instead.");
        }
    })();

    elements.size.textContent = tarp.size;
    elements.type.textContent = tarp.type;
    elements.color.textContent = tarp.color;
    elements.weightClass.textContent = tarp.weight;
    elements.id.textContent = tarp.id;

}).catch(err => {
    console.error(err);
    utilities.toast("Error loading tarp data");
});

const notesEl = utilities.$("notes");
const clearNotesBtn = utilities.$("clear_notes");
const storageKey = `${NOTES_PREFIX}${tarpID}`;

let saveTimeout = null;

function normalizeBullets(text) {
    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.startsWith(BULLET) ? line : `${BULLET}${line}`);

    return lines.join("\n");
}

try {
    notesEl.value = localStorage.getItem(storageKey) ?? "";
    if (notesEl.value) {
        notesEl.value = normalizeBullets(notesEl.value);
    }
} catch (e) {
    console.error("localStorage not available:", e);
}

function clearNotes() {
    if (!notesEl) return;

    const OK = confirm("Clear notes for this tarp? (This device only)");
    if (!OK) return;

    try {
        localStorage.removeItem(storageKey);
        notesEl.value = "";
    } catch (e) {
        console.error("Could not clear notes:", e);
    }
}

notesEl.addEventListener("input", () => {
    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem(storageKey, notesEl.value);
        } catch (e) {
            console.error("Could not save notes:", e);
        }
    }, AUTOSAVE_DELAY);
});

notesEl.addEventListener("blur", () => {
    const normalized = normalizeBullets(notesEl.value);
    if (normalized !== notesEl.value) {
        notesEl.value = normalized;
        try {
            localStorage.setItem(storageKey, notesEl.value);
        } catch (e) {
            console.error("Could not save notes:", e);
        }
    }
});

clearNotesBtn.onclick = clearNotes;