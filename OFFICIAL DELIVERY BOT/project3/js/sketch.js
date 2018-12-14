// Declare a "SerialPort" object
var serial;
var latestData = "waiting for data";  // write incoming data to the canvas
var currentSeason;
var inData;
var alarm;
var voice;

/********************************* delivery bot variables *********************************/

var canvasWidth = 1400;
var canvasHeight = 768;

var emoji, mail;  // robot character
var bg; 
var dialog;

function preload(){
    
    font = loadFont("assets/Futura.ttf");
    
    //sound
    alarm = loadSound("sound/alarm.mp3");
    voice = loadSound("sound/voice.mp3");
    
    //robot character
    bg = loadImage("img/background.png");
    emoji = loadAnimation("img/robot-sleep.png", "img/robot-sleep1.png", "img/robot-sleep2.png", "img/robot-sleep3.png");
    mail = loadAnimation("img/robot-left.png", "img/robot.png", "img/robot-right.png");
    dialog = loadImage("img/dialog.png");
}

function setup() {
    
    createCanvas(canvasWidth, canvasHeight);
    
    textFont(font);
    textSize(24);
    
    mail.visible =false;

    /********************************* set up canvas *********************************/

    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();

    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("/dev/cu.usbmodem1421");

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);

    // When we some data from the serial port
    serial.on('data', gotData);

    // When or if we get an error
    serial.on('error', gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);

}

// We are connected and ready to go
function serverConnected() {
    print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    print("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        print(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    print("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
    print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log(currentString); // println the string
    latestData = currentString; // save it for the draw method
}

// We got raw from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}


function draw() {

    /********************************* draw here *********************************/

    background(181, 216, 226);
    image(bg, 250, 180);
    image(dialog, 420, 525);

    drawSprites();
    
    // create an animation of robot character
    animation(emoji, canvasWidth/2, 250);  // robot wakes up
    animation(mail, canvasWidth/2, 250);  // robot is sleeping
    
    if (latestData> 0){
        text("Your package is here!", 550, 650);
        mail.visible= true;
        emoji.visible = false;
        if(alarm.isPlaying() == false){
            alarm.play();
        }
        if(voice.isPlaying() == false){
            voice.play();
        }
    
        
    } else {
        text("I'm waiting...", 600, 650);
        emoji.visible = true;
        mail.visible= false;
        alarm.stop();  
        voice.stop();
    }
    
}

