const dialogueInput =
    document.getElementById("dialogue");

const recipientInput =
    document.getElementById("recipient");

const senderInput =
    document.getElementById("sender");

const generateButton =
    document.getElementById("generateButton");

const clearButton =
    document.getElementById("clearButton");

const chat =
    document.getElementById("chat");

const chatHeader =
    document.getElementById("chatHeader");

const messageStatusInput =
    document.getElementById("messageStatus");


/* =========================================
   STATUS BAR ELEMENTS
========================================= */

const phoneTimeInput =
    document.getElementById("phoneTime");

const wifiStrengthInput =
    document.getElementById("wifiStrength");

const batteryLevelInput =
    document.getElementById("batteryLevel");

const previewTime =
    document.getElementById("previewTime");

const previewWifi =
    document.getElementById("previewWifi");

const batteryFill =
    document.getElementById("batteryFill");

const previewBatteryText =
    document.getElementById(
        "previewBatteryText"
    );


/* =========================================
   GENERATE CONVERSATION
========================================= */

function generateConversation() {

    const recipient =
        recipientInput.value.trim();

    const sender =
        senderInput.value.trim();

    const text =
        dialogueInput.value.trim();

    const messageStatus =
        messageStatusInput
            ? messageStatusInput.value
            : "none";


    /* =========================================
       CHECK INPUTS
    ========================================= */

    if (recipient === "") {

        alert(
            "Please enter the name of the person being texted."
        );

        return;
    }


    if (sender === "") {

        alert(
            "Please enter the name of the person doing the texting."
        );

        return;
    }


    if (text === "") {

        alert(
            "Please enter a conversation."
        );

        return;
    }


    /* =========================================
       CLEAR PREVIOUS CHAT
    ========================================= */

    chat.innerHTML = "";

    chatHeader.innerHTML = "";


    /* =========================================
       UPDATE STATUS BAR
    ========================================= */

    updateStatusBar();


    /* =========================================
       CREATE CHAT HEADER
    ========================================= */

    createChatHeader(recipient);


    /* =========================================
       READ CONVERSATION
    ========================================= */

    const lines =
        text.split("\n");


    const messages = [];


    lines.forEach(line => {

        line = line.trim();


        /* =====================================
           IGNORE EMPTY LINES
        ===================================== */

        if (line === "") {

            return;

        }


        /* =====================================
           CHECK FOR TIMESTAMP
        ===================================== */

        const timeMatch =
            line.match(
                /^\[TIME:\s*(.*?)\s*\]$/i
            );


        if (timeMatch) {

            messages.push({

                type: "timestamp",

                text: timeMatch[1]

            });

            return;

        }


        /* =====================================
           CHECK FOR MESSAGE
        ===================================== */

        const colonIndex =
            line.indexOf(":");


        if (colonIndex === -1) {

            return;

        }


        const speaker =
            line
                .substring(0, colonIndex)
                .trim();


        const message =
            line
                .substring(colonIndex + 1)
                .trim();


        if (
            speaker === "" ||
            message === ""
        ) {

            return;

        }


        messages.push({

            type: "message",

            speaker: speaker,

            message: message

        });

    });


    /* =========================================
       CHECK FOR VALID CONTENT
    ========================================= */

    if (messages.length === 0) {

        alert(
            "No valid messages were found.\n\nUse the format:\nName: Message"
        );

        return;
    }


    /* =========================================
       FIND MOST RECENT SENDER MESSAGE
    ========================================= */

    let mostRecentSenderMessageIndex =
        -1;


    for (
        let i = messages.length - 1;
        i >= 0;
        i--
    ) {

        if (
            messages[i].type === "message" &&
            messages[i].speaker
                .trim()
                .toLowerCase() ===
            sender.toLowerCase()
        ) {

            mostRecentSenderMessageIndex =
                i;

            break;

        }

    }


    /* =========================================
       CREATE CHAT CONTENT
    ========================================= */

    messages.forEach(
        (item, index) => {


            /* =================================
               TIMESTAMP
            ================================= */

            if (
                item.type ===
                "timestamp"
            ) {

                createTimestamp(
                    item.text
                );

                return;

            }


            /* =================================
               CURRENT SPEAKER
            ================================= */

            const currentSpeaker =
                item.speaker
                    .trim()
                    .toLowerCase();


            /* =================================
               FIND PREVIOUS MESSAGE
            ================================= */

            let previousMessage =
                null;


            for (
                let i = index - 1;
                i >= 0;
                i--
            ) {

                if (
                    messages[i].type ===
                    "message"
                ) {

                    previousMessage =
                        messages[i];

                    break;

                }

            }


            /* =================================
               FIND NEXT MESSAGE
            ================================= */

            let nextMessage =
                null;


            for (
                let i = index + 1;
                i < messages.length;
                i++
            ) {

                if (
                    messages[i].type ===
                    "message"
                ) {

                    nextMessage =
                        messages[i];

                    break;

                }

            }


            /* =================================
               DETERMINE SIDE
            ================================= */

            let side;


            if (
                currentSpeaker ===
                sender.toLowerCase()
            ) {

                side = "right";

            }


            else if (
                currentSpeaker ===
                recipient.toLowerCase()
            ) {

                side = "left";

            }


            else {

                side = "left";

            }


            /* =================================
               DETERMINE GROUP
            ================================= */

            const previousSpeaker =
                previousMessage
                    ? previousMessage.speaker
                        .trim()
                        .toLowerCase()
                    : null;


            const nextSpeaker =
                nextMessage
                    ? nextMessage.speaker
                        .trim()
                        .toLowerCase()
                    : null;


            const isFirstInGroup =
                currentSpeaker !==
                previousSpeaker;


            const isLastInGroup =
                currentSpeaker !==
                nextSpeaker;


            /* =================================
               CHECK MESSAGE STATUS
            ================================= */

            const isMostRecentSenderMessage =
                index ===
                mostRecentSenderMessageIndex;


            let status = "";


            if (
                isMostRecentSenderMessage &&
                messageStatus !== "none"
            ) {

                status =
                    messageStatus;

            }


            /* =================================
               CREATE MESSAGE
            ================================= */

            createMessage(

                item.message,

                side,

                isFirstInGroup,

                isLastInGroup,

                status

            );

        }
    );


    /* =========================================
       SCROLL TO BOTTOM
    ========================================= */

    setTimeout(() => {

        chat.scrollTop =
            chat.scrollHeight;

    }, 10);

}


