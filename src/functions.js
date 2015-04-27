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

