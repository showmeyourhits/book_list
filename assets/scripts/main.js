(function () {
	// IIFE to fill YEAR select
	let year_start = 1900,
		year_end = (new Date()).getFullYear(),
		option_cont = document.createDocumentFragment(),
		option = document.createElement("option");
	
	for(let year = year_end; year >= year_start; year--){
		option.innerText = year;
		option_cont.appendChild(option);
		option = option.cloneNode();
	}

	document.getElementById("publ-year").appendChild(option_cont);
})();

var BL = (function(){

	function getBookList(){
		let bl = localStorage.getItem("bookList");
		if(!bl){
			console.log("list empty")
		}
		return bl === null ? [] : JSON.parse(bl);
	}

	function updateStorage(){
		localStorage.setItem("bookList", JSON.stringify(bookList.filter((item)=>{return !!item})));
	}

	function addBookToView(book, index){
		document.getElementById("list-body").appendChild(makeListEntry(book, index));
	}

	function addBookToList(){
		let _year = document.getElementById("publ-year").value,
			_pages = parseInt(document.getElementById("qnt-pages").value);

		let book = {
			author: document.getElementById("author").value,
			title: document.getElementById("book-title").value,
			year: _year ===  "Year" ? 0 : _year,
			pages: (_pages !== _pages || _pages < 0) ? 0 : _pages,
			readed: false 
		};

		
		addBookToView(book, bookList.length);
		bookList.push(book);
	}

	function makeListEntry(book, index){
		let tr = trTemplate.cloneNode(true);
		tr.classList.remove("tr-template");
		tr.dataset.index = index;
		tr.children[0].children[0].checked = book.readed;
		tr.children[1].innerText = book.year || "-";
		tr.children[2].innerText = book.author;
		tr.children[3].innerText = book.title;
		tr.children[4].innerText = book.pages || "-";

		return tr;
	}

	function fillList(){
		let bookCont = document.createDocumentFragment();

		for(let i = 0; i < bookList.length; i++){
			bookCont.appendChild(makeListEntry(bookList[i], i));
		}

		document.getElementById("list-body").appendChild(bookCont);		

		return bookList.length;
	}

	function toggleMessage(){
		let mess = document.getElementById("message"),
			list = document.getElementById("book-list");
		return function(){
			console.log(bookList);
			if(bookList.filter((el)=>{return !!el}).length){
				mess.style.display = "none";
				list.style.visibility = "visible";
			}else{
				mess.style.display = "block";
				list.style.visibility = "hidden";
			}
		}
	}

	function takeAction(element, action){
		let tr = element.parentElement.parentElement,
			index = tr.dataset.index;

		switch(action) {
			case "delete":
				bookList[index] = null;
				console.log("Tbody children :", tr.parentElement.children.length);
				if(tr.parentElement.children.length <= 2){
					BL.toggleMessage();
				}
				tr.remove();
				console.log(`Deleted ${index}`);
				break;
			
			case "edit":

				break;

			case "read":
				bookList[index].readed = element.checked;
				break;

			default:
				throw "oi mate wat are doin here?";
		}
	}
	

	let bookList = getBookList(),
		trTemplate = document.querySelector(".tr-template");

	return {
		updateStorage: updateStorage,
		addBookToList: addBookToList,
		fillList: fillList,
		toggleMessage: toggleMessage(),
		takeAction: takeAction
	};
})();

document.getElementById("add-form").addEventListener("submit", function(event){
	event.preventDefault();
	
	BL.addBookToList();
	BL.toggleMessage();
}, false)

document.getElementById("book-list").addEventListener("click", function(event){
	let btn = event.target.nodeName === "I" ? event.target.parentElement : event.target;
		action = btn.dataset.action;

	if(action){
		BL.takeAction(btn, action);
	}
}, false)
window.addEventListener("unload",function(e){
	// TODO: clean mess after deleting
	BL.updateStorage();
	//localStorage.removeItem("bookList");
}, false);

BL.toggleMessage();
BL.fillList();
