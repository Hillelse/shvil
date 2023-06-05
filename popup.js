let display = document.getElementById("display");
let firstRow = document.getElementById("firstRow");
let lastRow = document.getElementById("lastRow");

let lsfr = localStorage.getItem("ShvilFirstRow");
let lslr = localStorage.getItem("ShvilLastRow");

if (lsfr != undefined) {
	firstRow.value = lsfr;
}

document.getElementById("btn").addEventListener("click", async function (e) {
	localStorage.setItem("ShvilFirstRow", firstRow.value);
	
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);

  chrome.tabs.sendMessage(
    tabs[0].id,
    { firstRow: firstRow.value,
		lastRow: lastRow.value
	},
    function (response) {
        if (response && response.issues && response.issues.length > 0) {
			let output = '';
			response.issues.forEach((currentValue, index, arr) => {
				output += currentValue + '\n';
			});
			//display.innerHTML = 'copied '+ response.issues.length +' issues to clipboard';
			//navigator.clipboard.writeText(output);
			copyToClipboard(output);
			M.toast({html: 'copied '+ response.issues.length +' issues to clipboard', classes:'rounded'});
		}
    }
  );
});

async function copyToClipboard(msg) {
	console.log(msg);
  try {
    await window.navigator.clipboard.writeText(msg);
    console.log('copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}