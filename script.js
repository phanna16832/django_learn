window.onload = function() {
    const rate = 6.2;
    document.getElementById('rate').innerHTML = rate;

    // Add key event listeners for inputs
    document.getElementById('price').addEventListener('keydown', focusNextInput);
    document.getElementById('price1').addEventListener('keydown', focusNextInput);
    document.getElementById('price1').addEventListener('keydown', triggerCalculation);
}

function focusNextInput(event) {
    // If Enter key is pressed, move to the next input or button
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default action of submitting form
        if (event.target.id === 'price') {
            document.getElementById('price1').focus(); // Move focus to the next input
        } else if (event.target.id === 'price1') {
            document.getElementById('btn').focus(); // Move focus to the button
            triggerCalculation(event); // Optionally trigger calculation
        }
    }
}

function triggerCalculation(event) {
    // If Enter key is pressed, trigger the calculation
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default action of submitting form
        cal(); // Trigger the calculation function
    }
}

function cal() {
    var p = document.getElementById('price').value;
    var p1 = document.getElementById('price1').value;
    var r = document.getElementById('rate').innerHTML; // Get the rate as a string
    var r0 = document.getElementById('result');
    var p2 = document.getElementById('price2'); // p2 is a <td>, so use innerHTML, not value
    
    // Convert r to a number
    r = parseFloat(r);
    
    // Check if the input values are numbers
    if (isNaN(p) || isNaN(r) || p === "" || r === "") {
        r0.innerHTML = 'តម្លៃទំនិញបំពេញមិនត្រឹមត្រូវ'; // "Invalid price"
        r0.style.color = '#ff0022'; // Red color for error
    } else {
        const convertprice = (p / r).toFixed(2);
        r0.innerHTML = convertprice;
        r0.style.color = '#09ff00'; // Green color for valid result
        const addiction = (convertprice - p1).toFixed(2);
        p2.innerText = addiction;
    }
}

//copy genral function
function copyText(elementId) {
    var text = document.getElementById(elementId).textContent;
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}
