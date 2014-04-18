Y.use('node', function (Y) {
	window.Authenticated = Singleton.create({

		ready: function () {
			this.bindUI();
		},

		bindUI: function () {

			Y.Global.on('tweak:beforeopen', function (f) {
				setTimeout(function () {
					Y.one(window).simulate('resize');
				}, 500);
			});

			Y.Global.on('tweak:close', function (f) {
				setTimeout(function () {
					Y.one(window).simulate('resize');
				}, 500);
				Y.one('#mobileNavToggle').set('checked',false);
			});

			Y.Global.on('tweak:change', function (f) {
				console.log(f.getName());
				if(f.getName() == 'siteTitleContainerWidth' || 'logoContainerWidth'){
					Y.one('#header').addClass('tweaking');
					helper.debounce(function () {
						Y.one('#header').removeClass('tweaking');
					});
				}

				if(f.config && f.config.category == 'Site Navigation'){
					Y.one('#mobileNavToggle').set('checked',true);
				}

				helper.debounce(function () {
					Y.one('#header').removeClass('tweaking');
				},500);

				if(f.getName() == 'transparent-header'){
					helper.debounce(function () {
						helper.imgLoad();
					});
				}
			});

		}

	});
});