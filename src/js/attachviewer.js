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
			th.title.innerHTML = el.dataset.name
			//console.log(el.dataset)
			if(el.dataset.downloadUrl && el.dataset.downloadUrl.length){
				th.downloadBtn.classList.add('visible');
				th.downloadBtn.target = el.dataset.target || '_blank'
				th.downloadBtn.href =el.dataset.downloadUrl;
				th.downloadBtn.onclick = ()=>{setTimeout(()=>{if(th.opts.closeOnDownload){th.close()}},500)}

			} else {th.downloadBtn.classList.remove('visible')}
			if(el.dataset.showUrl && el.dataset.showUrl.length){
				th.showBtn.classList.add('visible')
				th.showBtn.target = el.dataset.target || '_blank';
				th.showBtn.href = el.dataset.showUrl;
			th.showBtn.onclick = ()=>{setTimeout(()=>{if(th.opts.closeOnShow)th.close()},500)}
			} else {th.showBtn.classList.remove('visible')}
			
			
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
	
			let th = this;
		this.opts = Object.assign({
			name:'attachviewer',
			domain:'localhost',
			showPrevNext:true, 
			prev:'〈',
			next:'〉', 
			close: '╳',
			download:'⇓',
			show:'⤢',
			closeOnShow:true,
			closeOnDownload:true,
			unknownPreview: true,
			unknownCaption:'Скачать файл',
			unknownTitle:'Предварительный просмотр недоступен',
			closable:false
			
		},opts);
		
	

		
		this.container = crEl('div', {c:'attachviewer'});
		if(elements && elements.length){
		
		this.toolbar = crEl('div', {c:'attachviewer-subtoolbar'});

			this.title = crEl('span', {c:'attachviewer-title'});
			
			this.downloadBtn = crEl('a',{},th.opts.download);
			this.showBtn = crEl('a',{},th.opts.show);		
		
			function Item (item, index){
				return crEl('div',{c:'attachviewer-item', d:{name:item.dataset.name || item.innerHTML, url:item.href, showUrl: item.dataset.showUrl || '', downloadUrl:item.dataset.downloadUrl || ''}});
				

				
				
			}		
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
				this.container.appendChild(crEl('button',{c:'attachviewer-prev',e:{click:function(event){event.preventDefault(); th.prev(); return false;}}},this.opts.prev));
				this.container.appendChild(crEl('button',{c:'attachviewer-next',e:{click:function(event){event.preventDefault(); th.next(); return false;}}},this.opts.next));
			}
			
	
			
			this.toolbar.appendChild(this.downloadBtn)
			this.toolbar.appendChild(this.showBtn)

			this.container.onclick = function(event){ 
				if(event.target === this){
					if(th.opts.closable){
						th.close();
					}
				}
				return false;}
			
			this.container.appendChild(crEl('div',{c:'attachviewer-toolbar'},
					crEl('button',{c:'attachviewer-close', e:{click:function(){th.close()}}},th.opts.close),
					th.toolbar,
					th.title
				))
							
			
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