const redSlider = document.getElementById("red-slider")
const greenSlider = document.getElementById("green-slider")
const blueSlider = document.getElementById("blue-slider")
const redValue = document.getElementById("red-value")
const greenValue = document.getElementById("green-value")
const blueValue = document.getElementById("blue-value")
const mainColorSwatch = document.getElementById("main-swatch")
const submitbutton = document.getElementById("submit-button")
const guessContainer = document.getElementById("guess-container")
const hexGuessValue = document.getElementById("hex-guess-value")
const errorMargin = 10
const apiUrl = 'https://www.colr.org/json/color/random'
//win screen vars
const winScreen = document.getElementById("win-screen")
const lossScreen = document.getElementById("loss-screen")
const winNumber = document.getElementById("win-number")
const winMainColor = document.getElementById("win-main-color")
const winGuessColor = document.getElementById("win-guess-color")
const winMainColorRGB = document.getElementById("win-main-color-rgb")
const winMainColorHex = document.getElementById("win-main-color-hex")
const winGuessColorRGB = document.getElementById("win-guess-color-rgb")
const winGuessColorHex = document.getElementById("win-guess-color-hex")
const retryButton = document.getElementById("retry-button")
const retryButton2 = document.getElementById("retry-button2")
const lossMainColor = document.getElementById("loss-main-color")
const lossGuessColor = document.getElementById("loss-guess-color")
const lossMainColorRGB = document.getElementById("loss-main-color-rgb")
const lossMainColorHex = document.getElementById("loss-main-color-hex")
const lossGuessColorRGB = document.getElementById("loss-guess-color-rgb")
const lossGuessColorHex = document.getElementById("loss-guess-color-hex")

let mainColor
let allGuesses = []
let correctValues 
let currentHexGuess = "#000000"
 

function updateCurrentGuess(){
    currentHexGuess = rgbToHex(redValue.value, greenValue.value, blueValue.value)
    hexGuessValue.textContent = currentHexGuess
    
}

submitbutton.addEventListener("click", submitGuess)
retryButton.addEventListener('click', restartGame)
retryButton2.addEventListener('click', restartGame)

function restartGame(){
    getNewColor()
    winScreen.classList.add("hide")
    lossScreen.classList.add("hide")
    allGuesses = []
    var rowsToDelete = document.getElementsByClassName("guess-row")
    while(rowsToDelete.length > 0){
        rowsToDelete[0].parentNode.removeChild(rowsToDelete[0])
    }
    redSlider.value = 0
    greenSlider.value = 0
    blueSlider.value = 0
    redValue.value = 0
    greenValue.value = 0
    blueValue.value = 0
    hexGuessValue.textContent = "#000000"
    
}

function submitGuess(){
    if(allGuesses.length < 4){
        correctValues = hexToRgb(mainColor)
        var guess = [redValue.value, greenValue.value, blueValue.value]
        var guessHighLow = []
        allGuesses.push(guess)
        console.log(correctValues)
        var allCorrect = true
        for(let i = 0; i<correctValues.length; i++){
            if(guess[i] > (correctValues[i] + errorMargin)){
                guessHighLow.push("high")
                allCorrect = false
            } else if(guess[i] < (correctValues[i] - errorMargin)){
                guessHighLow.push("low")
                allCorrect = false
            }else{
                guessHighLow.push("right")
            }
        }
        addRow(guessHighLow)
        if(allCorrect == true){
            showWinner(currentHexGuess)
        }
        if(allGuesses.length == 4){
            showLoser(currentHexGuess)
        }
    }
    
}


