const MSG_DURATION = 20; // In seconds

const displayTimeout = null;

export default {
    $(elementId) {
        /* Fetch an element by ID. */
        return document.getElementById(elementId);
    },

    c(elementClass) {
        /* Create an element. */
        return document.createElement(elementClass);
    },

    toast(msg, duration) {
        /* Show an error message. */
        if (!duration) duration = MSG_DURATION;
        duration *= 1000;
        
        const displayerParent = this.$("displayer_parent");
        const messageDisplayer = this.$("displayer");
        displayerParent.style.visibility = "visible"
        messageDisplayer.textContent = msg;
        clearTimeout(displayTimeout);
        displayTimeout = setTimeout(() => {
            displayerParent.style.visibility = "hidden";
            messageDisplayer.textContent = "";
        }, duration);
    }
};
