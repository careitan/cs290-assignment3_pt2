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

    var Favorites = new Array(0);
    localStorage.setItem('Favorites', Favorites);
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

function ajaxRequestGists(Type, NumPages) {
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
} else if (NumPages < 1 || NumPages > 5) {
  RetVal.success = false;
  RetVal.code = 1;
  RetVal.codeDetail = 'Parameter Error - Number of Pages out of range.';
  blnSuccess = false;
} else if (Type === 'GET') {
  req.open('GET', URL + '?page=' + NumPages, false);
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
  var DivSet;
  var ElementSet;
  var Pages = 0;
  
  DivSet = document.getElementsByClassName('PageNum');
  if (DivSet) {
    Pages = DivSet[0].value;
  }

  // Fetch each page of Gists
  for (var i = 1; i <= Pages; i++) {
    var Return = ajaxRequestGists('GET', i);
    if (Return.success) {
      localStorage.setItem('GistOBJ' + i, Return.response);
    } else {
      var OutErr = document.getElementById('output');
      OutErr.innerHTML = 'AJAX Call FAILED.<br>';
      OutErr.innerHTML += 'ERROR CODE: ' + Return.code + '<br>';
      OutErr.innerHTML += 'ERROR CODE Details: ' + Return.codeDetail + '<br>';
    }
  }

  // Process the Checkboxes
  DivSet = document.getElementsByClassName('LangChx');
  if (DivSet.item(0).hasChildNodes()) {
    //ElementSet = DivSet.item(0).childNodes;

    for (var i = 0; i < 4; i++) {
      if (DivSet.item(i).nodeName === 'INPUT') {
        localStorage.removeItem(DivSet.item(i).attributes['name'].value);
        localStorage.setItem(DivSet.item(i).attributes['name'].value,
          DivSet.item(i).checked);
      }
    }
  }

  GetFavorites();
  DisplayGists(Pages);
}

function DisplayGists(PageNum) {
  var OBJ;
  var OutHTML = '<table id="DisplayList" class="DisplayTable"><thead><th>Favorite</th><th>Description</th><th>Language</th></thead>';
  var isMatched = false;
  var DivSet;
  var ElementSet;
  var OBJLanguage;

  // Process the Checkboxes
  DivSet = document.getElementsByClassName('LangChx');
  if (DivSet.item(0).hasChildNodes()) {
    ElementSet = DivSet.item(0).childNodes;
  }

  for (var i = 1; i <= PageNum; i++) {

    try {
      OBJ = JSON.parse(localStorage.getItem('GistOBJ' + i));
    } catch (e) {
      return false;
    }

    if (OBJ) {
      for (var k = 0; k < OBJ.length; k++) {
        for (var property in OBJ[k].files) {
          if (OBJ[k].files.hasOwnProperty(property)) {
            if (OBJ[k].files[property].language) {
              OBJLanguage =OBJ[k].files[property].language;
            };
          }
        }
      // Process the filter checkboxes
      isMatched = false;
      for (var c = 0; c < 4; c++) {
        if ((OBJLanguage == DivSet.item(c).name) && DivSet.item(c).checked) {
          isMatched = true;
          break;
        }
      }
      // Look for all the checkboxes unchecked.
      if (!DivSet.item(0).checked && !DivSet.item(1).checked && !DivSet.item(2).checked && !DivSet.item(3).checked 
        && !IsFavorite(OBJ[k].id)) {
        isMatched = true;
    }

    if (isMatched) {
      OutHTML += '<tr><td class="Fav"><input id="' + OBJ[k].id + '" type="button" value="' + OBJ[k].description 
      + '" OnClick="SaveFavorite(this)"></td>';
      OutHTML += '<td><a href="https://api.github.com/gists/' + OBJ[k].id + '" target="_blank">'; 
      OutHTML += OBJ[k].description + '</a></td><td>' + OBJLanguage + '</td>';
      OutHTML += '</tr>';
    }
  }
}
}

OutHTML += '</table>';
  //Add the OuterHTML to the Display.
  DivSet = document.getElementsByClassName('DisplayList');
  DivSet(0).innerHTML = OutHTML;

  return true;
}

function SaveFavorite(Sender) {
  //http://stackoverflow.com/questions/7880257/javascript-push-multidimensional-array
  try {
    var valueToPush = new Array();
    var Favorites;

    valueToPush['GistID'] = Sender.id;
    valueToPush['Description'] = Sender.value;

    // Process the button
    Favorites = localStorage.getItem('Favorites');
    Favorites.push(valueToPush);
    localStorage.setItem('Favorites', Favorites);
  } catch (e) {
    document.getElementById('output').innerHTML =
    'ERROR - Unable to Save Favorites: ' + e.message;
  }
}

function RemoveFavorite(GistID) {
  //http://solidlystated.com/scripting/javascript-delete-from-array/
  try
  {
    var Favorites;

    // Process the button
    Favorites = localStorage.getItem('Favorites');

    for (var i = 0; i <= Favorites.length; i++) {
      if (Favorites[i].GistID == GistID) {
        Favorites.splice(i,1);
      }
    };

    localStorage.setItem('Favorites', Favorites);
  } catch (e) {
    document.getElementById('output').innerHTML =
    'ERROR - Unable to Delete Favorites: ' + e.message;
  }
}

function GetFavorites() {
  try {
    var OutHTML;
    var Favorites;
    Favorites = localStorage.getItem('Favorites');

    if (Favorites === "") {
      return;
    } else {
     OutHTML = '<table id="FavoritesList" class="FavoritesTable">';
     OutHTML += '<thead><th>Remove</th><th>Description</th></thead>';

     for (var i = 0; i <= Favorites.length; i++) {
      OutHTML += '<tr><td><input type="button" OnClick="RemoveFavorite(' + Favorites[i].GistID + ')"></td>';
      OutHTML += '<td><a href="https://api.github.com/gists/' + Favorites[i].GistID + '" target="_blank">'; 
      OutHTML += Favorites[i].description + '</a></td></tr>';
    }
    OutHTML += '</table>';

    document.getElementByID('FavoritesList').innerHTML = OutHTML;

  }

} catch (e) {
  document.getElementById('output').innerHTML =
  'ERROR - Unable to Get Favorites: ' + e.message;
}
}

function IsFavorite(GistID) {
  var isMatched = false;
  var Favorites;

  Favorites = localStorage.getItem('Favorites');

  if (Favorites === "") {
    return false;
  };

  for (var i = 0; i <= Favorites.length; i++) {
    if (Favorites[i].GistID == GistID) {
      isMatched = true;
      return isMatched;
    }

    return isMatched;
  }
}