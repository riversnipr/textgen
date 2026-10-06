/* =========================================================
   TEXT CONVERSATION GENERATOR
   COMPLETE REDESIGN JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const recipientInput =
    document.getElementById("recipient");

const senderInput =
    document.getElementById("sender");

const phoneTimeInput =
    document.getElementById("phoneTime");

const wifiStrengthInput =
    document.getElementById("wifiStrength");

const batteryLevelInput =
    document.getElementById("batteryLevel");

const batteryValue =
    document.getElementById("batteryValue");

const messageStatusInput =
    document.getElementById("messageStatus");

const messageInput =
    document.getElementById("messageInput");

const generateButton =
    document.getElementById("generateButton");

const clearButton =
    document.getElementById("clearButton");

const previewTime =
    document.getElementById("previewTime");

const previewWifi =
    document.getElementById("previewWifi");

const batteryFill =
    document.getElementById("batteryFill");

const contactAvatar =
    document.getElementById("contactAvatar");

const contactName =
    document.getElementById("contactName");

const chat =
    document.getElementById("chat");

const messagesScroll =
    document.getElementById("messagesScroll");



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    updatePhoneSettings();

    updateContact();

       generateConversation();

});


/* =========================================================
   CONTACT
========================================================= */

function updateContact() {

    let name =
        recipientInput.value.trim();

    if (name === "") {
        name = "John";
    }

    contactName.textContent = name;

    contactAvatar.textContent =
        getInitials(name);
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (words.length === 0) {
        return "?";
    }

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}


/* =========================================================
   PHONE SETTINGS
========================================================= */

function updatePhoneSettings() {

    /* Time */

    let time =
        phoneTimeInput.value.trim();

    if (time === "") {
        time = "9:41 AM";
    }

    previewTime.textContent = time;


    /* Wi-Fi */

    const wifi =
        wifiStrengthInput.value;

    previewWifi.classList.remove(
        "off",
        "weak",
        "medium",
        "strong",
        "full"
    );

    previewWifi.classList.add(wifi);


    /* Battery */

    let battery =
        parseInt(
            batteryLevelInput.value,
            10
        );

    if (Number.isNaN(battery)) {
        battery = 87;
    }

    battery =
        Math.max(
            0,
            Math.min(100, battery)
        );

    batteryLevelInput.value =
        battery;

    batteryValue.textContent =
        battery + "%";

    batteryFill.style.width =
        Math.max(0, battery - 4) + "%";


    /* Battery appearance */

    batteryFill.classList.remove(
        "low",
        "medium",
        "normal"
    );

    if (battery <= 20) {

        batteryFill.classList.add("low");

    } else if (battery <= 40) {

        batteryFill.classList.add("medium");

    } else {

        batteryFill.classList.add("normal");

    }
}


/* =========================================================
   PARSE CONVERSATION
========================================================= */

function parseConversation(text) {

    const lines =
        text.split(/\r?\n/);

    const items = [];

    for (let line of lines) {

        line =
            line.trim();

        if (line === "") {
            continue;
        }


        /* -----------------------------------------
           TIME SEPARATOR
        ------------------------------------------ */

        const timeMatch =
            line.match(
                /^\[TIME:\s*(.*?)\s*\]$/i
            );

        if (timeMatch) {

            items.push({
                type: "time",
                text: timeMatch[1]
            });

            continue;
        }


        /* -----------------------------------------
           MESSAGE
        ------------------------------------------ */

        const colonIndex =
            line.indexOf(":");


        if (colonIndex === -1) {

            items.push({
                type: "message",
                name: "",
                text: line
            });

            continue;
        }


        const name =
            line
                .substring(0, colonIndex)
                .trim();

        const message =
            line
                .substring(colonIndex + 1)
                .trim();


        if (message === "") {
            continue;
        }


        items.push({
            type: "message",
            name: name,
            text: message
        });
    }

    return items;
}


/* =========================================================
   DETERMINE MESSAGE SIDE
========================================================= */

function isSentMessage(name) {

    const sender =
        senderInput.value
            .trim()
            .toLowerCase();

    const recipient =
        recipientInput.value
            .trim()
            .toLowerCase();

    const messageName =
        name
            .trim()
            .toLowerCase();


    if (
        sender !== "" &&
        messageName === sender
    ) {
        return true;
    }


    if (
        recipient !== "" &&
        messageName === recipient
    ) {
        return false;
    }


    /*
       If the name isn't an exact match,
       make a few useful comparisons.
    */

    if (
        sender !== "" &&
        messageName.includes(sender)
    ) {
        return true;
    }

    if (
        recipient !== "" &&
        messageName.includes(recipient)
    ) {
        return false;
    }


    /*
       Unknown names default to received.
    */

    return false;
}


/* =========================================================
   CREATE MESSAGE BUBBLE
========================================================= */

