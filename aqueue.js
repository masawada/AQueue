/*
#AQueue.js
#Version 0.1.2 beta
#By Masashi Wada(http://masawada.info/)
#In Aug 2nd, 2010
#Copyright (C) 2010 Masashi Wada All Rights Reserved.
#Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

var AQueue = function(callback, errback){
	var Class = arguments.callee;
	if (!(this instanceof Class)) return new Class(callback, errback);
	this.callback = callback || null;
	this.errback = errback || null;
	this.functions = [];
	this.memcount = 0;
	this.next = -1;
	this.returned = [];
	this.status = 'not_running';
}

AQueue.prototype = {
	regist: function(functions){
		if(functions){
			for(var i = 0; i < functions.length; i++){
				this.functions.push(functions[i]);
			}
		}
	}
	,
	exec: function(){
		if(this.status === 'not_running'){
			this.next = 0;
			this.status = 'running';
			this._call();
		}
	}
	,
	add: function(action){
		this.regist([action]);
		if(this.next == -1) this.next = 0;
		if(this.status = 'not_running'){
			this.status = 'running';
			this._call();
		}
	}
	,
	_call: function(){
		while(this.status === 'running'){
			if(typeof this.functions[this.next] === 'function' && this.next < this.functions.length){
				try{
					this.counter=0;
					this.functions[this.next++].call(this);
				}catch(e){
					this.abort(e.message);
				}
			}else if(typeof this.functions[this.next] === 'undefined' && this.next >= this.functions.length){
				this.finish();
			}else{
				this.next++;
			}
		}
	}
	,
	resume: function(label, obj){
		if(this.status === 'endfunc'){
			if(label && obj) this.returned[label] = obj;
			this.status = 'running';
			this._call();
		}
	}
	,
	endfunc: function(){
		if(this.status === 'running') this.status = 'endfunc';
	}
	,
	retain: function(){
		this.counter++;
	}
	,
	release: function(label, obj){
		if(label && obj) this.returned[label] = obj;
		this.counter--;
		if(this.counter==0) this.resume();
	}
	,
	finish: function(){
		this.status = 'not_running';
		if(this.callback) this.callback(this.ctx);
	}
	,
	abort: function(message){
		this.status = 'aborted';
		if(this.errback) this.errback(message, this.ctx);
	}
	,
	format: function(callback,errback){
		this.callback = callback || null;
		this.errback = errback || null;
		this.functions = [];
		this.memcount = 0;
		this.next = -1;
		this.returned = [];
		this.status = 'not_running';
	}
	,
	returnstat: function(){
		return this.status;
	}
}