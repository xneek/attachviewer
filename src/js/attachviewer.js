/*attachviewer*/
class AttachViewer {
	close (){
		this.container.classList.remove('active')
	}
	open (i) {
		let th = this;
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
				
				let maxWidth = window.innerWidth-96+"px";
				let maxHeight = window.innerHeight-96+"px";
				
				
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
						xx = crEl('iframe',{src:'//docs.google.com/a/' + th.opts.domain + '/viewer?url=' + el.dataset.url + '&embedded=true'})
						xx.style.height = maxHeight;
						xx.style.width = maxWidth;
					} else {
						let url = '#';
						if(el.dataset.downloadUrl && el.dataset.downloadUrl.length){
							url = el.dataset.downloadUrl;
						} else if(el.dataset.url && el.dataset.url.length){
							url = el.dataset.url;
						} else {
							url = url.href;
						}
						console.log(url,el)
						if(th.opts.unknownPreview==false){ location.href = url; return false;}
						xx = crEl('div', {c:'attachviewer-unknown'},
							crEl('h3',th.opts.unknownTitle),
							crEl('a',{href:url, target:'_blank', e:{click:()=>th.close()}},th.opts.unknownCaption)
						)
						
						
					}
					
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
	
	constructor (elements, opts={}) {
		this.opts = Object.assign({
			name:'attachviewer',
			domain:'localhost',
			showPrevNext:true, 
			prev:'〈',
			next:'〉', 
			close: '╳',
			download:'⇓',show:'⤢',
			closeOnShow:true,
			closeOnDownload:true,
			unknownPreview: true,
			unknownCaption:'Скачать файл',
			unknownTitle:'Предварительный просмотр недоступен'
			
		},opts);
		let th = this;
	
		function Item (item, index){
			let toolbar = crEl('div', {c:'attachviewer-subtoolbar'});
			if(item.dataset){
				if(item.dataset.downloadUrl && item.dataset.downloadUrl.length){
					toolbar.appendChild(crEl('a',{target: item.dataset.target || '_blank', href:item.dataset.downloadUrl, e:{click:()=>{if(th.opts.closeOnDownload){th.close()}}}},th.opts.download))
				}
	
				if(item.dataset.showUrl && item.dataset.showUrl.length){
					toolbar.appendChild(crEl('a',{target: item.dataset.target || '_blank', href:item.dataset.showUrl, e:{click:()=>{if(th.opts.closeOnShow)th.close()}}},th.opts.show))
				}
				
			}
			return crEl('div',{c:'attachviewer-item', d:{url:item.href}}, 
				crEl('div',{c:'attachviewer-toolbar'},
				crEl('button',{c:'attachviewer-close', e:{click:function(){th.close()}}},th.opts.close),
					toolbar,
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
			if( this.opts.showPrevNext && elements.length>1 ){
				this.container.appendChild(crEl('button',{c:'attachviewer-prev',e:{click:function(){th.prev()}}},this.opts.prev));
				this.container.appendChild(crEl('button',{c:'attachviewer-next',e:{click:function(){th.next()}}},this.opts.next));
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