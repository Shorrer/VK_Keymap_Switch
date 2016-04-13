// ==UserScript==
// @name        VK-KeymapSwitch
// @namespace   VKKMS_SH
// @description Translating 'ghbftn' to 'привет' and back
// @include     https://vk.com/*
// @include     http://vk.com/*
// @version     1.0
// @grant       none
// @encoding 	UTF-8
// ==/UserScript==

var map = {};
map["q"] = "й"; map["w"] = "ц"; map["e"] = "у"; map["r"] = "к"; map["t"] = "е";
map["y"] = "н"; map["u"] = "г"; map["i"] = "ш"; map["o"] = "щ"; map["p"] = "з"; 
map["["] = "х"; map["]"] = "ъ"; map["a"] = "ф"; map["s"] = "ы"; map["d"] = "в";
map["f"] = "а"; map["g"] = "п"; map["h"] = "р"; map["j"] = "о"; map["k"] = "л";
map["l"] = "д"; map[";"] = "ж"; map["'"] = "э"; map["z"] = "я"; map["x"] = "ч";
map["c"] = "с"; map["v"] = "м"; map["b"] = "и"; map["n"] = "т"; map["m"] = "ь";
map[","] = "б"; map["."] = "ю"; map["/"] = "."; map["Q"] = "Й"; map["W"] = "Ц";
map["E"] = "У"; map["R"] = "К"; map["T"] = "Е"; map["Y"] = "Н"; map["U"] = "Г";
map["I"] = "Ш"; map["O"] = "Щ"; map["P"] = "З"; map["{"] = "Х"; map["}"] = "Ъ";
map["A"] = "Ф"; map["S"] = "Ы"; map["D"] = "В"; map["F"] = "А"; map["G"] = "П";
map["H"] = "Р"; map["J"] = "О"; map["K"] = "Л"; map["L"] = "Д"; map[":"] = "Ж";
map['"'] = "Э"; map["Z"] = "Я"; map["X"] = "Ч"; map["C"] = "С"; map["V"] = "М";
map["B"] = "И"; map["N"] = "Т"; map["M"] = "Ь"; map["<"] = "Б"; map[">"] = "Ю";
map["?"] = ",";

function addButtons() 
{
	messages = document.getElementsByClassName("im_log_date");
	
	for (i = 0; i < messages.length; ++i) {
		if (messages[i].getElementsByClassName("VKKMS_button").length !== 0)
			continue;  // TODO: research about strict comparison
		
		button = document.createElement("a");
		button.className = "VKKMS_button";  // think about better classname
		//button.href = "#";  // with href it will scroll dialogue to the top
		button.innerHTML = "T";
		// we NEED to create new button EVERY TIME, otherwise
		// we'll end up with only one button
		// TODO: better button design
		
		messages[i].appendChild(button);
		messages[i].lastElementChild.addEventListener("click", function(src) {
				keymapSwitch(src.target);
			});
	}
}

function keymapSwitch(src) 
{
	textElement = src.parentNode.previousElementSibling.firstChild.lastChild;
	text = textElement.innerHTML;
	newText = "";  // all because in js strings are immutable
	context = 0;
	
	/* 
	 * context variable used to fix issue with wrong transition of symbols
	 * ',', '.', '?' and '/', which appear in both keymaps. It will remember
	 * the keymap of previous symbol and translate these symbols as if they
	 * have the same keymap. It's assumption, yes. I just think that it will
	 * work in more than 70% of situations, so I used it. Maybe other day
	 * I'll come with 100% solution.
	 */
	
	// EXPLANATION of textElement variable
	/* 
	 * <im_log_body>                           < --- previousElementSibling
	 * ----<wrapper>                           < --- firstChild
	 * --------<im_log_author_chat_name>
	 * --------<im_msg_text>                   < --- lastChild (what we need)
	 * ----</wrapper>
	 * </im_log_body>
	 * <im_log_date>                           < --- parentNode
	 * ----<VKKMS_button>                      < --- this is src
	 * </im_log_date>
	 */
	 
	for (i = 0; i < text.length; ++i) {
		if (text[i] == ' ') {
			newText += ' ';
		} else if (text[i] == ',' || text[i] == '.' 
			|| text[i] == '?' || text[i] == '/') {
			if (context == 1) {
				if (text[i] == map[',']) {
					newText += ',';
				} else if (text[i] == map['.']) {
					newText += '.';
				} else if (text[i] == map['?']) {
					newText += '?';
				} else if (text[i] == map['/']) {
					newText += '/';
				}
			} else {
				newText += map[text[i]];
			}
		} else if (text[i] in map) {
			newText += map[text[i]];
			context = 0;
		} else {
			context = 1;
			keys = Object.keys(map);
			for (j = 0; j < keys.length; ++j) {
				if (text[i] == map[keys[j]]) {
					newText += keys[j];
					break;
				}
			}
		}
	}
	
	textElement.innerHTML = newText;
	
}

document.addEventListener("load", addButtons);
document.addEventListener("click", addButtons);
document.addEventListener("scroll", addButtons);