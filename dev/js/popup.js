"use strict";

(function ($) {
	// ------------------------------- Settings options ------------------------------- //
	var storageOptions = {
		area: chrome.storage.local,
		default_options: {

		}
	};
	// ================================================================================ //


	// ----------------------------------- Main app ----------------------------------- //
	let app = {
		bg: chrome.extension.getBackgroundPage(),

		// ------------------------ Logic for work with tasks ------------------------- //
		Tasks: {
			localStorage: chrome.storage.local,
			remoteStorage: chrome.storage.sync,

			getAll: function() {

			},
			getById: function(id) {

			},
			getByUrl: function(url) {

			},
			getByOrder: function(order) {

			}
		},
		// ============================================================================ //

		init: function(parent) {
			let self = this;

			$(parent).on("load", () => {
				self.bg.setIcon("active.png");
			});

			$(parent).on("unload", () => {
				self.bg.setIcon("default.png");
			});

			self.binds(parent);
		},

		binds: function(parent) {

		}
	};
	// ================================================================================ //

	app.init(window);
})(jQuery)