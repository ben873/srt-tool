import srtParser2 from "srt-parser-2";

const textBox = document.getElementById('input');
const submit = document.getElementById('btn1');
var srt = "";

function processSrt(rawData){
    
    var parser = new srtParser2();
    var result = parser.fromSrt(rawData);
    console.log(generateCsv(result));
    document.getElementById('responce').innerHTML = generateCsv(result);
}

function generateCsv(data) {
    console.log(data.map((line)=>(`${line.startTime},${line.startSeconds}`)).join("\n"));
    return data.map((line)=>(`${line.startTime},${line.startSeconds}`)).join("\n");
}

function getSrt(){
    srt = textBox.value;
    processSrt(srt);
}


submit.addEventListener('click', getSrt);
