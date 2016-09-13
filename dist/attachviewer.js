'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*attachviewer*/
var AttachViewer = function () {
	_createClass(AttachViewer, [{
		key: 'close',
		value: function close() {
			this.container.classList.remove('active');
		}
	}, {
		key: 'open',
		value: function open(i) {
			console.log(i);
			this.container.classList.add('active');
			if (this.container.querySelector('.active')) {
				this.container.querySelector('.active').classList.remove('active');
			}
			var el = this.container.querySelectorAll('.attachviewer-item')[i];
			if (el) {
				el.classList.add('active');
				if (!el.dataset.loaded) {
					var OFFICE = ['PPT', 'PPTX', 'DOC', 'DOCX', 'XLS', 'XLSX'];
					var GOOGLE = ['WebM', 'MPEG4', '3GPP', 'MOV', 'AVI', 'MPEGPS', 'WMV', 'FLV', 'TXT', 'CSS', 'HTML', 'PHP', 'C', 'CPP', 'H', 'HPP', 'JS', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'PAGES', 'AI', 'PSD', 'TIFF', 'DXF', 'EPS', 'PS', 'TTF', 'XPS', 'ZIP', 'RAR'];
					var IMAGES = ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF', 'BMP', 'SVG'];
					var re = /(?:\.([^.]+))?$/;
					var ext = re.exec(el.dataset.url)[1]; // extention
					var xx = crEl('span', 'X3_' + ext);
					var maxHeight = window.innerHeight - 96 + "px";
					var maxWidth = window.innerWidth - 96 + "px";

					if (ext) {
						if (IMAGES.indexOf(ext.toUpperCase()) >= 0) {
							xx = crEl('img', { src: el.dataset.url });
							xx.style.maxWidth = maxWidth;
							xx.style.maxHeight = maxHeight;
						} else if (OFFICE.indexOf(ext.toUpperCase()) >= 0) {
							xx = crEl('iframe', { src: 'https://view.officeapps.live.com/op/embed.aspx?src=' + el.dataset.url, frameborder: 0 });
							xx.style.height = maxHeight;
							xx.style.width = maxWidth;
						} else if (GOOGLE.indexOf(ext.toUpperCase()) >= 0) {
							xx = crEl('iframe', { src: 'https://docs.google.com/a/' + this.domain + '/viewer?url=' + el.dataset.url + '&embedded=false' });
						} else {}

						//
					}

					el.appendChild(xx);
					el.dataset.loaded = true;
				}
			}
			//this.container.appendChild(new Item(item));
			this.container.dataset.index = i;
		}
	}, {
		key: 'next',
		value: function next() {
			var i = +this.container.dataset.index;
			var l = +this.container.dataset.length;
			if (i >= l - 1) {
				i = -1;
			}
			this.open(i + 1);
		}
	}, {
		key: 'prev',
		value: function prev() {
			var i = +this.container.dataset.index;
			var l = +this.container.dataset.length;
			if (i <= 0) {
				i = l;
			}
			this.open(i - 1);
		}
	}]);

	function AttachViewer(elements) {
		var _this = this;

		_classCallCheck(this, AttachViewer);

		var th = this;
		this.domain = 'my-pm.ru';
		function Item(item, index) {
			return crEl('div', { c: 'attachviewer-item', d: { url: item.href } }, crEl('div', { c: 'attachviewer-toolbar' }, crEl('button', { c: 'attachviewer-close', e: { click: function click() {
						th.close();
					} } }, '×'), crEl('div', { c: 'attachviewer-subtoolbar' }, crEl('a', { target: '_blank', href: item.href, e: { click: function click() {
						th.close();
					} } }, '⇓')), item.innerHTML));
		}

		this.container = crEl('div', { c: 'attachviewer' });
		if (elements && elements.length) {
			this.container.dataset.length = elements.length;
			elements.forEach(function (k, i) {
				k.addEventListener('click', function (event) {
					event.preventDefault();
					th.open(i);
					return false;
				});

				_this.container.appendChild(new Item(k, i));
			});
			if (elements.length > 1) {
				this.container.appendChild(crEl('button', { c: 'attachviewer-prev', e: { click: function click() {
							th.prev();
						} } }, '〈'));
				this.container.appendChild(crEl('button', { c: 'attachviewer-next', e: { click: function click() {
							th.next();
						} } }, '〉'));
			}
		}

		document.body.appendChild(this.container);
		window.addEventListener('keydown', function (event) {
			if (th.container.classList.contains('active')) {
				if (event.keyCode === 27) {
					//escape
					th.close();
				}
				if (event.keyCode === 37) {
					//<-
					th.prev();
				}
				if (event.keyCode === 39) {
					//->
					th.next();
				}
				//console.log(event.keyCode)
			}
		});
		this.container.focus();
		return elements;
	}

	return AttachViewer;
}();