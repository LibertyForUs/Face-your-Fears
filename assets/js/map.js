// Loading in map files & parsing items

// Items to be rendered on-screen. Fixed items (like the fence) don't get parrallax
let items = [
    {
        name: 'dog',
        item: document.querySelector('#dog'), 
        fixed: false,
        position: {x: 2000, z: 4},
        isHeld: false
    }
]