import {Packer, AlignmentType, PageBorders,Document, HeadingLevel, Paragraph, TabStopPosition, TabStopType, TextRun, SymbolRun } from 'docx';
import {saveAs} from 'file-saver';

//this function generate a document to be downloaded
export function genDocxWordWithData(fileName: string, textWrote: string){
    const newDocument = new Document();

    newDocument.addSection({children: buildDataToTheDocument(textWrote),});

    downloadDocx(newDocument,fileName);
}

//Here the user download the document
function downloadDocx(newDoc: Document, fileName: string){
    if(fileName===""){
        fileName="newDoc";
    }

    Packer.toBlob(newDoc).then(blob => {
      saveAs(blob, fileName+".docx");
      console.log("Document created successfully");
    });
}

//This function build the data to the document
function buildDataToTheDocument(textWrote: string){
    const commands = ['#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#n:','#t:','#section:','#subsec:','#text:','#:'];
    let styleFormatList = {};
    let styleTextList = {};
    let data = [];
    let textAux = "", word = "";
    let commentary = false;
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(commands.includes(word)){
            //word diferentes fazem um tipo de formato do paragraph
            if(word==='#:'){ // commentary
                commentary = true;
            }else if(word==='#n:'){ // \n
                if(!commentary){
                    data[data.length] = new Paragraph({children:[new TextRun({text: textAux, ...styleTextList}),], ...styleFormatList});
                }
                textAux = "";
            }else if(word==='#t:'){ // \t
                textAux += '\t';
            }else if(!commentary){
                //get the style
                styleFormatList = getStyleFormatFrom(word);
                styleTextList = getStyleTextFrom(word);
            }
        }else if(textWrote[i]==='\n'){
            if(!commentary){
                data[data.length] = new Paragraph({children:[new TextRun({text: textAux+word, ...styleTextList}),], ...styleFormatList});
            }
            textAux = "";
            commentary = false;
        }else{
            if(i<textWrote.length){
                textAux+=word+textWrote[i];
            }else{
                textAux+=word;
            }
        }
        word="";
    }
    // Get the last line
    if(!commentary){
        data[data.length] = new Paragraph({children:[new TextRun({text: textAux, ...styleTextList})], ...styleFormatList});
    }
    return data;
}

function getStyleFormatFrom(word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#author:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#institute:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#email:':
            styleCreate = {
                spacing: {
                    before: 120, // 240 = 12pt
                    after: 120, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#abstract:':
            styleCreate = {
                spacing: {
                    before: 120, // 240 = 12pt
                    after: 120, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#resumo:':
            styleCreate = {
                spacing: {
                    before: 120, // 240 = 12pt
                    after: 120, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#section:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#subsec:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#text:':
            styleCreate = {
                spacing: {
                    before: 120, // 240 = 12pt
                    after: 0, // 240 = 12pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, // 455 = 0,8cm
                    right: 0, // 455 = 0,8cm
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        default:
            break;
    // '#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#n:','#t:','#section:','#subsec:','#text:','#:'];
    }
    return styleCreate;
}

function getStyleTextFrom(word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 32, // 32 = 16 
                italics: false,
            }
            break;
        case '#author:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24,
                italics: false,
            }
            break;
        case '#institute:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24,
                italics: false,
            }
            break;
        case '#email:':
            styleCreate = {
                bold: false,
                font: "Courier New",
                size: 20,
                italics: false,
            }
            break;
        case '#abstract:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24,
                italics: true,
            }
            break;
        case '#resumo:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24,
                italics: true,
            }
            break;
        case '#section:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 26,
                italics: false,
            }
            break;
        case '#subsec:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24,
                italics: false,
            }
            break;
        case '#text:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24,
                italics: false,
            }
            break;
        default:
            break;
    // '#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#n:','#t:','#section:','#subsec:','#text:','#:'];
    }
    return styleCreate;
}