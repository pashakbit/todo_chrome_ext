"use strict";

chrome.runtime.onInstalled.addListener((details) => {
	function setDefaults(callback) {
		storageOptions.area.get((stored_options) => {
			let default_options = storageOptions.default_options,
				option,
				new_options = {};

			for (option in default_options) {
				if (!stored_options.hasOwnProperty(option)) {
					new_options[option] = default_options[option];
				}
			}

			if (Object.keys(new_options).length !== 0) {
				storageOptions.area.set(new_options, () => {
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

chrome.runtime.onUpdateAvailable.addListener((details) => {
	chrome.runtime.reload();
});


chrome.windows.onFocusChanged.addListener((id) => {
	if (id !== -1) {
		chrome.browserAction.setIcon({
			"path": "../img/ext_icons/default.png"
		});
	}
});