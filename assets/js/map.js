// Loading in map files & parsing items
let path = window.location.pathname,
    currentLevel = null,
    items = [],
    mailboxData, fenceData, mailbox, fence;

// Checking that we have a map
if(path.indexOf('/level/') !== -1){
    currentLevel = Number( path.substring(path.indexOf('/level/') + 7) );
    
    if(currentLevel > 0){ // sanity check, edgecase where /level/ doesn't have a number in the URL
        fetch(`/maps/level ${currentLevel}.map`)
            .then(response => response.text())
            .then(data => {
                
                // Parsing in the map file
                let lines = data.split('\n');
                for(let i = 0; i < lines.length; i ++){
                    
                    // Skipping # comments
                    if(lines[i][0] === '#')
                        continue;

                    // The @ symbol defines elements on the map
                    if(lines[i][0] === '@'){
                        let attributesArr = lines[i].split(' ');
                        let itemName = attributesArr.shift().substr(1);// removing the @ symbol, retrieving item name
                        let element = attributesArr.reduce((array, current) => {
                            var [key, value] = [...current.split(':')];
                            // Converting values to boolean, if they're "true" or "false"
                            value = (value === "true" || value === "false" ? 
                                (value === "true" ? true : false) : 
                                value 
                                ) 
                            return {...array, // previous values, spread into this object
                                [key]: value //[key] ensures we pass the value stored in the key variable, rather than setting the word "key" itself as key
                            }}, {})
                        
                        element.name = itemName;
                        element.item = document.querySelector(`#${itemName}`);
                        element.position = attributesArr.find(item => item.indexOf('position:') === 0) // Storing position as an Object, it's like so: "{x:5,z:2}"
                            .split('{')[1]  // Removing {,}, and ',' characters from string
                            .split('}')[0]
                            .split(',')
                            .reduce((accumulator, currentValue) => {    // Reducing vals into a single object
                                    let keyVal = currentValue.split(':');;
                                    return {...accumulator, [keyVal[0]] : Number(keyVal[1])};
                                },{}
                            );
                        items.push(element);        
                    }
                }

                // Initializing elements
                mailboxData = items.find(item => item.name === "mailbox");
                fenceData = items.find(item => item.name === "fence");
                mailbox = mailboxData.item;
                fence = fenceData.item;
                
                mailbox.style.left = mailboxData.position.x;
                mailbox.setAttribute('z', mailboxData.position.z);
                setPosition(mailbox);

                fence.style.left = fenceData.position.x;
                fence.setAttribute('z', fenceData.position.z);
                setPosition(fence);

                initializeDog();
                debugger;

            }).catch(error => {
                console.log('error', error);
                debugger;
            })
        }
}


// Items to be rendered on-screen. Fixed items (like the fence) don't get parrallax. isHeld is true when the object moves with Oc
// items = [
//     {
//         name: 'dog',
//         item: document.querySelector('#dog'), 
//         fixed: true,
//         position: {x: 2000, z: 4},
//         isHeld: false,
//     },
//     {
//         name: 'mailbox',
//         item: document.querySelector('#mailbox'),
//         fixed: true,
//         position: {x: 1500, z: 5.5},
//         isHeld: false,
//     },
//     {
//         name: 'fence',
//         item: document.querySelector('#fence'),
//         fixed: true,
//         position: {x: -200, z: 5},
//         isHeld: false,
//     },
// ]

