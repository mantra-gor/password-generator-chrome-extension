const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_-+={}[]:;<,>./?";

let password = "";
let passwordLength = 8;
let checkCount = 0;
// set circle color gray 

// Sets password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "% 100%";
} 
handleSlider();

// Set Indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `2px 2px 6px ${color}, -2px -2px 6px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSysmbols(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper =false;
    let hasLower =false;
    let hasNum =false;
    let hasSym =false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;    

    if((hasUpper && hasSym && (hasNum || hasLower)) ||
       (hasUpper && hasLower && (hasNum || hasSym) && passwordLength > 10) || 
       (hasLower && hasSym && (hasNum || hasUpper)) &&
       (passwordLength >= 8)
    ){
        setIndicator("#0f0")
    }

    else if((hasUpper || hasLower) &&
            (hasNum || hasSym) &&
            passwordLength >=6 || 
            (hasUpper && hasLower && passwordLength>=12)){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
        console.log("Copied completed");
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }
    copyMsg.classList.add('active');
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++ ;
        }
    });
    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
};

function shufflePassword(array){
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("click",handleCheckBoxChange);
});

inputSlider.addEventListener('input',(Event) => {
    passwordLength = Event.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copyContent();
    }
});

generateBtn.addEventListener('click',() => {
    if(checkCount = 0) return;

    // main logic to generate password
    //remove old password
    password = "";

    // lets put the stuff mentioned in checkboxes

    let funcArray = [];
    if(uppercaseCheck.checked){
        funcArray.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArray.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArray.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArray.push(generateSysmbols);
    }

    // compulsory addition
    for(let i=0; i<funcArray.length; i++){
        password += funcArray[i]();
    }

    // remaining addition
    for(let i=0; i < passwordLength - funcArray.length; i++){
        let randIndex = getRandomInteger(0,funcArray.length);
        try{
            password += funcArray[randIndex]();
        }
        catch(e){
            console.log(e);
        }
    }

    //shuffle password
    password = shufflePassword(Array.from(password));

    // display the password
    passwordDisplay.value = password;

    // calculation strength func call
     calcStrength();
});