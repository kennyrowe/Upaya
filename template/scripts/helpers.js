Y.use('node', function () {
	window.helper = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.bindUI();
			}, this);

		},


		bindUI: function() {

			this.dataToggleBody();
			this.dataToggleEl();
			this.dataLightbox();

			Y.one(window).on('resize', this.syncUI, this);

		},


		syncUI: function () {

			if (Y.one('.touch-styles')) {
				Y.one(window).on('orientationchange', function () {
					this.imgLoad();
				}, this);
			} else {
				helper.debounce(function () {
					helper.imgLoad();
				});
			}

		},


		radioCheckboxes: function (wrapper, checkbox, label) {

			/*
				Makes a group of checkboxes behave more
				like radios.

				Only the wrapper param is required.
				Checkbox and label default to the most
				generic selectors possible, but you can
				make them more specific.

				helper.radioCheckboxes('#nav', '.folder-checkbox', '.folder-label');
			*/

			if (!wrapper) {
				console.warn('radioCheckboxes: Must define a wrapper.');
				return;
			}

			if (!Y.one(wrapper)) {
				console.warn('radioCheckboxes: No wrapper found on page.');
				return;
			}

			checkbox = checkbox || '[type="checkbox"]';
			label = label || 'label[for]';

			if (Y.one(wrapper).all(checkbox).size() > 1) {
				Y.one(wrapper).delegate('click', function (e) {
					e.preventDefault();
					var currentCheck = Y.one('#' + e.currentTarget.getAttribute('for'));
					if (currentCheck.get('checked') === false) {
						Y.one(wrapper).all(checkbox).each(function (current) {
							current.set('checked', false);
						});
						currentCheck.set('checked', true);
					} else {
						currentCheck.set('checked', false);
					}
				}, label);
			}

		},


		folderRedirect: function (folder, wrapper) {

			/*
				Redirects the main folder link to the first
				page in the folder. Relies on a data attribute
				in the markup.

				<label for="{id}" data-href="{urlId}">Folder</label>
			*/

			folder = folder || 'label[for]';
			wrapper = wrapper || 'body';

			if (Y.one(folder)) {
				Y.one(wrapper).delegate('click', function (e) {
					e.preventDefault();
					var link = e.currentTarget.getData('href');
					if (link) {
						window.location = link;
					} else {
						console.warn('folderRedirect: You must add a data-href attribute to the label.')
					}
				}, folder);
			}

		},


		dataLightbox: function() {

			/*
				Creates a lightbox when you click on any image/video. 
				To initialize, add a data attribute to any img or video tag

				<img data-lightbox="set-name"/>
			*/

			var lightboxSets = {};

			Y.all('[data-lightbox]').each(function(elem) {
				var name = elem.getAttribute('data-lightbox');
				lightboxSets[name] = lightboxSets[name] || new Array();

				lightboxSets[name].push({
					content: elem,
					meta: elem.getAttribute('alt')
				});

				elem.on('click', function(e) {
					e.halt();

					new Y.Squarespace.Lightbox2({
						set: lightboxSets[name],
						currentSetIndex: Y.all('[data-lightbox]').indexOf(elem),
						controls: { previous: true, next: true }
					}).render();
				});
			});

		},


		dataToggleBody: function() {

			/*
				Toggles a class on the body when you click an
				element. To initialize, add a data attribute to
				any element, like so.

				<div class="shibe" data-toggle-body="doge"></div>
			*/

			Y.one('body').delegate('click', function(e) {
				Y.one('body').toggleClass(e.currentTarget.getData('toggle-body'));
			}, '[data-toggle-body]');

		},


		dataToggleEl: function() {

			/*
				Toggles a class on any element when you click on
				it. To initialize, add a data attribute to any
				element, like so.

				<div class="shibe" data-toggle="doge"></div>
			*/

			Y.one('body').delegate('click', function(e) {
				var current = e.currentTarget;
				current.toggleClass(current.getData('toggle'));
			}, '[data-toggle]');

		},


		debounce: function(callback, timer, context) {

			/*
				This function takes an event that executes
				continuously - like scroll or resize - and
				fires only one event when the continuous
				events are finished.

				helpers.debounce(function () {
					// do stuff here.
				});
			*/

			timer = timer || 100;
			context = context || Site;

			if (callback) {
				this._timeout && this._timeout.cancel();
				this._timeout = Y.later(timer, context, callback);
			}

		},


		imgLoad: function (el) {

			/*
				Pass an image selector to this function and
				Squarespace will load up the proper image
				size.

				ex: this.imgLoad('img[data-src]');
			*/

			el = el || 'img[data-src]';

			Y.one(el) && Y.all(el).each(function (img) {
				ImageLoader.load(img);
			});

		},

		scrollToAnchor: function(wrapper, link, delay, scrollOffset) {

			wrapper = wrapper || 'body';
			link = link || '[href^="#"]';
			delay = delay || 0;
			scrollOffset = scrollOffset || 0;

			Y.one(wrapper).delegate('click', function (e) {
				e.preventDefault();
				var anchor = e.currentTarget.getAttribute('href');
				if (Y.one(anchor)) {
					Y.later (delay, this, function () {
						console.log('wrapper ' + wrapper + ', link ' + link + ', offest ' + scrollOffset + ', delay ' + delay);
						if (Y.one(anchor)) {
							var scrollAnim = new Y.Anim({
								node: Y.one(Y.UA.gecko || Y.UA.ie || !!navigator.userAgent.match(/Trident.*rv.11\./) ? 'html' : 'body'),
								to: {
									scrollTop : (Math.round(Y.one(anchor).getY()) - scrollOffset)
								},
								duration: 0.4,
								easing: 'easeOut'
							});
							scrollAnim.run();
							scrollAnim.on('end', function (e) {
								Y.one(window).on('hashchange', function (h) {
									h.preventDefault();
								});
								window.location.hash = anchor;
							});
						}
					});
				} else {
					window.location.hash = anchor;
				}
			}, link);
		}

	});
});