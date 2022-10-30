import srtParser2 from "srt-parser-2";
import ExcelExport from 'export-xlsx';

import { settingsForExport } from "./xlsSettings";

const textBox = document.getElementById('textBox');
const submit = document.getElementById('btn1');
const another = document.getElementById('btn2');
const fpsSelect = document.getElementById('fpsselect');
let srt = "";
let parsedData;

function processSrt(rawData){
    let parser = new srtParser2();
    parsedData = parser.fromSrt(rawData);
    //console.log(generateCsv(parsedData));
    //document.getElementById('responce').innerHTML = generateCsv(parsedData);
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
    excelExport.downloadExcel(settingsForExport('Converted_SRT'), data);

}

function getSrt(){
    srt = textBox.value;
    const fps = fpsSelect.value;
    if (!srt){
        alert('No SRT data provided.');
        return;
    }
    if ((fps != 23.98 )&&(fps != 24)&&(fps != 25)&&(fps != 29.97)&&(fps != 30)){
        alert('Please slect the frames per second of your video.');
        return;
    }
    let fpsDrop = document.getElementById('fpsselect');
    let button = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');
    fpsDrop.classList.add('hidden');
    button.classList.add('hidden');
    btn2.classList.remove('hidden');
    processSrt(srt);
    downloadXLS();
}

function onDragoverHandler(event) {
 
    event.preventDefault();
    document.body.classList.add('purple');
}

function dragOverOff(event) {
    event.preventDefault();
    document.body.classList.remove('purple');
}
   
   
   
function onFilesDropHandler(event){
    event.stopPropagation(); 
    event.preventDefault();
    let textBox = document.getElementById('textBox');
    let fpsDrop = document.getElementById('fpsselect');
    let button = document.getElementById('btn1');
    textBox.classList.remove('hidden');
    fpsDrop.classList.remove('hidden');
    button.classList.remove('hidden');
    document.body.classList.remove('purple');
    let files = event.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
    let reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function() { textBox.value = reader.result; };
    }
      
      
}

function reloadPage() {
    location.reload();
}


submit.addEventListener('click', getSrt);
document.addEventListener('dragover', onDragoverHandler);
document.addEventListener('dragleave', dragOverOff);
document.addEventListener("drop", onFilesDropHandler);
another.addEventListener('click', reloadPage)


