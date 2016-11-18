(function () {
	let year_start = 1900,
		year_end = (new Date()).getFullYear(),
		option_cont = document.createDocumentFragment(),
		option = document.createElement("option");
	
	for(let year = year_end; year >= year_start; year--){
		option.innerText = year;
		option_cont.appendChild(option);
		option = option.cloneNode();
	}

	document.getElementById("publ_year").appendChild(option_cont);
})();