/* =========================================
   UPDATE STATUS BAR
========================================= */

function updateStatusBar() {

    /* =====================================
       TIME
    ===================================== */

    let time =
        phoneTimeInput.value.trim();


    if (time === "") {

        time = "9:41";

    }


    previewTime.textContent =
        time;


    /* =====================================
       WIFI
    ===================================== */

    const wifi =
        wifiStrengthInput.value;


    previewWifi.classList.remove(

        "off",

        "weak",

        "medium",

        "strong",

        "full"

    );


    previewWifi.classList.add(
        wifi
    );


    /* =====================================
       BATTERY
    ===================================== */

    let battery =
        parseInt(
            batteryLevelInput.value,
            10
        );


    if (
        isNaN(battery)
    ) {

        battery = 87;

    }


    battery =
        Math.max(
            0,
            Math.min(
                100,
                battery
            )
        );


    batteryLevelInput.value =
        battery;


    batteryFill.style.width =
        battery + "%";


    previewBatteryText.textContent =
        battery + "%";


    /* =====================================
       BATTERY COLOR
    ===================================== */

    batteryFill.classList.remove(

        "low",

        "medium",

        "normal"

    );


    if (battery <= 20) {

        batteryFill.classList.add(
            "low"
        );

    }

    else if (battery <= 40) {

        batteryFill.classList.add(
            "medium"
        );

    }

    else {

        batteryFill.classList.add(
            "normal"
        );

    }

}


/* =========================================
   CREATE CHAT HEADER
========================================= */

