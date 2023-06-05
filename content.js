const ke = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, keyCode: 13});
const getCellValue = (row, col) => {
	let cellLocation = document.getElementById("t-name-box");
	let strLoc = col+row;
	cellLocation.value=strLoc;
	cellLocation.dispatchEvent(ke);
	let inputBar=document.getElementById('t-formula-bar-input').children[0];
	let value = inputBar.innerHTML.slice(0,inputBar.innerHTML.length-4);
	value = value.replace(/<br>/gm, ' ');
	value = value.replace(/&nbsp;/gm, ' ');
	return value;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	let fRow = parseInt(request.firstRow);
	let lRow = parseInt(request.lastRow);
	
	if(request.operation === "reload") {
		location.reload();
	} else if (fRow > 1 && lRow > fRow ) {
		let issues = [];
		let maxAttempts = 4;
		let output = '';
	
		for (let row = request.firstRow; row <= request.lastRow; row++) {
			let cellValue = getCellValue(row, 'O');
			let currAttempt = 0;
			while (cellValue === '-' && currAttempt < maxAttempts) {
				sleep(25);
				cellValue = getCellValue(row, 'O');
				currAttempt++;
			}
			if (cellValue === 'לא') {
				let newIssue = issues.length+1 + ') ' + 
					getCellValue(row, 'B') + ' '+
					getCellValue(row, 'D') + ' '+
					getCellValue(row, 'E') + '\n'+
					getCellValue(row, 'H') + '\n';
				
				issues = [...issues, newIssue];
				output += newIssue + '\n';
			}
		}
		
		sendResponse({issues});
    } else {
		sendResponse({operation: 'failed'});
	}
  });
