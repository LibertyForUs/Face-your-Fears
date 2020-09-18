// Loading in map files & parsing items



// Items to be rendered on-screen. Fixed items (like the fence) don't get parrallax
let items = [
    {
        name: 'dog',
        item: document.querySelector('#dog'), 
        fixed: true,
        position: {x: 2000, z: 4},
        isHeld: false,
    },
    {
        name: 'mailbox',
        item: document.querySelector('#mailbox'),
        fixed: true,
        position: {x: 1500, z: 8},
        isHeld: false,
    },
    {
        name: 'fence',
        item: document.querySelector('#fence'),
        fixed: true,
        position: {x: -170, z: 5},
        isHeld: false,
    },
]

let mailboxData = items.find(item => item.name === "mailbox"),
    fenceData = items.find(item => item.name === "fence"),
    mailbox = mailboxData.item,
    fence = fenceData.item;
    
mailbox.style.left = mailboxData.position.x;
mailbox.setAttribute('z', mailboxData.position.z);
setPosition(mailbox);

fence.style.left = fenceData.position.x;
fence.setAttribute('z', fenceData.position.z);
setPosition(fence);