function createChatHeader(name) {

    const header =
        document.createElement("div");


    header.classList.add(
        "chat-header"
    );


    /* =====================================
       AVATAR
    ===================================== */

    const avatar =
        document.createElement("div");


    avatar.classList.add(
        "chat-avatar"
    );


    const words =
        name.split(" ");


    let initials = "";


    if (
        words.length === 1
    ) {

        initials =
            words[0]
                .substring(0, 2);

    }


    else {

        initials =
            words[0][0] +
            words[words.length - 1][0];

    }


    avatar.textContent =
        initials.toUpperCase();


    /* =====================================
       CONTACT NAME
    ===================================== */

    const contactName =
        document.createElement("div");


    contactName.classList.add(
        "chat-contact-name"
    );


    contactName.textContent =
        name;


    /* =====================================
       ADD TO HEADER
    ===================================== */

    header.appendChild(
        avatar
    );


    header.appendChild(
        contactName
    );


    chatHeader.appendChild(
        header
    );

}


/* =========================================
   CREATE MESSAGE
========================================= */

function createMessage(
    messageText,
    side,
    isFirstInGroup,
    isLastInGroup,
    status
) {

    const row =
        document.createElement("div");


    row.classList.add(
        "message-row",
        side
    );


    /* =====================================
       GROUP CLASSES
    ===================================== */

    if (
        isFirstInGroup
    ) {

        row.classList.add(
            "first-in-group"
        );

    }


    if (
        isLastInGroup
    ) {

        row.classList.add(
            "last-in-group"
        );

    }


    if (
        !isFirstInGroup &&
        !isLastInGroup
    ) {

        row.classList.add(
            "middle-in-group"
        );

    }


    /* =====================================
       CREATE BUBBLE
    ===================================== */

    const bubble =
        document.createElement("div");


    bubble.classList.add(
        "message"
    );


    bubble.textContent =
        messageText;


    row.appendChild(
        bubble
    );


    chat.appendChild(
        row
    );


    /* =====================================
       MESSAGE STATUS
    ===================================== */

    if (
        status !== "" &&
        side === "right"
    ) {

        const statusRow =
            document.createElement("div");


        statusRow.classList.add(
            "message-status-row"
        );


        const statusText =
            document.createElement("div");


        statusText.classList.add(
            "message-status"
        );


        statusText.textContent =
            status === "read"
                ? "Read"
                : "Delivered";


        statusRow.appendChild(
            statusText
        );


        chat.appendChild(
            statusRow
        );

    }

}


/* =========================================
   CREATE TIMESTAMP
========================================= */

function createTimestamp(text) {

    const timestamp =
        document.createElement("div");


    timestamp.classList.add(
        "timestamp"
    );


    timestamp.textContent =
        text;


    chat.appendChild(
        timestamp
    );

}


/* =========================================
   CLEAR CONVERSATION
========================================= */

function clearConversation() {

    recipientInput.value =
        "";

    senderInput.value =
        "";

    dialogueInput.value =
        "";


    if (
        messageStatusInput
    ) {

        messageStatusInput.value =
            "none";

    }


    phoneTimeInput.value =
        "9:41";


    wifiStrengthInput.value =
        "full";


    batteryLevelInput.value =
        "87";


    updateStatusBar();


    chatHeader.innerHTML =
        "";


    chat.innerHTML = `

        <div class="empty-message">

            Your conversation will appear here.

        </div>

    `;

}


/* =========================================
   STATUS BAR LIVE PREVIEW
========================================= */

phoneTimeInput.addEventListener(
    "input",
    updateStatusBar
);


wifiStrengthInput.addEventListener(
    "change",
    updateStatusBar
);


batteryLevelInput.addEventListener(
    "input",
    updateStatusBar
);


/* =========================================
   BUTTONS
========================================= */

generateButton.addEventListener(
    "click",
    generateConversation
);


clearButton.addEventListener(
    "click",
    clearConversation
);


/* =========================================
   INITIAL STATUS BAR
========================================= */

updateStatusBar();
