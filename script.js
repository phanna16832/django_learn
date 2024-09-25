window.onload = function () {
    const rate = 6.2;
    document.getElementById('rate').innerHTML = rate;
    document.getElementById("copyAlert").style.display = "none";

    // Add key event listeners for inputs
    document.getElementById('price').addEventListener('keydown', focusNextInput);
    document.getElementById('price1').addEventListener('keydown', focusNextInput);
    document.getElementById('price1').addEventListener('keydown', triggerCalculation);
}

function focusNextInput(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (event.target.id === 'price') {
            document.getElementById('price1').focus();
        } else if (event.target.id === 'price1') {
            document.getElementById('btn').focus();
            triggerCalculation(event);
        }
    }
}

function triggerCalculation(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        cal();
    }
}

function cal() {
    var p = document.getElementById('price').value;
    var p1 = document.getElementById('price1').value;
    var r = parseFloat(document.getElementById('rate').innerHTML);
    var r0 = document.getElementById('result');
    var p2 = document.getElementById('price2');

    if (isNaN(p) || p === "") {
        r0.innerHTML = 'តម្លៃទំនិញបំពេញមិនត្រឹមត្រូវ';
        r0.style.color = '#ff0022';
    } else {
        const convertprice = (p / r).toFixed(2);
        r0.innerHTML = convertprice;
        r0.style.color = '#09ff00';
        const addiction = (convertprice - p1).toFixed(2);
        p2.innerText = addiction;
    }
}

function clearTextInputs() {
    document.getElementById('price').value = '';
    document.getElementById('price1').value = '';
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
        clearTextInputs();
    }
});

function copyText(elementId) {
    var text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(function () {
        showAlert('អក្សរត្រូវបានចម្លង | 字已复制');
    }).catch(function (error) {
        showAlert('ការចម្លងបរាជ័យ | 复制失败');
    });
}

function showAlert(message) {
    var copyAlert = document.getElementById('copyAlert');
    copyAlert.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${message}`;
    copyAlert.style.display = 'block';
    setTimeout(function () {
        copyAlert.style.display = 'none';
    }, 5000);  // Hide after 5 seconds
}

function cal2() {
    var price = document.getElementById("p").value;
    var rate = document.getElementById("r0").value;
    var resultElement = document.getElementById("r");

    if (isNaN(price) || price==="") {
        resultElement.innerHTML = "តម្លៃបំពេញមិនត្រឹមត្រូវ";
        resultElement.style.color = "#fc0317"
    } else {
        var calc = (price / rate).toFixed(2);
        resultElement.innerText = `សួស្តីបង សរុបហាងទំនិញទាំងអស់ ${price} ចែកនឹង ${rate} = ${calc} ***បញ្ជាក់: ចំពោះទំនិញទិញក្នុងហាងតែមួយ ប្រសិនខាងហាងបំបែកកញ្ចប់ទំនិញ ខាងប្អូននឹងរាប់កញ្ចប់ទំនិញគិតថ្លៃដឹកតាមចំនួនកញ្ចប់ទំនិញដូចគ្នា សំរាប់កញ្ចប់ដែលក្រោម1គីឡូ ខាងប្អូនគិតមួយគីឡូ លើស1គីឡូយក ទំហំនិង ទម្ងង់ប្រៀបធៀបគ្នាមួយណាធំជាងយកមួយនឹងជាគោលគិតថ្លៃដឹកជញ្ចូន`;

    }
}

function sumCal() {
    var n1 = document.getElementById('num').value;
    var n2 = document.getElementById('num1').value;
    var n3 = document.getElementById('num2').value;
    var n4 = document.getElementById('num3').value;
    var total = parseFloat(n1) + parseFloat(n2) + parseFloat(n3) + parseFloat(n4);
    document.getElementById('sum').innerHTML = "តម្លៃសរុបគឺ: $" + total.toFixed(2);
}
