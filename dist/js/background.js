chrome.runtime.onInstalled.addListener(function (details) {
	function setDefaults(callback) {
		storage.area.get(function (stored_options) {
			var default_options = storage.default_options,
			option,
			new_options = {};
			for (option in default_options) {
				if (!stored_options.hasOwnProperty(option)) {
					new_options[option] = default_options[option];
				}
			}
			if (Object.keys(new_options).length !== 0) {
				storage.area.set(new_options, function () {
					if (typeof callback === 'function') {
						callback();
					}
				});
			} else {
				if (typeof callback === 'function') {
					callback();
				}
			}
		});
	}

	switch (details.reason) {
		case 'install':
			setDefaults(() => {
				openOptions();
			});
			break;

		case 'update':
			setDefaults();
			break;

		default:
			break;
	}
});

chrome.runtime.onUpdateAvailable.addListener(function (details) {
	chrome.runtime.reload();
});