// Loading in map files & parsing items



// Items to be rendered on-screen. Fixed items (like the fence) don't get parrallax
let items = [
    {
        name: 'dog',
        item: document.querySelector('#dog'), 
        fixed: false,
        position: {x: 2000, z: 4},
        isHeld: false
    },
    {
        name: 'mailbox',
        item: document.querySelector('#mailbox'),
        fixed: true,
        position: {x: 1200, z: 5},
        isHeld: false
    }
]

let mailboxData = items.find(item => item.name === "mailbox"),
    mailbox = mailboxData.item;

mailbox.style.left = mailboxData.position.x;
mailbox.setAttribute('z', mailboxData.position.z);
setPosition(mailbox);