
const $ = (id) => document.getElementById(id);
const C = (tag) => document.createElement(tag);

let displayTimeout = null;
function displayMessage(msg, duration) {
    if (!duration) duration = MSG_DURATION;
    duration *= 1000;

    const displayerParent = $("displayer_parent");
    const messageDisplayer = $("displayer");
    displayerParent.style.visibility = "visible"
    messageDisplayer.textContent = msg;
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        displayerParent.style.visibility = "hidden";
        messageDisplayer.textContent = "";
    }, duration);
}

const table = $("tarp_hrefs");
function createHref(id) {
    const tr = C("tr");
    const td = C("td");
    const a = C("a");
    
    const params = `?id=${id}`;
    const href = `https://jose1997au.github.io/tarp-manager/tarp${params}`;

    a.href = href;
    a.textContent = id;

    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);
}

fetch("data.json").then(res => res.json().then(data => {
    
    Object.keys(data).forEach(key => {
        const tarp = data[key];
        const tarpId = tarp.id;
        createHref(tarpId);
    });

})).catch(err => {
    console.error(err);
    displayMessage("Error loading tarp data.");
});
