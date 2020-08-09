//Here I will convert the data from the writer
//And gen a docx with the data
//After that the docx will be downloaded

import {Packer, AlignmentType, Document, HeadingLevel, Paragraph, TabStopPosition, TabStopType, TextRun } from 'docx';
import {saveAs} from 'file-saver';

export function genDocxWordWithData(fileName: string, textWrote: string){
    console.log(fileName, textWrote);
    const doc = new Document();

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "test.docx");
      console.log("Document created successfully");
    });
}
