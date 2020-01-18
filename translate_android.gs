
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
  
  Logger.log("el resultado de dataRangeOriginalValues es " + dataRangeOriginalValues);
  
  for (i = 0; i < dataRangeOriginalValues.length; i++){
        
    var line = dataRangeOriginalValues[i].join('');
        
    var onlyOpenTag = false; 
    
    if (line) {
      onlyOpenTag = isOnlyOpenTag(line);
    
      if (!onlyOpenTag){

        var textforTranslation = extractCleanText(line);
        Logger.log("el texto limpio para traducir es "+ textforTranslation);
    
        if(textforTranslation.slice(0,5) != 'fonts'){
          spreadsheet.getRange('A' + (i+1)).setValue(
            extractLeftTag(line) + LanguageApp.translate(textforTranslation, originLanguage, destinyLanguage) 
          + extractRightTag(line)
          );
          Utilities.sleep(1000);
        } else {
          spreadsheet.getRange('A' + (i+1)).setValue(line);
        }
      } else {
      spreadsheet.getRange('A' + (i+1)).setValue(line).setBackground('#ddddee');

      }
    }
  }
  
}

function isOnlyOpenTag(line){
  var withoutFirstMinor = line.slice(1);
  var diagnostic = true;
  for (i=0; i< withoutFirstMinor.length; i++){
    if (withoutFirstMinor[i] == '<'){
      Logger.log("coincidencia con < en " + withoutFirstMinor[i]);
      diagnostic = false;
    } 
  }
  return diagnostic;
}

function extractCleanText(lineText){
    
  var greaterSignPosition = lineText.indexOf(">");
  
  var cleanTextRight = lineText.slice((greaterSignPosition + 1));
  var minorPosition = cleanTextRight.indexOf('<');
  var cleanText = cleanTextRight.slice(0, minorPosition);
  return cleanText;
}

function extractLeftTag(lineText){
  
  var greaterSignPosition = lineText.indexOf(">");
  var cleanTextLeft = lineText.slice(0, (greaterSignPosition + 1));
  return cleanTextLeft;
}


function extractRightTag(lineText){
  
  var textWithoutFirstGreaterSign = lineText.slice(1); 
  var minorSignPosition = textWithoutFirstGreaterSign.indexOf("<");
  var cleanTextRight = lineText.slice(minorSignPosition + 1);
  return cleanTextRight;

}