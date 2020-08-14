import {Packer, AlignmentType,Document, Paragraph, TextRun, Media, TableCell, TableRow, Table } from 'docx';
import {saveAs} from 'file-saver';

//this next import will be used in the future
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import api from './api';

//this function generate a document to be downloaded
export function genDocxWordWithData(fileName: string, textWrote: string){
    const newDocument = buildDataToTheDocument(textWrote);

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
    const newDocument = new Document();
    
    const fixedCommands = ['#:','#b:','#bc:','#i:','#ic:','#n','#t']; //are all fixed commands
    let commands = ['#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#section:',
    '#subsec:','#text:', '#ref:', '#img:', '#caption:','#caption-justified','#table-title:',
    '#table-title-justified:','#table:'];   // default commands(can be changed by a new template)
    let styleFormatList = {};
    let styleTextList = {};
    let data = [], phrase = [];
    let word = "", sectionNum=1, subsecNum=1, pictureNum=1, tableNum=1, templateName='sbc'; //default template
    let commentary = false, theNextIsAnImage = false, orderThings = false;
    
    //Default Settings
    let captionDefault='#caption:', bigCaptionDefault='#caption-justified:';
    let tableTitleDefault='#table-title:', bigTableTitleDefault='#table-title-justified:';
    let sectionDefault='#section:', subsecDefault='#subsec:';
    let imgDefault = '#img:';    
    let tableDefault = '#table:';  
    
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#template:' && !commentary){ // #template: is a fixed command
            i++;
            if(templateName!==''){
                templateName='';
            }
            while(textWrote[i]!=='\n' && i<textWrote.length){
                templateName+=textWrote[i];
                i++;
            }
            api.get('template/commands?template='+templateName).then(response => {
                commands = response.data.allcommands;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=table').then(response => {
                tableDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=image').then(response => {
                imgDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=caption').then(response => {
                captionDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=bigcaption').then(response => {
                bigCaptionDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=tabletitle').then(response => {
                tableTitleDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=bigtabletitle').then(response => {
                bigTableTitleDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=section').then(response => {
                sectionDefault = response.data.command;
            });
            api.get('template/command/type?template='+templateName+'&commandtype=subsection').then(response => {
                subsecDefault = response.data.command;
            });
        }else if(word==='#order:' && !commentary){ // #order: is a fixed command
            i++;
            let orderString = ''
            while(textWrote[i]!=='\n' && i<textWrote.length){
                orderString+=textWrote[i];
                i++;
            }
            if(orderString==='TRUE' || orderString==='True' || orderString==='true' || orderString==='T' || orderString==='t'){
                orderThings=true;
            }else{
                orderThings=false;
            }
        }else if(word===tableDefault && !commentary){
            let response = createTable(textWrote, i, templateName, tableDefault);
            //@ts-ignore
            data[data.length] = response.table;
            //@ts-ignore
            i = response.newIndex;
        }else if(theNextIsAnImage){ //If is an image
            let width = 0, height = 0, newSize='';
            theNextIsAnImage = false;
            const fileImg = fetch(word).then(r => r.blob());
            if(textWrote[i]!=='\n'){ // Resizable
                i++;
                while(textWrote[i]!==' ' && textWrote[i]!=='\n'){
                    newSize+=textWrote[i];
                    i++;
                }
                width=Number(newSize);
                newSize='';
                while(textWrote[i]!=='\n'){
                    newSize+=textWrote[i];
                    i++;
                }
                if(newSize===''){
                    height=width;
                    newSize='flag'; //something to continue
                }else{
                    height=Number(newSize);
                }
            }
            let newImage;
            if(newSize!==''){
                //@ts-ignore
                newImage = Media.addImage(newDocument, fileImg,width, height); 
            }else{
                //@ts-ignore
                newImage = Media.addImage(newDocument, fileImg);
            }
            data[data.length] = new Paragraph({children: [newImage], ...styleFormatList});
        }else if(fixedCommands.includes(word) || commands.includes(word)){
            if(word==='#:'){ // commentary
                if(textWrote[i]!=='\n'){
                    commentary = true;
                }
            }else if(word==='#n:'){ // \n
                if(!commentary){
                    data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
                }
                phrase = []
            }else if(word==='#t:' && !commentary){ // \t
                phrase[phrase.length] = new TextRun({text: '\t',...styleTextList})
            }else if(word==='#b:' || word==='#bc:' || word==='#i:' || word==='#ic:'){ // bold and italic
                if(!commentary){
                    if(word==='#b:'){
                        styleTextList = { ...styleTextList, bold: true}
                    }else if(word==='#bc:'){
                        styleTextList = { ...styleTextList, bold: false}
                    }else if(word==='#i:'){
                        styleTextList = { ...styleTextList, italics: true}
                    }else if(word==='#ic:'){
                        styleTextList = { ...styleTextList, italics: false}
                    }
                }
            }else if(!commentary){
                //get the paragraph style
                styleFormatList = getStyleFormatFrom(templateName, word);
                //get the text style
                styleTextList = getStyleTextFrom(templateName, word);
                if(orderThings){
                    if(word===captionDefault || word===bigCaptionDefault){
                        phrase[phrase.length] = new TextRun({text: 'Picture '+pictureNum+'. ', ...styleTextList})
                        pictureNum++;
                    }else if(word===tableTitleDefault || word===bigTableTitleDefault){
                        phrase[phrase.length] = new TextRun({text: 'Table '+tableNum+'. ', ...styleTextList})
                        tableNum++;
                    }else if(word===sectionDefault){
                        subsecNum=1;
                        phrase[phrase.length] = new TextRun({text: sectionNum+'. ', ...styleTextList})
                        sectionNum++;
                    }else if(word===subsecDefault){
                        phrase[phrase.length] = new TextRun({text: sectionNum+'.'+subsecNum+'. ', ...styleTextList})
                        subsecNum++;
                    }
                }
                if(word===imgDefault){
                    theNextIsAnImage = true;
                }
            }
        }else if(textWrote[i]==='\n'){
            if(!commentary){
                phrase[phrase.length] = new TextRun({text: word,...styleTextList});
                data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
            }
            phrase = []
            commentary = false;
        }else{
            if(i<textWrote.length){
                phrase[phrase.length] = new TextRun({text: word+textWrote[i],...styleTextList})
            }else{
                phrase[phrase.length] = new TextRun({text: word,...styleTextList})
            }
        }
        word="";
    }
    // Get the last line
    if(!commentary){
        data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
    }

    newDocument.addSection({margins: { //margin of the document
        top: 1985,  // 3,5cm = 1985
        right: 1700,  // 3cm = 1700
        bottom: 1420,  // 2,5cm = 1420
        left: 1700,  //3cm = 1700
    },children: data,});

    return newDocument;
}

