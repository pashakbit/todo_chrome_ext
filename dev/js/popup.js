"use strict";

(function ($) {
	// ----------------------------------- Main app ----------------------------------- //
	chrome.storage.sync.tasks = [{
		id: "1",
		title: "First task",
		complated: true,
		order: 1,
		url: "",
		content: "Task description. How can anyone use the Todo app, if this app don't care about just simple thing as a task description?"
	},
	{
		id: "2",
		title: "Smoll",
		complated: false,
		order: 2,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "3",
		title: "It's task have medium head size",
		complated: true,
		order: 3,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "4",
		title: "It's task have Large head size for testing UI on my browser",
		complated: false,
		order: 4,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	},
	{
		id: "5",
		title: "Task with many space                                         ",
		complated: true,
		order: 5,
		url: "",
		content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veniam enim culpa excepturi nostrum fugit temporibus iure sed deserunt necessitatibus. Ipsam quasi, ipsum aliquid illum labore officiis voluptate assumenda laborum."
	}];

	let app = {
		lock: true,

		// ------------------------ Logic for work with tasks ------------------------- //
		Tasks: {
			items: chrome.storage.sync.tasks,

			getAll: function() {
				return this.items || [];
			},
			getBy: function(getBy, value) {
				if (typeof value === "undefined" || value === null ||
				["id", "title", "complated" ,"order", "url"].indexOf(getBy) === -1) {
					return this.items || [];
				} else {
					let bufTasks = [];

					$.each(this.items, function(i, task) {
						if (typeof task[getBy] !== "undefined" && task[getBy] === value) {
							bufTasks.push(task);
						}
					});

					return bufTasks;
				}
			},

			set: function(tasks) {

			},

			add: function(tasks) {

			},

			deleteBy: function(deleteBy, value) {

			},
			delete: function(task) {

			},

			sort: function(tasks, sortBy) {
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
			toHtml: function(tasks) {
				let tasksHtml = [], stateTask = "";

				$.each(tasks, function(i, task) {
					stateTask = (task.complated ? "completed" : "uncompleted");

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
			}
		},
		// ============================================================================ //

		init: function(parent, tasksContainer) {
			let self = this;

			$(parent).on("load", () => {
				self.setIcon("active");
			});

			$(tasksContainer).empty().append(
				self.Tasks.toHtml(
					self.Tasks.sort(
						self.Tasks.getAll(),
						"order"
					)
				)
			);

			self.setWidthСonsiderScroll(tasksContainer);

			self.binds(parent, tasksContainer, () => {
				self.lock = false;
			});
		},

		binds: function(parent, tasksContainer, callback) {
			let self = this;



			callback && callback();
		},

		setWidthСonsiderScroll: function(block) {
			let main = $(".main"),
				list = $(block),
				appHeight = $(".app").css("height").replace(/[a-z]/gi, ""),
				headerHeight = $(".header").css("height").replace(/[a-z]/gi, ""),
				maxHeight = appHeight - 2 * headerHeight;

			console.log(list.height(), maxHeight);

			if (list.height() > maxHeight) {
				main.addClass("main__scroll");
			} else {
				main.removeClass("main__scroll");
			}
		},

		setIcon: function(state) {
			chrome.browserAction.setIcon({
				"path": "../img/ext_icons/" + state + ".png"
			});
		}
	};
	// ================================================================================ //

	app.init(window, ".list");
})(jQuery)