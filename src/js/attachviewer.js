/*attachviewer*/
class AttachViewer {
	close (){
		this.container.classList.remove('active')
	}
	open (i) {
		console.log(i)
		this.container.classList.add('active');
		if(this.container.querySelector('.active')){this.container.querySelector('.active').classList.remove('active');}
		let el = this.container.querySelectorAll('.attachviewer-item')[i];
		if(el){
			el.classList.add('active');
			if(!el.dataset.loaded){
				const OFFICE = ['PPT','PPTX','DOC','DOCX', 'XLS', 'XLSX'];
				const GOOGLE = ['WebM','MPEG4','3GPP','MOV','AVI','MPEGPS','WMV','FLV','TXT','CSS','HTML','PHP','C','CPP','H','HPP','JS','DOC','DOCX','XLS','XLSX','PPT','PPTX','PDF','PAGES','AI','PSD','TIFF','DXF','EPS','PS','TTF','XPS','ZIP','RAR'];
				const IMAGES = ['JPEG','JPG','PNG','GIF','TIFF','BMP','SVG'];
				let re = /(?:\.([^.]+))?$/;
				let ext = re.exec(el.dataset.url)[1];   // extention
				let xx = crEl('span','X3_'+ext);
				let maxHeight = window.innerHeight-96+"px";
				let maxWidth = window.innerWidth-96+"px";
				
				if(ext){
					if(IMAGES.indexOf(ext.toUpperCase())>=0){
						xx = crEl('img',{src:el.dataset.url})
						xx.style.maxWidth =maxWidth;
						xx.style.maxHeight = maxHeight;
					} else if(OFFICE.indexOf(ext.toUpperCase())>=0){
						xx = crEl('iframe',{src:'https://view.officeapps.live.com/op/embed.aspx?src=' + el.dataset.url, frameborder:0})
						xx.style.height = maxHeight;
						xx.style.width = maxWidth;
						
					} else if(GOOGLE.indexOf(ext.toUpperCase())>=0){
						xx = crEl('iframe',{src:'https://docs.google.com/a/' + this.domain + '/viewer?url=' + el.dataset.url + '&embedded=false'})
					} else {
					
					}
					
					//
				}
				
				el.appendChild(xx)
				el.dataset.loaded = true;
			}
		}
		//this.container.appendChild(new Item(item));
		this.container.dataset.index = i;
		
	}
	next(){
		let i = +this.container.dataset.index;
		let l = +this.container.dataset.length
		if(i>=l-1){i = -1;}
		this.open(i+1)
	}
	prev(){
		let i = +this.container.dataset.index;
		let l = +this.container.dataset.length;
		if(i<=0){i = l;} 
		this.open(i-1)
	}
	
	constructor (elements) {
	
		let th = this;
		this.domain = 'my-pm.ru'
		function Item (item, index){
			return crEl('div',{c:'attachviewer-item', d:{url:item.href}}, 
				crEl('div',{c:'attachviewer-toolbar'},
				crEl('button',{c:'attachviewer-close', e:{click:function(){th.close()}}},'×'),
				crEl('div', {c:'attachviewer-subtoolbar'}, crEl('a',{target:'_blank', href:item.href, e:{click:()=>{th.close()}}},'⇓')),
				item.dataset.name || item.innerHTML)
			)
		}
		
		this.container = crEl('div', {c:'attachviewer'})
		if(elements && elements.length){
		this.container.dataset.length = elements.length
			elements.forEach((k,i)=>{
				k.addEventListener('click', event=>{
					event.preventDefault();
					th.open(i);
					return false;
				})
				
				this.container.appendChild( new Item(k,i) )
				
			})
			if(elements.length>1){
			this.container.appendChild(crEl('button',{c:'attachviewer-prev',e:{click:function(){th.prev()}}},'〈'));
			this.container.appendChild(crEl('button',{c:'attachviewer-next',e:{click:function(){th.next()}}},'〉'));
			}
		}
		
		document.body.appendChild(this.container);
		window.addEventListener('keydown',function(event){
			if(th.container.classList.contains('active')){
			if(event.keyCode===27){ //escape
				th.close()
			}			
			if(event.keyCode===37){ //<-
				th.prev()
			}			
			if(event.keyCode===39){ //->
				th.next()
			}
			//console.log(event.keyCode)
			}
		})
		this.container.focus()
		return this;
	}
}