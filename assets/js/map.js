// Loading in map files & parsing items
let path = window.location.pathname,
    currentLevel = null,
    itemTypes = [], // Stores every @symbol in a map file
    items = [];     // Stores every instance - a map can have multiple instances of an item-type
let dog;
// Creates and appends a new DOM element in the .above-ground plane, and returns it
function createDOMElement(name){
    let item = document.createElement('div');
    item.classList.add(name);
    return document.querySelector('.above-ground').appendChild(item);
}

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

                        // let item = document.createElement('div');
                        // item.classList.add(element.name);
                        // document.querySelector('.above-ground').appendChild(item);
                        // element.item = document.querySelector(`#${itemName}`);

                        // If this element has a position value coded in, we read it (otherwise we calculate position based on map)
                        if( element.hasOwnProperty('position') ){
                            element.position = attributesArr.find(item => item.indexOf('position:') === 0) // Storing position as an Object, it's like so: "{x:5,z:2}"
                                .split('{')[1]  // Removing {,}, and ',' characters from string
                                .split('}')[0]
                                .split(',')
                                .reduce((accumulator, currentValue) => {    // Reducing vals into a single object
                                        let keyVal = currentValue.split(':');;
                                        return {...accumulator, [keyVal[0]] : Number(keyVal[1])};
                                    },{}
                                );
                            // Adding element to the list of rendered on-screen items
                            element.item = createDOMElement(element.name);
                            items.push(element);
                        }
                        itemTypes.push(element);        
                    }
                }

                // determining object placement based on map symbols
                let mapPlacementIndex = lines.indexOf('/=='), // placement tiles start with the line /==
                    mapPlacementEndIndex,   // index of the termination of placement symbols
                    mapLines,               // Array of all placement tiles
                    mapWidth,               // Map dimensions
                    mapHeight,
                    stageWidth = 1900,
                    stageHeight = 10;

                // Sanity check
                if( !!mapPlacementIndex ){
                    mapPlacementEndIndex = lines.indexOf('\==');    // the last placement line's index
                    mapLines = lines.slice(mapPlacementIndex  + 1, mapPlacementEndIndex);
                    mapWidth = mapLines[0].length;
                    mapHeight = mapLines.length;

                    // Runs for every line of map data
                    for(let i = 0; i < mapLines.length; i++){
                        
                        // Running for each character in a line
                        for(let j = 0; j < mapLines[i].length; j++){

                            if(mapLines[i][j] !== " "){
                                let symbol = mapLines[i][j],
                                    symbolElement = JSON.parse( JSON.stringify( itemTypes.find(item => item.symbol === symbol))); // non-destructively duplicating item from itemTypes

                                symbolElement.position = {
                                    x: 800 + (stageWidth * (j / mapWidth)), // setting a min x of 800, bugfix for css perspective warping making x:0 hidden offstage to the left
                                    z: stageHeight * ((mapHeight - i) / mapHeight)  // inverting the z, so 0 is at the bottom (subtracting i from mapHeight)
                                }
                                symbolElement.item = createDOMElement(symbolElement.name);
                                items.push(symbolElement);
                            }
                        }
                    }
                }

                // Initializing map items
                for(let index in items){
                    let itemData = items[index],
                        item = itemData.item;

                    item.style.left = itemData.position.x;
                    item.setAttribute('z', itemData.position.z);
                    setPosition(item);

                    debugger;
                    if(itemData.name === "dog"){                        
                        dog = document.querySelector('.dog');
                        holdables.push(item);
                        initialiseDog();
                    }
                }


                // mailboxData = items.find(item => item.name === "mailbox");
                // fenceData = items.find(item => item.name === "fence");
                // dogData = items.find(item => item.name === "dog")

                // if(fenceData !== undefined){
                //     fence = fenceData.item;
                //     fence.style.left = fenceData.position.x;
                //     fence.setAttribute('z', fenceData.position.z);
                //     setPosition(fence);
                // }

                // if(mailboxData !== undefined){
                //     mailbox = mailboxData.item;
                //     mailbox.style.left = mailboxData.position.x;
                //     mailbox.setAttribute('z', mailboxData.position.z);
                //     setPosition(mailbox);
                // }

                // if(dogData !== undefined){
                //     dog = dogData.item;
                //     dog.style.left = dogData.position.x;
                //     dog.setAttribute('z', dogData.position.z);
                //     setPosition(dog);
                //     holdables.push(dog);
                //     initialiseDog(); // starts wagging behaviour
                // }
                

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