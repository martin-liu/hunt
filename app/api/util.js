const fs = require('fs');
const path = require('path');
const textract = require('textract');
const PDFJS = require('pdfjs-dist');
const _ = require('lodash');

const mimeMap = {
  doc: 'application/msword',
  dot: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  docm: 'application/vnd.ms-word.document.macroEnabled.12',
  dotm: 'application/vnd.ms-word.template.macroEnabled.12',

  pdf: 'application/pdf'
};

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

module.exports = new class Util {
  getMime (file) {
    let ext = _.trim(path.extname(file), '.') || 'doc';
    return mimeMap[ext];
  }

  async extractText (mime, file) {
    if (mime == mimeMap.pdf) {
      return this.extractPdfText(file);
    }

    return new Promise((rs, rj) => {
      textract.fromFileWithMimeAndPath(mime, file, {preserveLineBreaks: true},  function( error, text ) {
        if (error) {
          return rj(error);
        } else {
          return rs(text);
        }
      });
    });
  }

  async extractPdfText(file) {
    return new Promise((rs, rj) => {
      fs.readFile(file, (err, data) => {
        if (err) return rj(err);

        this.pdfToText(toArrayBuffer(data), () => {}, (text) => {
          rs(text);
        });

        return null;
      });
    });
  }

  pdfToText (data, callbackPageDone, callbackAllDone) {
    console.assert( data instanceof ArrayBuffer  || typeof data == 'string' );

    let complete = 0;

    let getX = (item) => item.transform[4];
    let getY = (item) => item.transform[5];

    PDFJS.getDocument( data ).then( function(pdf) {

      var total = pdf.numPages;
      callbackPageDone( 0, total );
      var layers = {};
      for (let i = 1; i <= total; i++){
        pdf.getPage(i).then( function(page){
          var n = page.pageNumber;
          page.getTextContent().then( function(textContent){
            if( null != textContent.items ){
              var page_text = "";
              var last_block = null;
              for( var k = 0; k < textContent.items.length; k++ ){
                var block = textContent.items[k];
                if( last_block != null // && last_block.str[last_block.str.length-1] != ' '
                  ){
                  if( getX(block) < getX(last_block) )
                    page_text += "\n";
                  else if ( getY(last_block) != getY(block) && ( last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null ))
                    page_text += ' ';
                }
                page_text += block.str;
                last_block = block;
              }

              textContent != null && console.log("page " + n + " finished."); //" content: \n" + page_text);
              layers[n] =  page_text + "\n\n";
            }
            ++ complete;
            callbackPageDone( complete, total );
            if (complete == total){
              setTimeout(function(){
                var full_text = "";
                var num_pages = Object.keys(layers).length;
                for( var j = 1; j <= num_pages; j++)
                  full_text += layers[j] ;
                callbackAllDone(full_text);
              }, 1000);
            }
          }); // end  of page.getTextContent().then
        }); // end of page.then
      } // of for
    });
  }

};
