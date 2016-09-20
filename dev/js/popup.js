"use strict";

(($) => {
	// ----------------------------------- Main app ----------------------------------- //
	chrome.storage.sync.set({
		tasks: [{
			id: "1",
			title: "Add ui add",
			completed: false,
			order: 1,
			url: "",
			content: "Task description. How can anyone use the Todo app, if this app don't care about just simple thing as a task description?",
			contentSize: 1
		},
		{
			id: "2",
			title: "Add ui set",
			completed: false,
			order: 2,
			url: "",
			content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum.",
			contentSize: 1
		},
		{
			id: "3",
			title: "Test task for resize height and change scrollTop",
			completed: true,
			order: 3,
			url: "",
			content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis obcaecati suscipit laudantium est delectus voluptatibus odit voluptatum aut! Perferendis, debitis. Eveniet temporibus laudantium assumenda explicabo inventore praesentium voluptas autem magnam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia qui consequatur ullam sint tenetur, vel minus sed voluptatibus, quia non, enim temporibus assumenda laborum repellat. Consequuntur delectus laborum nam dolor? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, aut. Quam velit eveniet accusantium, quidem, sapiente debitis laudantium officiis voluptatem soluta ad quisquam et cupiditate exercitationem? Temporibus, libero provident aut. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione ab qui laudantium dolor, sit doloremque aliquid earum nesciunt vero ullam commodi, blanditiis numquam natus libero repellat odit cum, ipsa nostrum! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus dolorum, illo laboriosam aliquid ut rem expedita, sed reiciendis quo soluta laborum, labore voluptas provident ullam fugiat totam quos est possimus? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus nemo vero provident repudiandae fugit autem fuga quod deleniti quo soluta animi suscipit hic fugiat architecto eligendi aut laboriosam, eaque deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum.",
			contentSize: 1
		},
		{
			id: "4",
			title: "Add ui delete",
			completed: false,
			order: 4,
			url: "",
			content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum.",
			contentSize: 1
		},
		{
			id: "5",
			title: "Test task too (last task)",
			completed: true,
			order: 5,
			url: "",
			content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem eum sequi, voluptatibus magnam vero cumque aut voluptates tenetur quae. Aliquid dolorem provident, illo quas molestias praesentium obcaecati animi ea at. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis enim vero odio aliquid fuga. Laborum quidem voluptate dignissimos, nesciunt iste unde voluptatum at, cumque incidunt, saepe nisi tenetur aspernatur vitae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea minus velit aspernatur sed alias itaque perferendis, quis at neque maxime, amet fugit delectus accusamus, culpa unde dolorem qui obcaecati repellat? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque consectetur eius sapiente accusamus facilis doloribus, minima, ipsam quo dolorum qui animi amet reprehenderit. Iste molestiae animi illo assumenda adipisci soluta.",
			contentSize: 1
		}]
	});

	let app = {
		lock: true,									// Lock UI while app load or/and render

		// ------------------------ Logic for work with tasks ------------------------- //
		Tasks: {
			itemVars: ["id", "title", "completed" ,"order", "url", "content"],
			items: [],

			init: (callback) => {
				chrome.storage.sync.get("tasks", (data) => {
					app.Tasks.items = data.tasks;

					callback && callback();
				});
			},

			getAll: () => {
				return app.Tasks.items || [];
			},
			getBy: (getBy, value) => {
				if (typeof value === "undefined" || value === null || app.Tasks.itemVars.indexOf(getBy) === -1) {
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
				if (tasks.length !== 0 && app.Tasks.items.length !== 0) {
					let setFlag = false;

					$.each(tasks, (i, newTask) => {
						$.each(app.Tasks.items, (j, oldTask) => {
							if (oldTask.id === newTask.id) {
								oldTask = newTask;
								setFlag = true;
								return false;
							}
						});
					});

					if (setFlag) {
						chrome.storage.sync.set({tasks: app.Tasks.items});
					}
				}
			},

			setProp: (id, prop, value) => {
				if (app.Tasks.itemVars.indexOf(prop) === -1 || prop === "id" || !app.Tasks.typeConform(prop, value)) {
					return {};
				} else {
					let bufTask = {},
						setFlag = false;

					$.each(app.Tasks.items, (i, task) => {
						if (task.id === id) {
							task[prop] = value;
							bufTask = task;
							setFlag = true;
							return false;
						}
					});

					if (setFlag) {
						chrome.storage.sync.set({tasks: app.Tasks.items});
					}

					return bufTask;
				}
			},

			add: (tasks) => {
				if (tasks.length !== 0) {
					chrome.storage.sync.set({tasks: $.merge(app.Tasks.items, tasks)});
				}
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
				let tasksHtml = [],
					stateTask = "",
					contentSize = 1;

				$.each(tasks, (i, task) => {
					stateTask = (task.completed ? "completed" : "uncompleted");
					contentSize = task.contentSize.toString();

					tasksHtml.push([
						"<li class='item' data-id='", task.id, "' data-size='", contentSize, "'>",
							"<img class='item__state item__state-", stateTask, "' src='../img/", stateTask, ".svg' title='Task ", stateTask, "'>",

							"<span class='item__head' title='", task.title, "' target='_blank'>",
								task.title,
								"<div class='item__options'>",
									"<img class='item__option item__option-edit' src='../img/item_edit.svg'>",
									"<img class='item__option item__option-delete' src='../img/item_delete.svg'>",
								"</div>",
							"</span>",

							"<div class='item__content'>",
								task.content,
							"</div>",

							"<div class='arrow arrow-up'>",
								"<img class='arrow__img' src='../img/item_arrow_up.svg'>",
							"</div>",

							"<div class='arrow arrow-down'>",
								"<img class='arrow__img' src='../img/item_arrow_down.svg'>",
							"</div>",
						"</li>"
					].join(""));
				});

				return tasksHtml.join("");
			},
			typeConform: (prop, value) => {
				switch(prop) {
					case "id":
						return typeof value === "string";
					case "title":
						return typeof value === "string";
					case "content":
						return typeof value === "string";
					case "url":
						return typeof value === "string";
					case "order":
						return typeof value === "number";
					case "contentSize":
						return typeof value === "number";
					case "completed":
						return typeof value === "boolean";
				}
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

		// -------------------------------- init block -------------------------------- //
		init: (parent, tasksContainer) => {
			$(parent).ready(() => {
				app.setIcon("active");
			});

			app.Tasks.init(() => {
				$(tasksContainer).append(
					app.Tasks.toHtml(
						app.Tasks.sort(
							app.Tasks.getAll(),
							"order"
						)
					)
				);

				app.binds(parent, tasksContainer, () => {
					app.lock = false;
				});
			});
		},

		binds: (parent, tasksContainer, callback) => {
			app.lockBinds(parent);
			app.searchBinds(parent);
			app.settingsBinds(parent);
			app.itemsBinds(tasksContainer);

			callback && callback();
		},
		// ============================================================================ //

		// -------------------------------- lock block -------------------------------- //
		lockBinds: (parent) => {
			let lockList = ".brand, .search__icon, .sync__icon, .showset__icon, .hideset__icon, .overlay";

			$(parent).on("click", lockList, (e) => {
				if (app.lock) {							// If the UI is locked
					e.stopImmediatePropagation();		// stop the event
					return false;						// or stop open link
				}
			});
		},
		// ============================================================================ //

		// ------------------------------- search block ------------------------------- //
		searchBinds: (parent) => {
			let searchText = $(parent).find(".search__text"),
				searchClassActive = "search__text-active";

			$(parent).on("mouseenter", ".search__icon", () => {
				searchText.addClass("will-transform");
			});
			$(parent).on("mouseleave", ".search__icon", () => {
				if (!searchText.hasClass(searchClassActive)) {
					searchText.removeClass("will-transform");
				}
			});
			$(parent).on("click", ".search__icon", () => {
				searchText.addClass(searchClassActive).focus();
			});
			$(parent).on("blur", ".search__text", () => {
				searchText.removeClass(searchClassActive);
			});
		},
		// ============================================================================ //

		// ------------------------------ settings block ------------------------------ //
		settingsBinds: (parent) => {
			let settings = $(parent).find(".settings"),
				saveSets = $(parent).find(".save"),
				overlay = $(parent).find(".overlay"),
				showTitles = $(parent).find("#showTitles"),
				removeWillTimeoutID = null,
				tooltipHideTimeoutID = null,
				tooltipMes = "",
				tooltipDelay = 4000;

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

			$(parent).on("change", "[data-storage]", () => {
				tooltipMes = chrome.i18n.getMessage("tooltipSave");

				if (!saveSets.hasClass("save-unsave")) {
					saveSets.addClass("save-unsave");

					clearTimeout(tooltipHideTimeoutID);
					tooltipHideTimeoutID = app.showTooltip(saveSets, tooltipDelay,	"save__tooltip", tooltipMes,
						(parent, classTip) => {
							app.hideTooltip(parent, classTip);
						}
					);
				}
			});
			$(parent).on("click", ".save", () => {
				clearTimeout(tooltipHideTimeoutID);
				tooltipMes = chrome.i18n.getMessage("tooltipSaveAlready");

				if (saveSets.hasClass("save-unsave")) {
					saveSets.removeClass("save-unsave");
					app.saveSetsOnServer(storageOptions.default_options);
					tooltipMes = chrome.i18n.getMessage("tooltipSaveOk");
				}

				tooltipHideTimeoutID = app.showTooltip(saveSets, tooltipDelay,	"save__tooltip", tooltipMes,
					(parent, classTip) => {
						app.hideTooltip(parent, classTip);
					}
				);
			});
		},
		// ============================================================================ //

		// -------------------------------- items block ------------------------------- //
		itemsBinds: (parent) => {
			app.itemsCompletedBinds(parent);
			app.itemsArrowsBinds(parent);
			app.itemsOptionsBinds(parent);
		},
		itemsCompletedBinds: (parent) => {
			let itemState = null,
				itemClass = "item",
				itemClassState = "item__state",
				itemClassCompleted = "item__state-completed",
				itemClassUncompleted = "item__state-uncompleted",
				itemClassClick = "item__state-click",
				itemSrc = "",
				itemId = "",
				itemAnimTimeout = null,
				rotateDuration = 300;

			$(parent).on("click", "." + itemClassState, (e) => {
				itemState = $(e.target);

				if (!itemState.hasClass(itemClassClick)) {
					itemState.toggleClass(itemClassCompleted)
						.toggleClass(itemClassUncompleted)
						.addClass(itemClassClick);

					itemId = itemState.closest("." + itemClass).attr("data-id").toString();

					if (itemState.hasClass(itemClassCompleted)) {
						app.Tasks.setProp(itemId, "completed", true);
						itemSrc = "../img/completed.svg";
					} else {
						app.Tasks.setProp(itemId, "completed", false);
						itemSrc = "../img/uncompleted.svg";
					}

					itemAnimTimeout = setTimeout(() => {
						clearTimeout(itemAnimTimeout);
						itemAnimTimeout = null;

						itemState.attr("src", itemSrc);
						itemState.removeClass(itemClassClick);
					}, rotateDuration);
				}
			});
		},
		itemsArrowsBinds: (parent) => {
			let mainClass = "main",
				item = null,
				itemClass = "item",
				contentSize = 1,
				arrow = null,
				arrowClass = "arrow",
				arrowClassUp = "arrow-up",
				arrowClassDown = "arrow-down",
				animDuration = 300,
				itemMain = $(parent).closest(".main"),
				itemMinHeight = $(parent).find(".item__head").height(),
				itemMidHeight = itemMinHeight * 2.5,
				itemMainHeight = itemMain.height() - 10,
				itemMaxHeight = itemMidHeight;

			$(parent).on("click", "." + arrowClass, (e) => {
				arrow = $(e.target);
				item = arrow.closest("." + itemClass);
				contentSize = item.attr("data-size");

				if (arrow.hasClass(arrowClassUp)) {
					if (contentSize > 0) {
						contentSize--;
					}
				} else {
					if (contentSize < 2) {
						contentSize++;
					}
				}

				item.attr("data-size", contentSize);

				switch (contentSize) {
					case 0:
						item.find("." + arrowClassUp).addClass("slade-out");
						item.animate({height: itemMinHeight}, animDuration);
						item.find(".item__content").removeClass("ovya");

						break;
					case 1:
						item.find("." + arrowClassUp).removeClass("slade-out");
						item.find("." + arrowClassDown).removeClass("slade-out");
						item.animate({height: itemMidHeight}, animDuration);
						item.find(".item__content").removeClass("ovya");

						break;
					case 2:
						item.find("." + arrowClassDown).addClass("slade-out");

						itemMaxHeight = item.find(".item__content").height() + itemMinHeight + 12;

						if (itemMaxHeight > itemMainHeight) {
							itemMaxHeight = itemMainHeight;
							item.find(".item__content").addClass("ovya");

							item.animate({height: itemMaxHeight}, animDuration);

							$("." + mainClass).animate({
								scrollTop: item.position().top + $("." + mainClass).scrollTop() - itemMinHeight - 11
							}, animDuration);
						} else {
							item.animate({height: itemMaxHeight}, animDuration);
						}

						break;
				}

				app.Tasks.setProp(item.attr("data-id").toString(), "contentSize", contentSize);
			});
		},
		itemsOptionsBinds: (parent) => {
			let item = null,
				itemClass = "item",
				animDuration = 300;

			$(parent).on("click", "." + itemClass, (e) => {

			});
		},
		// ============================================================================ //

		// --------------------------- additional funcrions --------------------------- //
		saveSetsOnServer: (settings) => {
			// $.ajax({
			// 	url: config.host + "/users/" + config.userId + "/settings",
			// 	method: "post",
			// 	dataType: "json",
			// 	data: $.stringify(settings)
			// }).then((data) => {

			// }, (error) => {
			// 	console.log(error);
			// });
		},

		showTooltip: (parent, delay, classTip, message, callback) => {
			$(parent).find("." + classTip).addClass(classTip + "-active").text(message);

			return setTimeout(() => {
				callback && callback(parent, classTip);
			}, delay);
		},

		hideTooltip: (parent, classTip, callback) => {
			$(parent).find("." + classTip).removeClass(classTip + "-active");
			callback && callback();
		},

		getCssProp: (prop) => {
			return document.documentElement.style.getPropertyValue(prop);
		},

		setCssProp: (prop, value) => {
			return document.documentElement.style.setProperty(prop, value);
		},

		setIcon: (state) => {
			chrome.browserAction.setIcon({
				"path": chrome.runtime.getURL("../img/ext_icons/" + state + ".png")
			});
		}
		// ============================================================================ //
	};
	// ================================================================================ //

	app.init(document, ".list");					// Or return app, if using autoloader
})(jQuery)