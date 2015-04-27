window.onload = function() {
  var LSVerf = localStorageExists();
  var OutputBox = document.getElementById('output');

  if (LSVerf !== true && OutputBox !== null) {
    OutputBox.innerHTML = 'Local Storage is not available.';
    OutputBox.currentStyle.backgroundColor = red;
    OutputBox.currentStyle.fill = red;
    OutputBox.style.font.fontcolor = white;
  } else if (OutputBox !== null) {
    OutputBox.innerHTML = '';
  }

};

function localStorageExists() {
  var Sample;
  var OutputBox = document.getElementById('output');

  if (OutputBox !== null) {
    OutputBox.innerHTML = 'Testing LS';
  } else {
    return false;
  }

  try {
    localStorage.setItem('TestLS', OutputBox.innerHTML);
    Sample = localStorage.getItem('TestLS');
  } catch (e) {
    return false;
  }

  if (Sample === 'Testing LS') {
    return true;
  } else {
    return false;
  }
}

function ajaxRequestGists(Type) {
// Populating a null RetVal object.
// https://piazza.com/class/i0j5uszbfur1jw?cid=238
// Student Johnathan Moore
var RetVal = {};
var blnSuccess;
var intCode = 0;
var codeDetailString = '';
var responseString = '';
var URL = 'https://api.github.com/gists';
/*var Param;*/
/*var URLParams = [];*/
var req = new XMLHttpRequest();
if (!req) {
  throw 'Unable to create HTTPRequest';
}

// Set Default value of Success Flag.
blnSuccess = true;

if (Type !== 'GET' && Type !== 'POST') {
  RetVal.success = false;
  RetVal.code = 1;
  RetVal.codeDetail = 'Syntax Error - Populating Type [GET | POST]';
} else if (Type === 'GET') {
  req.open('GET', URL, false);
} else {
// Setting up for POST
req.open('POST', URL, false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
}

if (blnSuccess) {
  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 200) {
        RetVal.success = false;
      } else {
        RetVal.success = true;
      }

      RetVal.code = this.status;
      RetVal.codeDetail = this.statusText;
      RetVal.response = this.responseText;
  //RetVal.response = this.response;
    }
  }
  req.send(null);
  return RetVal;
} else {
  return RetVal;
}
}

function StageGists() {
  var Return = ajaxRequestGists(Get);
  var DivSet;
  var ElementSet;

  if (Return.success) {
    var OBJ = JSON.parse(Return.success);
    localStorage.setItem('GistOBJ', OBJ);

    // Process the Checkboxes
    DivSet = document.getElementsByClassName('LangChx');
    if (DivSet.item(0).hasChildNodes()) {
      ElementSet = DivSet.item(0).childNodes;

      for (var i = 0; i < ElementSet.length; i++) {
        if (ElementSet[i].nodeName === 'INPUT') {
          localStorage.removeItem(ElementSet[i].attributes['name'].value);
          localStorage.setItem(ElementSet[i].attributes['name'].value,
            ElementSet[i].checked);
        }
      }
    }

    DisplayGists();
  } else {
    var OutErr = document.getElementById('output');
    OutErr.innerHTML = 'AJAX Call FAILED.<br>';
    OutErr.innerHTML += 'ERROR CODE: ' + Return.code + '<br>';
    OutErr.innerHTML += 'ERROR CODE Details: ' + Return.codeDetail + '<br>';
  }
}

function DisplayGists() {
  var OBJ;
  var OutHTML = '';

  try {
    OBJ = localStorage.getItem('GistOBJ');
  } catch (e) {
    return false;
  }

  if (OBJ) {
    OutHTML += '<tr><td class="Fav"><input id="chkbx" type="checkbox"><input id="val" type="hidden"></td>';

    OutHTML += '<tr>';
  };

  return true;
}

function SaveFavorites() {
    try {
    var DivSet;
    var ElementSet;
    var Favorites = new Array(0);

    // Process the Checkboxes
    DivSet = document.getElementsByClassName('Fav');

  } catch (e) {
    document.getElementById('output').innerHTML =
    'ERROR - Unable to Save Favorites: ' + e.message;
  }
}

function GetFavorites() {
  try {
  var Favorites;
  } catch (e) {
    document.getElementById('output').innerHTML =
    'ERROR - Unable to Get Favorites: ' + e.message;
  }
}