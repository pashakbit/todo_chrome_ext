
"use strict";(function($){chrome.storage.sync.tasks=[{id:"1",title:"First task",complated:true,order:1,url:""}];let app={lock:true,Tasks:{items:chrome.storage.sync.tasks,getAll:function(){return this.items||[];},getBy:function(getBy,value){if(typeof value==="undefined"||value===null||["id","title","complated","order","url"].indexOf(getBy)===-1){return this.items||[];}else{let bufTasks=[];$.each(this.items,function(i,task){if(typeof task[getBy]!=="undefined"&&task[getBy]===value){bufTasks.push(task);}});return bufTasks;}},set:function(tasks){},add:function(tasks){},deleteBy:function(deleteBy,value){},delete:function(task){},sort:function(tasks,sortBy){if(tasks.length){if(typeof tasks[0][sortBy]==="number"){tasks.sort((task1,task2)=>{return task1[sortBy]-task2[sortBy];});}else{tasks.sort();}}
return tasks;},toHtml:function(tasks){let tasksHtml=[],stateTask="";$.each(tasks,function(i,task){stateTask=(task.complated?"completed":"uncompleted");tasksHtml.push(["<li class='item'>","<img class='item__completed' src='../img/",stateTask,".png' title='Task is ",stateTask,"'>","<a class='item__head' href='",task.url,"' target='_blank'>",task.title,"</a>","<div class='item__content'>",task.content,"</div>","</li>"].join(""));});return tasksHtml.join("");}},init:function(parent,tasksContainer){let self=this;$(parent).on("load",()=>{self.setIcon("active");});$(tasksContainer).empty().append(self.Tasks.toHtml(self.Tasks.sort(self.Tasks.getAll(),"order")));self.binds(parent,tasksContainer,()=>{self.lock=false;});},binds:function(parent,tasksContainer,callback){let self=this;callback&&callback();},setIcon:function(state){chrome.browserAction.setIcon({"path":"../img/ext_icons/"+state+".png"});}};app.init(window,".list");})(jQuery)