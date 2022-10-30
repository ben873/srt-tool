import srtParser2 from "srt-parser-2";
import ExcelExport from 'export-xlsx';

import { SETTINGS_FOR_EXPORT } from "./xlsSettings";

const textBox = document.getElementById('input');
const submit = document.getElementById('btn1');
const fpsSelect = document.getElementById('fpsselect');
var srt = "";
var parsedData;

function processSrt(rawData){
    
    var parser = new srtParser2();
    parsedData = parser.fromSrt(rawData);
    console.log(generateCsv(parsedData));
    document.getElementById('responce').innerHTML = generateCsv(parsedData);
}

function calculateFrame(milliseconds) {
    const fps = fpsSelect.value;
    const seconds = milliseconds / 1000.0;

    let fr = Math.round(fps * seconds);
    if (fr<10){
        return `0${fr}`;
    }
    return `${fr}`;
}

function convertTimecode(timeCode) {
    const elements = timeCode.split(',');
    const [baseTime, milliseconds] = elements;

    const frame = calculateFrame(milliseconds);

    return `${baseTime}:${frame}`;
}

function generateCsv(data) {
    const csvLines = data.map((line)=>{
        const { id, startTime, endTime, text } = line;
        const convertedTcIn = convertTimecode(startTime);
        const convertedTcOut = convertTimecode(endTime);

        return `${id},${convertedTcIn},${convertedTcOut},${text}`;
    })

    return csvLines.join("\n");
}

function generateXLSData(data) {
    return data.map((line)=>{
        const { id, startTime, endTime, text } = line;
        const tcIn = convertTimecode(startTime);
        const tcOut = convertTimecode(endTime);

        return { id, tcIn, tcOut, text };
    })
}

function downloadXLS() {
    if(!parsedData) return;

    const xlsData = generateXLSData(parsedData);
    const data = [
        {
            table1: xlsData
        }
    ];

    const excelExport = new ExcelExport();
    excelExport.downloadExcel(SETTINGS_FOR_EXPORT, data);

}

function getSrt(){
    srt = textBox.value;
    processSrt(srt);
    downloadXLS();
}

function ondragoverHandler(event) {
 
    event.preventDefault();
}
   
   
   
function onfilesdropHandler(event){
   
   
    event.stopPropagation(); 
    event.preventDefault();
    var files = event.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
    let reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function() { document.getElementById('input').value = reader.result; };
    }
      
      
}


submit.addEventListener('click', getSrt);
