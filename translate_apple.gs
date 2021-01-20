
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Generate translation...', functionName: 'generateTranslation'}
  ];
  spreadsheet.addMenu('Traducciones', menuItems);
}

function generateTranslation() {
  var spreadsheet = SpreadsheetApp.getActive();
  var originalSheet = spreadsheet.getSheetByName('original');
  originalSheet.activate();

  //Solicitamos al usuario el idioma de origen y de destion para la traducción
  var originLanguage = Browser.inputBox("Introduce el idioma de origen en codigo ISO", 
                                        Browser.Buttons.OK_CANCEL);
  var destinyLanguage = Browser.inputBox("Introduce el idioma de destino en codigo ISO" , 
                                        Browser.Buttons.OK_CANCEL);
    
  var sheetNameS = 'Traducción para ' + destinyLanguage ;
  var translationsSheet = spreadsheet.getSheetByName(sheetNameS);

  if (translationsSheet) {
    translationsSheet.clear();
    translationsSheet.activate();
  } else {
    translationsSheet =
        spreadsheet.insertSheet(sheetNameS, spreadsheet.getNumSheets());
  }
  
  var i, j = 0;
  var dataRangeOriginal = originalSheet.getDataRange();
  var dataRangeOriginalValues = dataRangeOriginal.getValues();
    
  for (i = 0; i < dataRangeOriginalValues.length; i++){

    var line;        
    line = dataRangeOriginalValues[i].join('');
        
    var comment = isAComment(line); 
    
    if (line && !comment) {
      comment = isAComment(line); 
    
      var parts = segment(line);
      var leftPart = parts[0];
        
      var textforTranslation = parts[1];
      Logger.log("el texto limpio para traducir (textforTranslation) es "+ textforTranslation);
                  console.log("el texto limpio para traducir (textforTranslation) es "+ textforTranslation);

    
      spreadsheet.getRange('A' + (i+1)).setValue(
        leftPart + ' = ' + '"' +  LanguageApp.translate(textforTranslation, originLanguage, destinyLanguage) + '"'
      );
      Utilities.sleep(1000); 
    }
            
    else {
      spreadsheet.getRange('A' + (i+1)).setValue(line).setBackground('#ddddee');
      }
  }
  
}

function isAComment(line){
  var commentFound = true;
  if(line.includes("=")){
    commentFound = false;
  }
  return commentFound;
}

function segment(lineText){
  var key, value, textToClean, examined;
  for (i = 0; i < lineText.length; ++i){
    examined = lineText[i];
    if (lineText[i] == '='){
      key = lineText.slice(0, i-1);
      Logger.log("parte izquierda sin incluir el igual es " + key);
      textToClean = lineText.slice(i+1);
      Logger.log("parte derecha sin incluir el igual es " + textToClean);
      for (j=0; j<textToClean.length;++j){
        if(textToClean[j] == '"'){
          value = textToClean.slice(j+1, textToClean.length-2);
          j=textToClean.length;;
        }
      }
    }
  }  
Logger.log("key " + key);
Logger.log("value " + value);

return [key, value];
}
