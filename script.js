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


        /*
           Ignore completely blank lines.
        */

        if (line === "") {
            return;
        }


        /* =========================================
           CHECK FOR CUSTOM TIMESTAMP
        ========================================= */

        /*
           Example:

           [TIME: Oct 3 at 4:34 PM]

           Everything between "[TIME:"
           and "]" becomes the timestamp.
        */

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


        /* =========================================
           CHECK FOR MESSAGE
        ========================================= */

        const colonIndex =
            line.indexOf(":");


        /*
           If there is no colon, ignore the line.
        */

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


        /*
           Ignore malformed messages.
        */

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
       CREATE CHAT CONTENT
    ========================================= */

    messages.forEach(
        (item, index) => {


            /* =====================================
               TIMESTAMP
            ===================================== */

            if (item.type === "timestamp") {

                createTimestamp(
                    item.text
                );

                return;
            }


            /* =====================================
               MESSAGE
            ===================================== */

            const currentSpeaker =
                item.speaker
                    .trim()
                    .toLowerCase();


            /*
               Find the previous actual message.

               This skips timestamps.

               That way a timestamp doesn't
               accidentally break a group of
               messages from the same person.
            */

            let previousMessage = null;

            for (
                let i = index - 1;
                i >= 0;
                i--
            ) {

                if (
                    messages[i].type === "message"
                ) {

                    previousMessage =
                        messages[i];

                    break;
                }
            }


            /*
               Find the next actual message.

               This also skips timestamps.
            */

            let nextMessage = null;

            for (
                let i = index + 1;
                i < messages.length;
                i++
            ) {

                if (
                    messages[i].type === "message"
                ) {

                    nextMessage =
                        messages[i];

                    break;
                }
            }


            /* =====================================
               DETERMINE SIDE
            ===================================== */

            let side;


            /*
               Sender = RIGHT
            */

            if (
                currentSpeaker ===
                sender.toLowerCase()
            ) {

                side = "right";

            }


            /*
               Recipient = LEFT
            */

            else if (
                currentSpeaker ===
                recipient.toLowerCase()
            ) {

                side = "left";

            }


            /*
               If a different name was entered,
               default it to the left side.
            */

            else {

                side = "left";

            }


            /* =====================================
               DETERMINE MESSAGE GROUP
            ===================================== */

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


            /*
               First message in a group
            */

            const isFirstInGroup =
                currentSpeaker !==
                previousSpeaker;


            /*
               Last message in a group
            */

            const isLastInGroup =
                currentSpeaker !==
                nextSpeaker;


            /* =====================================
               CREATE MESSAGE
            ===================================== */

            createMessage(

                item.message,

                side,

                isFirstInGroup,

                isLastInGroup

            );

        }
    );

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


    /* =========================================
       AVATAR
    ========================================= */

    const avatar =
        document.createElement("div");


    avatar.classList.add(
        "chat-avatar"
    );


    /*
       Create initials from the name.
    */

    const words =
        name.split(" ");


    let initials = "";


    if (words.length === 1) {

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


    /* =========================================
       CONTACT NAME
    ========================================= */

    const contactName =
        document.createElement("div");


    contactName.classList.add(
        "chat-contact-name"
    );


    contactName.textContent =
        name;


    /* =========================================
       ADD TO HEADER
    ========================================= */

    header.appendChild(
        avatar
    );


    header.appendChild(
        contactName
    );


    chat.appendChild(
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
    isLastInGroup
) {

    const row =
        document.createElement("div");


    row.classList.add(
        "message-row",
        side
    );


    /* =========================================
       GROUP CLASSES
    ========================================= */

    if (isFirstInGroup) {

        row.classList.add(
            "first-in-group"
        );

    }


    if (isLastInGroup) {

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


    /* =========================================
       CREATE BUBBLE
    ========================================= */

    const bubble =
        document.createElement("div");


    bubble.classList.add(
        "message"
    );


    bubble.textContent =
        messageText;


    /* =========================================
       ADD BUBBLE TO ROW
    ========================================= */

    row.appendChild(
        bubble
    );


    chat.appendChild(
        row
    );

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


    chat.innerHTML = `

        <div class="empty-message">

            Your conversation will appear here.

        </div>

    `;

}


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
