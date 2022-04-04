var dictionaryapi_dev={
	init:function(){
		Array.prototype.map.call(document.querySelectorAll('.dictionaryapi'),function(e){
			input=document.createElement('input');
			input.placeholder='dictionary';
			input.addEventListener('keydown',function(e){
				if(e.key=='Enter'){
					dictionaryapi_dev.lookup(e);
				}
			});
			e.appendChild(input);
			submit=document.createElement('button');
			submit.innerHTML='Lookup';
			submit.title='Lookup word on dictionaryapi.dev';
			submit.addEventListener('click',dictionaryapi_dev.lookup);
			e.appendChild(submit);
			clear=document.createElement('button');
			clear.innerHTML='Clear';
			clear.title='Clear previous results';
			clear.addEventListener('click',dictionaryapi_dev.clear);
			e.appendChild(clear);
		});
	},
	clear:function(e){
		if(e.target){
			e=e.target;
		}
		Array.prototype.map.call(e.parentNode.querySelectorAll('dl'),function(e){
			e.remove();
		});
	},
	lookup:function(e){
		input=e.target;
		if(e.target.previousElementSibling){
			input=e.target.previousElementSibling;
		}
		if(input.value){
			value=input.value.toLowerCase().trim();
			if(value.match(/\s/)){
				alert('Error: Please enter a single word to look up.');
				return;
			}
			if(value.match(/[0-9]/)){
				alert('Error: Alphanumeric values are not supported.');
				return;
			}
			if(!dictionaryapi_dev.ajax){
				if(window.XMLHttpRequest){
					dictionaryapi_dev.ajax=new XMLHttpRequest();
				}else{
					dictionaryapi_dev.ajax=new ActiveXObject('Microsoft.XMLHTTP');
				}
			}
			dictionaryapi_dev.ajax.target=input;
			dictionaryapi_dev.ajax.open('GET','https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(value));
			dictionaryapi_dev.ajax.onreadystatechange=function(){
				if(dictionaryapi_dev.ajax.readyState>3){
					input=dictionaryapi_dev.ajax.target;
					switch(dictionaryapi_dev.ajax.status){
						case 200:
							try{
								json=JSON.parse(this.responseText.trim());
								dl=document.createElement('dl');
								json.forEach((result)=>{
									if(result.word){
										if(result.meanings){
											result.meanings.forEach((meaning)=>{
												if(meaning.partOfSpeech){
													dt=document.createElement('dt');
													dt.innerHTML=result.word+' ('+meaning.partOfSpeech+')';
													dl.appendChild(dt);
													meaning.definitions.forEach((definition)=>{
														dd=document.createElement('dd');
														dd.innerHTML=definition.definition.trim();
														dl.appendChild(dd);
													});
												}
											});
										}
									}
								});
								input.parentNode.insertBefore(dl,input.nextElementSibling.nextElementSibling.nextElementSibling)
							}catch(e){
								alert('Error: Unable to parse dictionaryapi.dev');
							}
						break;
						case 404:
							alert('Error: The word "'+input.value+'" was not found.');
						break;
						default:
							alert('Error: Unhandled HTML error #'+dictionaryapi_dev.ajax.status)
						break;
					}
					input.value='';
					input.disabled=false;
					input.focus();
					input.nextElementSibling.disabled=false;
					input.nextElementSibling.innerHTML='Lookup';
				}
			};
			input.disabled=true;
			input.nextElementSibling.disabled=true;
			input.nextElementSibling.innerHTML='Busy...';
			dictionaryapi_dev.ajax.send();
		}
	}
}
window.addEventListener('load',function(){
	dictionaryapi_dev.init();
},false);