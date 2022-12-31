/*
    FOF control sector creation script
    for UZB

    by K. "ashifolfi" J.
*/

`#version 4`;

`#name Create FOF`;
`#description Creates a fof control sector of your chosen settings using the current cursor position.
also autotags any selected sectors.`;

let basepos = UDB.Map.snappedToGrid(UDB.Map.mousePosition);

let totag = UDB.Map.getSelectedSectors();

var p = new Pen();

let qoldi = new UDB.QueryOptions();
function requestOptions() {
    //#region Base FOF Info

    // Type
    qoldi.addOption('type', 'FOF Type', 11, 1, {
        1: "Solid",
        2: "Water",
        3: "Air Bobbing",
        4: "Water Bobbing",
        5: "Crumbling",
        6: "Rising",
        7: "Light Block",
        8: "Fog Block",
        9: "Intangible"
    });

    // Textures
    qoldi.addOption('walltex', 'Wall Texture', 6, "GFZROCK");
    qoldi.addOption('ceilingtex', 'Ceiling Texture', 7, "GFZROCK");
    qoldi.addOption('floortex', 'Floor Texture', 7, "GFZROCK");

    // heights
    qoldi.addOption('floorheight', 'Floor Height', 0, 0);
    qoldi.addOption('ceilingheight', 'Ceiling Height', 0, 56);

    if (!qoldi.query())
        UDB.die('Aborted FOF Creation');
    
    //#endregion
}

function displayResults(tag) {
    UDB.showMessage(`FOF Control Sector Created.
    Tag: ` + tag);
}

function drawTrigSector(tlpos) {
    p.setAngle(90).moveTo(basepos).drawVertex()
        .moveForward(128).drawVertex()
        .turnRight(90 + 45)
        .moveForward(181).drawVertex()
        .turnRight(90 + 45)
        .moveForward(128).drawVertex();
    
    if(!p.finishDrawing(true))
        throw "Something went wrong while drawing!";
}

//#region main execution

// Get thew new tags
let tags = UDB.Map.getMultipleNewTags(1);

// reqeust options from the user first
requestOptions();

// finish drawing the sector
p.setAngle(90).moveTo(basepos).drawVertex()
    .turnRight(45).moveForward(181).drawVertex()
    .turnLeft(90 + 45).moveForward(128).drawVertex()
    .turnLeft(90).moveForward(128).drawVertex();

if(!p.finishDrawing(true))
    throw "Something went wrong while drawing!";

// Get the new sector, set textures, and set heights
let sector = UDB.Map.getMarkedSectors()[0];
sector.floorHeight = qoldi.options.floorheight;
sector.ceilingHeight = qoldi.options.ceilingheight;

sector.ceilingTexture = qoldi.options.ceilingtex;
sector.floorTexture = qoldi.options.floortex;

// grab the first line drawn (the hypotenuse) and set values
let fofline = UDB.Map.getMarkedLinedefs()[0];
let foftags = {
    1: 100,
    2: 120,
    3: 150,
    4: 160,
    5: 170,
    6: 190,
    7: 200,
    8: 202,
    9: 220
}
fofline.action = foftags[qoldi.options.type];
fofline.args[0] = tags[0];
fofline.front.middleTexture = qoldi.options.walltex;

totag.forEach(s => s.addTag(tags[0]));

displayResults(tags[0]);

//#endregion