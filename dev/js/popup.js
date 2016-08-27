"use strict";

(($) => {
	// ----------------------------------- Main app ----------------------------------- //
	chrome.storage.sync.tasks = [{
		id: "1",
		title: "First task",
		completed: true,
		order: 1,
		url: "",
		content: "Task description. How can anyone use the Todo app, if this app don't care about just simple thing as a task description?"
	},
	{
		id: "2",
		title: "Smoll",
		completed: false,
		order: 2,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "3",
		title: "It's task have medium head size",
		completed: true,
		order: 3,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "4",
		title: "It's task have Large head size for testing UI on my browser",
		completed: false,
		order: 4,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "5",
		title: "Task with many space                                         ",
		completed: true,
		order: 5,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	}];

	let app = {
		lock: true,									// Lock UI while app load or/and render

		// ------------------------ Logic for work with tasks ------------------------- //
		Tasks: {
			serverContentInTitle: true,				// I hope, that this is stopgap only
			itemVars: ["id", "title", "completed" ,"order", "url", "content"],
			items: chrome.storage.sync.tasks,

			getAll: () => {
				return app.Tasks.items || [];
			},
			getBy: (getBy, value) => {
				if (typeof value === "undefined" || value === null || itemVars.indexOf(getBy) === -1) {
					return app.Tasks.items || [];
				} else {
					let bufTasks = [];

					$.each(app.Tasks.items, (i, task) => {
						if (typeof task[getBy] !== "undefined" && task[getBy] === value) {
							bufTasks.push(task);
						}
					});

					return bufTasks;
				}
			},

			set: (tasks) => {

			},

			add: (tasks) => {

			},

			deleteBy: (deleteBy, value) => {

			},
			delete: (task) => {

			},

			sort: (tasks, sortBy) => {
				if (tasks.length) {
					if (typeof tasks[0][sortBy] === "number") {
						tasks.sort((task1, task2) => {
							return task1[sortBy] - task2[sortBy];
						});
					} else {
						tasks.sort();
					}
				}

				return tasks;
			},
			toHtml: (tasks) => {
				let tasksHtml = [], stateTask = "";

				$.each(tasks, (i, task) => {
					stateTask = (task.completed ? "completed" : "uncompleted");

					tasksHtml.push([
						"<li class='item'>",
							"<img class='item__completed' src='../img/", stateTask, ".png' title='Task ", stateTask, "'>",

							"<span class='item__head' href='", task.url, "' title='", task.title, "' target='_blank'>",
								task.title,
							"</span>",

							//"<span class='item__id'>", task.id, "</span>",

							"<div class='item__content'>",
								task.content,
							"</div>",
						"</li>"
					].join(""));
				});

				return tasksHtml.join("");
			},
			getState: () => {
				let state = "active";

				$.each(app.Tasks.getAll(), (i, task) => {
					if (task.completed === false) {
						state = "uncomplete";
						return false;
					}
				});

				return state;
			}
		},
		// ============================================================================ //

		init: (parent, tasksContainer) => {
			$(parent).on("load", () => {
				app.setIcon("active");
			});

			$(tasksContainer).empty().append(
				app.Tasks.toHtml(
					app.Tasks.sort(
						app.Tasks.getAll(),
						"order"
					)
				)
			);

			app.setWidthСonsiderScroll(tasksContainer);

			app.binds(parent, tasksContainer, () => {
				app.lock = false;
			});
		},

		binds: (parent, tasksContainer, callback) => {
			// ------------------------------ lock block ------------------------------ //
			let lockList = ".brand, .search__icon, .sync__icon, .showset__icon, .hideset__icon, .overlay";

			$(parent).on("click", lockList, (e) => {
				if (app.lock) {					// If the UI is locked
					e.stopImmediatePropagation();	// stop the event
					return false;					// or stop open link
				}
			});
			// ======================================================================== //

			// ----------------------------- search block ----------------------------- //
			let searchText = $(parent).find(".search__text"),
				searchClassActive = "search__text-active";

			$(parent).on("click", ".search__icon", () => {
				if (searchText.hasClass(searchClassActive)) {
					searchText.removeClass(searchClassActive);
					$(parent).focus();
				} else {
					searchText.addClass(searchClassActive).focus();
				}
			});
			// ======================================================================== //

			// ---------------------------- settings block ---------------------------- //
			let settings = $(parent).find(".settings"),
				overlay = $(parent).find(".overlay"),
				removeWillTimeoutID = null;

			$(parent).on("mouseenter", ".showset__icon, .hideset__icon, .overlay", () => {
				clearTimeout(removeWillTimeoutID);
				removeWillTimeoutID = null;
				settings.addClass("will-transform");
			});
			$(parent).on("mouseleave", ".showset__icon, .hideset__icon, .overlay", () => {
				removeWillTimeoutID = setTimeout(() => {
					settings.removeClass("will-transform");
				}, 800);
			});

			$(parent).on("click", ".showset__icon", () => {
				app.lock = true;

				settings.addClass("settings-active");
				overlay.addClass("overlay-block").addClass("overlay-active");
			});
			$(parent).on("click", ".hideset__icon, .overlay", () => {
				app.lock = true;

				settings.removeClass("settings-active");
				overlay.removeClass("overlay-active");
			});

			$(parent).on("transitionend", ".settings", () => {
				clearTimeout(removeWillTimeoutID);
				settings.removeClass("will-transform");

				if (!overlay.hasClass("overlay-active")) {
					overlay.removeClass("overlay-block");
				}

				app.lock = false;
			});
			// ======================================================================== //

			callback && callback();
		},

		setWidthСonsiderScroll: (block) => {
			let main = $(".main"), list = $(block),
				appHeight = $(".app").height(),
				headerHeight = $(".header").height(),
				footerHeight = $(".footer").height(),
				maxHeight = appHeight - headerHeight - footerHeight;

			if (list.height() > maxHeight) {
				main.addClass("main-scroll");
			} else {
				main.removeClass("main-scroll");
			}
		},

		setIcon: (state) => {
			chrome.browserAction.setIcon({
				"path": "../img/ext_icons/" + state + ".png"
			});
		}
	};
	// ================================================================================ //

	app.init(document, ".list");					// Or return app, if we use autoloader
})(jQuery)