const add_btn = document.getElementById('add_button');
const del_btn = document.getElementById('del_button');
const note_list = document.getElementById('note_list');
const field = document.getElementById('field')
let notes_arr = [];


class Note {
	constructor(id, name, text, selected, time)
	{
		this.id = id;
		this.name = name;
		this.text = text;
		this.selected = selected;
		this.time = time;
	}
};

add_btn.onclick = function() {

	field.value = '';
	let new_li  = document.createElement('li');
    new_li.className = 'li_note';
    new_li.id = Date.now();
    new_li.setAttribute('select', true);

    let note_obj = new Note (new_li.id, 'New note!!!', '', true, new_li.id);
    notes_arr.push(note_obj);

    new_li.innerHTML = note_obj.name + '<br />' + getDate(note_obj.id);
    note_list.prepend(new_li);
   	unselect_notes(new_li.id);

   	field.readOnly = false;
   	field.focus();
   	window.location.hash = new_li.id + '/' + note_obj.name;
	window.localStorage.setItem('notepad', JSON.stringify(notes_arr));
}

function getDate(id) { 
	let full_date = new Date (parseInt(id)); 
	let date = String(full_date.getDate()); 
	if(date.length < 2) 
		date = '0' + date;
	let month = full_date.toLocaleString('en', {month: 'long'});
	let year = String(full_date.getFullYear());
	let time = full_date.toLocaleTimeString();

	let res = date + " " + month + " " + year + " " + time;
	return res;
}

function unselect_notes(cur_id)
{
	for(let i=0; i<notes_arr.length; i++)
	{
		if(notes_arr[i].id !== cur_id)
		{
			notes_arr[i].selected = false;
			let li = document.getElementById(notes_arr[i].id);
			li.setAttribute('select', false);
		}
	}
}

del_btn.onclick = function () {

	if(notes_arr.length === 0)
		return;

	let pos = 0;
	let flag = false;
	for(let i=0; i < notes_arr.length; i++)	{
		if(notes_arr[i].selected === true){
			pos = i;
		    flag = true;
		}
	}

	if(flag === true) {
	let del_li = document.getElementById(notes_arr[pos].id);
	note_list.removeChild(del_li);
	notes_arr.splice(pos, 1);

	field.value = '';
	field.readOnly = true;
	window.location.hash = '';
	}
	window.localStorage.setItem('notepad', JSON.stringify(notes_arr));
}

note_list.onclick = function (ev) {

	if(ev.target.tagName === 'LI') {
		const sel_li = document.getElementById(ev.target.id);

		for(let i = 0; i < notes_arr.length; i++)
		{
			if(notes_arr[i].id === sel_li.id) {
				notes_arr[i].selected = true;
				sel_li.setAttribute('select', true);
				field.value = notes_arr[i].text;
				field.readOnly = false;
				field.focus();
				window.location.hash = notes_arr[i].id + '/' + notes_arr[i].name;	
			}
			else {
				if(notes_arr[i].selected = true) {
					notes_arr[i].selected = false;
					let unsel_li = document.getElementById(notes_arr[i].id);
					unsel_li.setAttribute('select', false);
				}
			}
		}
	}
} 


field.oninput = function() {
	for(let i=0; i < notes_arr.length; i++) {
		if(notes_arr[i].selected === true)
		{
			notes_arr[i].text = field.value;
			notes_arr[i].name = notes_arr[i].text.split('\n')[0].substring(0, 15);
			notes_arr[i].time = Date.now();

			let sel_li = document.getElementById(notes_arr[i].id);
			sel_li.innerHTML = new_name(notes_arr[i].name) + '<br />' + getDate(notes_arr[i].time);
			window.location.hash = sel_li.id + '/' + notes_arr[i].name;
		}
	}
	window.localStorage.setItem('notepad', JSON.stringify(notes_arr)); 
}

function new_name(name){
	
	let result ='';
	for(let i=0; i < name.length; i++)
	{
		switch (name[i]) {
			case '<': result+='&lt;';
			break;
			case '>': result+='&gt;';
			break;
			case '&': result+='&amp;';
			break;
			default: result+=name[i];
		}
	}
	return result;
}


window.onbeforeunload = function() {
	window.localStorage.setItem('notepad', JSON.stringify(notes_arr));
}

window.onload = function() {
	field.value = '';
	const temp_arr = window.localStorage.getItem('notepad');

	if(temp_arr !== '[]' && temp_arr!== null)
	{
		notes_arr = JSON.parse(temp_arr);
		for(let i=0; i < notes_arr.length; i++)
		{
			let new_li  = document.createElement('li');
            new_li.className = 'li_note';
            new_li.id = notes_arr[i].id;
            new_li.setAttribute('select', notes_arr[i].selected);

            new_li.innerHTML = new_name(notes_arr[i].name) + '<br />' + getDate(notes_arr[i].time);
            note_list.prepend(new_li);
         	if(notes_arr[i].selected === true)
         		{
         			field.value = notes_arr[i].text;
         			field.readOnly = false;
         			field.focus();
         			window.location.hash = new_li.id + '/' + notes_arr[i].name;
         		}
		}
	}
}

window.onhashchange = function() {
	field.value = '';
	field.readOnly = true;
	for(let i=0; i < notes_arr.length; i++)
	{
		notes_arr[i].selected = false;
		let unsel_li = document.getElementById(notes_arr[i].id);
		unsel_li.setAttribute('select', false);
	}

	let new_hash = window.location.hash;
	let new_id = new_hash.slice(1, new_hash.indexOf('/'));
	let new_li = document.getElementById(new_id);

	if(new_li)
	{
		new_li.setAttribute('select', true);
		for(let i=0; i < notes_arr.length; i++)
		{
			if(notes_arr[i].id === new_id)
			{
				notes_arr[i].selected = true;
				field.value = notes_arr[i].text;
				field.readOnly = false;
				field.focus();
			}
		
		}
	}
	
}