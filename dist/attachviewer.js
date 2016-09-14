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
			var th = this;
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

					var maxWidth = window.innerWidth - 96 + "px";
					var maxHeight = window.innerHeight - 96 + "px";

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
							xx = crEl('iframe', { src: '//docs.google.com/a/' + th.opts.domain + '/viewer?url=' + el.dataset.url + '&embedded=true' });
							xx.style.height = maxHeight;
							xx.style.width = maxWidth;
						} else {
							var url = '#';
							if (el.dataset.downloadUrl && el.dataset.downloadUrl.length) {
								url = el.dataset.downloadUrl;
							} else if (el.dataset.url && el.dataset.url.length) {
								url = el.dataset.url;
							} else {
								url = url.href;
							}
							console.log(url, el);
							if (th.opts.unknownPreview == false) {
								location.href = url;return false;
							}
							xx = crEl('div', { c: 'attachviewer-unknown' }, crEl('h3', th.opts.unknownTitle), crEl('a', { href: url, target: '_blank', e: { click: function click() {
										return th.close();
									} } }, th.opts.unknownCaption));
						}
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

		var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, AttachViewer);

		this.opts = Object.assign({
			name: 'attachviewer',
			domain: 'localhost',
			showPrevNext: true,
			prev: '〈',
			next: '〉',
			close: '╳',
			download: '⇓', show: '⤢',
			closeOnShow: true,
			closeOnDownload: true,
			unknownPreview: true,
			unknownCaption: 'Скачать файл',
			unknownTitle: 'Предварительный просмотр недоступен'

		}, opts);
		var th = this;

		function Item(item, index) {
			var toolbar = crEl('div', { c: 'attachviewer-subtoolbar' });
			if (item.dataset) {
				if (item.dataset.downloadUrl && item.dataset.downloadUrl.length) {
					toolbar.appendChild(crEl('a', { target: item.dataset.target || '_blank', href: item.dataset.downloadUrl, e: { click: function click() {
								if (th.opts.closeOnDownload) {
									th.close();
								}
							} } }, th.opts.download));
				}

				if (item.dataset.showUrl && item.dataset.showUrl.length) {
					toolbar.appendChild(crEl('a', { target: item.dataset.target || '_blank', href: item.dataset.showUrl, e: { click: function click() {
								if (th.opts.closeOnShow) th.close();
							} } }, th.opts.show));
				}
			}
			return crEl('div', { c: 'attachviewer-item', d: { url: item.href } }, crEl('div', { c: 'attachviewer-toolbar' }, crEl('button', { c: 'attachviewer-close', e: { click: function click() {
						th.close();
					} } }, th.opts.close), toolbar, item.dataset.name || item.innerHTML));
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
			if (this.opts.showPrevNext && elements.length > 1) {
				this.container.appendChild(crEl('button', { c: 'attachviewer-prev', e: { click: function click() {
							th.prev();
						} } }, this.opts.prev));
				this.container.appendChild(crEl('button', { c: 'attachviewer-next', e: { click: function click() {
							th.next();
						} } }, this.opts.next));
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
		return this;
	}

	return AttachViewer;
}();