function addRow(highLow){
    const lastGuess = allGuesses[allGuesses.length - 1]
    let guessColor = rgbToHex(lastGuess[0], lastGuess[1], lastGuess[2])
    let guessRow = document.createElement('div')
    guessRow.className += " guess-row"

    let guessSwatchHolder = document.createElement('div')
    guessSwatchHolder.className += " guess-swatch-holder"

    let guessSwatch = document.createElement('div')
    guessSwatch.className += " guess-swatch"
    guessSwatch.style.backgroundColor = guessColor
    guessSwatchHolder.appendChild(guessSwatch)
    guessRow.appendChild(guessSwatchHolder)

    
    for(let i=0; i < lastGuess.length; i++){
        let guessNumberHolder = document.createElement('div')
        guessNumberHolder.className += " guess-number-holder"
        let guessNumber = document.createElement('div')
        guessNumber.className += "guess-number"
        if(highLow[i] == "high"){
            guessNumber.className += " high-guess"
        } else if (highLow[i] == "low"){
            guessNumber.className += " low-guess"
        } else {
            guessNumber.className += " correct-guess"
        }
        guessNumber.textContent = lastGuess[i]
        guessNumberHolder.appendChild(guessNumber)
        guessRow.appendChild(guessNumberHolder)
    }
    let guessHexHolder = document.createElement('div')
    guessHexHolder.className += " guess-hex-holder"
    guessRow.appendChild(guessHexHolder)
    guessContainer.prepend(guessRow)
}

function showWinner(guessHex){
    let guessRGB = hexToRgb(guessHex)
    winScreen.classList.remove("hide")
    winMainColor.style.backgroundColor = mainColor
    winGuessColor.style.backgroundColor = guessHex
    winMainColorRGB.textContent = `rgb(${correctValues[0]}, ${correctValues[1]}, ${correctValues[2]})`
    winGuessColorRGB.textContent = `rgb(${guessRGB[0]}, ${guessRGB[1]}, ${guessRGB[2]})`
    winMainColorHex.textContent = mainColor.toUpperCase()
    winGuessColorHex.textContent = guessHex
    if(allGuesses.length >1){
        winNumber.textContent = `It took you ${allGuesses.length} guesses` 
    } else {
        winNumber.textContent = `You got it first try`
    }
    
}

function showLoser(guessHex){
    let guessRGB = hexToRgb(guessHex)
    lossScreen.classList.remove("hide")
    lossMainColor.style.backgroundColor = mainColor
    lossGuessColor.style.backgroundColor = guessHex
    lossMainColorRGB.textContent = `rgb(${correctValues[0]}, ${correctValues[1]}, ${correctValues[2]})`
    lossGuessColorRGB.textContent = `rgb(${guessRGB[0]}, ${guessRGB[1]}, ${guessRGB[2]})`
    lossMainColorHex.textContent = mainColor.toUpperCase()
    lossGuessColorHex.textContent = guessHex
    
}


redSlider.oninput = function(){
    redValue.value = this.value
    updateCurrentGuess()
}
greenSlider.oninput = function(){
    greenValue.value = this.value
    updateCurrentGuess()
}
blueSlider.oninput = function(){
    blueValue.value = this.value
    updateCurrentGuess()
}

redValue.oninput = function(){
    redSlider.value = this.value
    updateCurrentGuess()
}
greenValue.oninput = function(){
    greenSlider.value = this.value
    updateCurrentGuess()
}
blueValue.oninput = function(){
    blueSlider.value = this.value
    updateCurrentGuess()
}

function componentToHex(c) {
    c = Number(c)
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r).toUpperCase() + componentToHex(g).toUpperCase() + componentToHex(b).toUpperCase();
}

function hexToRgb(hex) {
    hex = hex.replace("#", "");
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return [r,g,b];
}
  


function getNewColor(){
    fetch(apiUrl, {cache: "no-store"})
    .then(response => {
        if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
        }
        
        return response.json();
        
    })
    .then(data => {
        // Process the JSON data here
        if ("colors" in data && data.colors.length > 0) {
        const colors = data.colors;
        const firstColor = colors[0]; 
        if ("hex" in firstColor) {
            const hexValue = firstColor.hex;
            if(!hexValue){
                getNewColor()
            }
            mainColor = "#"+hexValue;
            mainColorSwatch.style.backgroundColor = mainColor
        } else {
            console.log("No 'hex' value found in the first color entry.");
        }
        } else {
        console.log("No color data found in the JSON.");
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

window.onload = function(){
    getNewColor()
}