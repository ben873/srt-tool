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

    return fps * seconds;
}

function convertTimecode(timeCode) {
    const elements = timeCode.split(',');
    const [baseTime, milliseconds] = elements;

    const frame = Math.round(calculateFrame(milliseconds));

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

        return { id, tcIn, tcOut };
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


submit.addEventListener('click', getSrt);
