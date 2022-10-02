var inputs = document.querySelectorAll('.converter input');
var imgs = document.querySelectorAll('.icon img');
var spans = document.querySelectorAll('span.symbol');
var nums = document.querySelectorAll('.num');
var searchModal = document.querySelector('.search');
var countryList = document.querySelector('.countries-list');
var searchBar = document.querySelector('input[name="search-country"]');
var focusedInput = inputs[1];
var finalInput = inputs[0];

var searchFor = 'quote';

var base = {
    "code": "/m/09nqf",
    "name": "United States Dollar",
    "price": "1",
    "details": {
        "code": "USD",
        "name": "United States Dollar",
        "symbol": "$"
    },
    "flag": "https://flagcdn.com/us.svg",
    "country": "American Samoa"
};

var quote = {
    "code": "/m/018cg3",
    "name": "Nigerian Naira",
    "price": "432.37",
    "details": {
        "code": "NGN",
        "name": "Nigerian naira",
        "symbol": "₦"
    },
    "flag": "https://flagcdn.com/ng.svg",
    "country": "Nigeria"
};

imgs.forEach(img => {
    img.addEventListener('click', () => {
        searchFor = img.dataset.flagFor;
        searchModal.style.display = "block";
        searchBar.value = "";
        searchBar.focus();
        showCurrencies(currencies,true);
    })
})

function switchFlag(){
    imgs.forEach(img => {
        if(img.dataset.flagFor == "base"){
            return img.src = base.flag;
        }
    
        return img.src = quote.flag;
    });

    spans.forEach(span => {
        if(span.dataset.flagFor == "base"){
            return span.innerHTML = base?.details?.symbol;
        }
        
        return span.innerHTML = quote?.details?.symbol;
    });
}

switchFlag();

function calculate(){
    focusedInput.value = focusedInput.value.replace(/\,|^0(?=(\d))/g, '');
    
    let input = focusedInput.value;
    let output = finalInput.value.replace(/\,/g, '');

    if(focusedInput.value === "") focusedInput.value = 0;
    if(focusedInput.value === ".") focusedInput.value = "0.";
    
    if(focusedInput.value.match(/\./g)?.length > 1) {
        focusedInput.value = focusedInput.value.substring(0, focusedInput.value.length-1);

        input = focusedInput.value;
    }

    if(focusedInput.name === "base"){
        output = Number(input) * (quote.price) / (base.price);
    }
    
    if(focusedInput.name === "quote"){
        output = Number(input) / (quote.price) * (base.price);
    }

    output = Number(Number(output).toFixed(5));

    let split = focusedInput.value.split('.');


    if(split.length > 1){
        focusedInput.value = Number(split[0]).toLocaleString();
        focusedInput.value += `.${split[1]}`;
    } else {
        focusedInput.value = Number(split[0]).toLocaleString();
    }

    // focusedInput.value = Number(input).toLocaleString();
    finalInput.value = isNaN(Number(output)) ? 0 : output.toLocaleString();
    
}

function updateInput(num){
    if(focusedInput.value == "0" && num != 10) {
        focusedInput.value = "";
    }
    
    if(num == 10) num = ".";
    if(num == 11) num = "0";
    
    if(num == 12) { 
        num = focusedInput.value.substring(0, focusedInput.value.length-1);
        focusedInput.value = "";
    }

    focusedInput.value += num;

    if(focusedInput.value == "") {
        focusedInput.value = "0";
        finalInput.value = "0";
    }

    calculate();
}

function sortCurrenciesList(a, b){
    let fa = a.details?.code.toLowerCase(),
        fb = b.details?.code.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
}

Array.from(nums).forEach((num, index) => 
    num.addEventListener('click', (e) => {
        const div = document.createElement('DIV');
        div.classList.add('show-click');
        div.style.animationName = "click";
        e.target.appendChild(div);
        div.onanimationend = () => e.target.removeChild(div);
        
        updateInput(index+1)
    })
);

Array.from(inputs).forEach(input => {
    input.addEventListener('focus', () => {
        focusedInput = input;
        
        if(inputs[0] === input){ 
            return finalInput = inputs[1];
        } 
        
        return finalInput = inputs[0];
    });

    input.addEventListener('input', (e) => calculate());

});


function chooseCurrency(code){
    let currency = currencies.filter(c => c.code.toLowerCase() === code.toLowerCase());
    if(searchFor === "base"){
        base = currency[0];
    } else { 
        quote = currency[0];
    }

    searchModal.style.display = "none";
    switchFlag();
    calculate();
}

searchBar.addEventListener('input', (e) => {
    let currencyFiltered = currencies.filter(c => {
        let value = new RegExp(e.target.value.toLowerCase());
        
        return value.test(c?.country?.toLowerCase()) || value.test(c?.name?.toLowerCase()) || value.test(c?.details?.code?.toLowerCase()) || value.test(c?.details?.name?.toLowerCase());
    });

    showCurrencies(currencyFiltered, true);
})

function showCurrencies(currenciesList = currencies, emptyFirst = false){
    if(emptyFirst){
        countryList.innerHTML = "";
    }
    
    currenciesList.sort(sortCurrenciesList).forEach(({code, flag, details, country}) => {
        const outterDiv = document.createElement('DIV');
        const innerDiv = document.createElement('DIV');
        const img = document.createElement('IMG');
        const p1 = document.createElement('P');
        const p2 = document.createElement('P');

        img.classList.add('icon');
        img.src = flag;
        img.loading = "lazy";

        p1.classList.add('title');
        p1.innerHTML = `${details?.code} &nbsp;&nbsp;-&nbsp;&nbsp; ${details?.symbol}`;

        p2.classList.add('subtitle');
        p2.innerHTML = country;

        innerDiv.appendChild(p1);
        innerDiv.appendChild(p2);

        outterDiv.appendChild(img);
        outterDiv.appendChild(innerDiv);
        outterDiv.classList.add('flex');
        outterDiv.addEventListener('click',(e) => {
            chooseCurrency(code)
        })

        countryList.appendChild(outterDiv);
    })
}

showCurrencies();



// "".match(/(?!">)[\w\s]*(?=<\/option>)/g)
// "".match(/(?!")\/m\/[\w]+(?=">)/g)