function createMessage(
    item,
    index,
    items
) {

    const row =
        document.createElement("div");

    row.className =
        "message-row";


    const sent =
        isSentMessage(item.name);


    row.classList.add(
        sent ? "sent" : "received"
    );


    /* -----------------------------------------
       GROUPING
    ------------------------------------------ */

    const previous =
        findPreviousMessage(
            items,
            index
        );

    const next =
        findNextMessage(
            items,
            index
        );


    if (
        previous &&
        isSentMessage(previous.name) === sent
    ) {
        row.classList.add("grouped");
    }


    if (
        !next ||
        isSentMessage(next.name) !== sent
    ) {
        row.classList.add("last-in-group");
    }


    /* -----------------------------------------
       Bubble
    ------------------------------------------ */

    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";

    bubble.textContent =
        item.text;


    row.appendChild(bubble);

    return row;
}


/* =========================================================
   FIND PREVIOUS MESSAGE
========================================================= */

function findPreviousMessage(
    items,
    index
) {

    for (
        let i = index - 1;
        i >= 0;
        i--
    ) {

        if (
            items[i].type === "message"
        ) {
            return items[i];
        }

        if (
            items[i].type === "time"
        ) {
            break;
        }
    }

    return null;
}


/* =========================================================
   FIND NEXT MESSAGE
========================================================= */

function findNextMessage(
    items,
    index
) {

    for (
        let i = index + 1;
        i < items.length;
        i++
    ) {

        if (
            items[i].type === "message"
        ) {
            return items[i];
        }

        if (
            items[i].type === "time"
        ) {
            break;
        }
    }

    return null;
}


/* =========================================================
   GENERATE CONVERSATION
========================================================= */

function generateConversation() {

    updatePhoneSettings();

    updateContact();


    const text =
        messageInput.value.trim();


    /* Clear current conversation */

    chat.innerHTML = "";


    if (text === "") {

        createEmptyMessage();

        return;
    }


    const items =
        parseConversation(text);


    if (items.length === 0) {

        createEmptyMessage();

        return;
    }


    let lastSentMessage = null;


    items.forEach(
        (item, index) => {

            if (item.type === "time") {

                createTimeSeparator(
                    item.text
                );

            } else {

                const message =
                    createMessage(
                        item,
                        index,
                        items
                    );

                chat.appendChild(message);


                /*
                   Keep track of the most recent
                   message sent by the user.
                */

                if (
                    isSentMessage(item.name)
                ) {

                    lastSentMessage =
                        message;

                }

            }

        }
    );


    /* -----------------------------------------
       ADD DELIVERED / READ STATUS
    ------------------------------------------ */

    const status =
        messageStatusInput.value;


    if (
        lastSentMessage &&
        status !== "none"
    ) {

        const statusElement =
            document.createElement("div");

        statusElement.className =
            "message-status";

        statusElement.textContent =
            status === "read"
                ? "Read"
                : "Delivered";


        /*
           Put the status immediately
           underneath the last outgoing
           message.
        */

        lastSentMessage.after(
            statusElement
        );
    }


    /*
       Scroll to the newest message.
    */

    requestAnimationFrame(() => {

        messagesScroll.scrollTop =
            messagesScroll.scrollHeight;

    });
}

/* =========================================================
   TIME SEPARATOR
========================================================= */

function createTimeSeparator(text) {

    const separator =
        document.createElement("div");

    separator.className =
        "time-separator";

    separator.textContent =
        text;

    chat.appendChild(separator);
}


/* =========================================================
   EMPTY MESSAGE
========================================================= */

function createEmptyMessage() {

    const empty =
        document.createElement("div");

    empty.className =
        "empty-message";

    empty.innerHTML = `
        <div class="empty-icon">💬</div>
        <strong>Your conversation</strong>
        <span>will appear here.</span>
    `;

    chat.appendChild(empty);
}


/* =========================================================
   CLEAR
========================================================= */

function clearConversation() {

    messageInput.value = "";

    chat.innerHTML = "";

    createEmptyMessage();
}


/* =========================================================
   EVENTS
========================================================= */


/* Generate */

generateButton.addEventListener(
    "click",
    generateConversation
);


/* Clear */

clearButton.addEventListener(
    "click",
    clearConversation
);


/* Contact */

recipientInput.addEventListener(
    "input",
    updateContact
);


/* Phone settings */

phoneTimeInput.addEventListener(
    "input",
    updatePhoneSettings
);

wifiStrengthInput.addEventListener(
    "change",
    updatePhoneSettings
);

batteryLevelInput.addEventListener(
    "input",
    updatePhoneSettings
);


/* Message status */

messageStatusInput.addEventListener(
    "change",
    () => {

        /*
           Kept as a setting so it can be
           expanded later for Delivered/Read
           indicators without changing the UI.
        */

        updateMessageStatus();
    }
);


/* =========================================================
   MESSAGE STATUS
========================================================= */

function updateMessageStatus() {
    generateConversation();
}

/* =========================================================
   ENTER KEY SHORTCUT
========================================================= */

messageInput.addEventListener(
    "keydown",
    (event) => {

        /*
           Ctrl + Enter / Cmd + Enter
           generates the conversation.
        */

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            generateConversation();
        }

    }
);