//Create the table
function createTable(textWrote: string, index: number, templateName: string, tableCommand: string){
    let response = {};
    let newIndex = index;
    let word = '', phrase = '';
    let rows = [];
    let cels = [];
    
    //get the paragraph style
    let styleFormatList = getStyleFormatFrom(templateName, tableCommand);
    //get the text style
    let styleTextList = getStyleTextFrom(templateName, tableCommand);
    
    for(let i=index; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#tablec:'){  //for a while, this command will be constant
            newIndex = i;
            break;
        }else if(word==='#celc:'){ //for a while, this command will be constant
            cels[cels.length] = new TableCell({
                                children: [new Paragraph({children:[new TextRun({text: phrase, ...styleTextList})],})],
                            });
            phrase = '';
        }else if(word==='#rowc:'){ //for a while, this command will be constant
            rows[rows.length] = new TableRow({children: cels});
            cels = [];
        }else{
            phrase+=word;
            if(textWrote[i]!=='\n'){
                phrase+=textWrote[i];
            }
        }
        word='';
    }
    const table = new Table({
        rows: rows,
        ...styleFormatList,
    });
    response = {newIndex: newIndex, table: table}
    return response;
}

//Get the style to the paragraph
function getStyleFormatFrom(templateName: string, word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#author:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#institute:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#email:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#abstract:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
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
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
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
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#subsec:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#text:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#ref:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    hanging: 285, // 285 = 0,5cm
                    left: 285, // 285 = 0,5cm
                    right: 0,
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#caption:': // for one line caption
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt 
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8 cm
                    right: 455, // 455 = 0,8 cm
                },
                alignment: AlignmentType.CENTER, //if there is more than 1 line, is justified
            }
            break;
        case '#caption-justified:':   //for two or more line captions
            styleCreate = { 
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt 
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8 cm
                    right: 455, // 455 = 0,8 cm
                },
                alignment: AlignmentType.JUSTIFIED, //if there is more than 1 line, is justified
            }
            break;
        case '#img:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0,
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#table-title:': //for one line titles
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#table-title-justified:': //for two or more line titles
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#table:': 
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        default:
            break;
    }
    return styleCreate;
}

//Get the style to the text
function getStyleTextFrom(templateName: string, word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 32, // 32 = 16 size
                italics: false,
            }
            break;
        case '#author:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24, // 24 = 12 size
                italics: false,
            }
            break;
        case '#institute:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#email:':
            styleCreate = {
                bold: false,
                font: "Courier New",
                size: 20, // 20 = 10 size
                italics: false,
            }
            break;
        case '#abstract:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: true,
            }
            break;
        case '#resumo:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: true,
            }
            break;
        case '#section:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 26, //26 = 13 size
                italics: false,
            }
            break;
        case '#subsec:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#text:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#ref:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#caption:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#caption-justified:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#img:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#table-title:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#table-title-justified:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#table:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        default:
            break;
    }
    return styleCreate;
}
