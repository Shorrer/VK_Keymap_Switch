// ==UserScript==
// @name        VK-KeymapSwitch
// @namespace   VKKMS_SH
// @description Translating 'ghbftn' to '������' and back
// @include     https://vk.com/*
// @include     http://vk.com/*
// @version     1.0
// @grant       none
// @encoding 	UTF-8
// ==/UserScript==

var map = {};
map["q"] = "�"; map["w"] = "�"; map["e"] = "�"; map["r"] = "�"; map["t"] = "�";
map["y"] = "�"; map["u"] = "�"; map["i"] = "�"; map["o"] = "�"; map["p"] = "�"; 
map["["] = "�"; map["]"] = "�"; map["a"] = "�"; map["s"] = "�"; map["d"] = "�";
map["f"] = "�"; map["g"] = "�"; map["h"] = "�"; map["j"] = "�"; map["k"] = "�";
map["l"] = "�"; map[";"] = "�"; map["'"] = "�"; map["z"] = "�"; map["x"] = "�";
map["c"] = "�"; map["v"] = "�"; map["b"] = "�"; map["n"] = "�"; map["m"] = "�";
map[","] = "�"; map["."] = "�"; map["/"] = "."; map["Q"] = "�"; map["W"] = "�";
map["E"] = "�"; map["R"] = "�"; map["T"] = "�"; map["Y"] = "�"; map["U"] = "�";
map["I"] = "�"; map["O"] = "�"; map["P"] = "�"; map["{"] = "�"; map["}"] = "�";
map["A"] = "�"; map["S"] = "�"; map["D"] = "�"; map["F"] = "�"; map["G"] = "�";
map["H"] = "�"; map["J"] = "�"; map["K"] = "�"; map["L"] = "�"; map[":"] = "�";
map['"'] = "�"; map["Z"] = "�"; map["X"] = "�"; map["C"] = "�"; map["V"] = "�";
map["B"] = "�"; map["N"] = "�"; map["M"] = "�"; map["<"] = "�"; map[">"] = "�";
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