import utilities from "./utilities.js";

const $ = utilities.$;
const c = utilities.c;
const toast = utilities.toast;

const table = $("tarp_hrefs");
function createHref(id) {
    const tr = c("tr");
    const td = c("td");
    const a = c("a");
    const i = c("i");
    
    const params = `?id=${id}`;
    const href = `https://jose1997au.github.io/tarp-manager/tarp${params}`;

    i.classList.add("fi-xwluxl-address-card-solid");

    a.href = href;
    a.textContent = id;
    a.classList.add("custom-font");

    td.appendChild(i);
    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);
}

fetch("data.json").then(res => res.json().then(data => {
    const headerCount = $("header_count");
    let tarpsRegistered = 0;

    Object.keys(data).forEach(key => {
        const tarp = data[key];
        const tarpId = tarp.id;
        tarpsRegistered += 1;
        createHref(tarpId);
    });

    headerCount.textContent = `Registered Tarps | Count: ${tarpsRegistered}`;

})).catch(err => {
    console.error(err);
    toast("Error loading tarp data.");
});
