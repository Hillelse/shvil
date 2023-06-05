let display = document.getElementById("display");
let firstRow = document.getElementById("firstRow");
let lastRow = document.getElementById("lastRow");

let lsfr = localStorage.getItem("ShvilFirstRow");
let lslr = localStorage.getItem("ShvilLastRow");

let issuesStr = '';

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

issuesStr = output;
display.innerHTML = 'find '+response.issues.length + ' issues';

if (document.getElementById("copyPlace").childNodes.length === 0) {
let copyButton = document.createElement("BUTTON");
copyButton.classList.add("waves-effect");
copyButton.classList.add("waves-light");
copyButton.classList.add("btn");
copyButton.textContent = 'copy';
copyButton.onclick = ()=>{
copyToClipboard();
};
document.getElementById("copyPlace").appendChild(copyButton);
}

}
    }
  );
});

async function copyToClipboard() {
  try {
    await window.navigator.clipboard.writeText(issuesStr);
M.toast({html: 'copied', classes:''});
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
