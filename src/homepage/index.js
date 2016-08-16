var page = require('page');
var empty = require('empty-element');
var template = require('./template')
var title = require('title');
var request = require('superagent');
var header = require('../header');
// var axios = require('axios');


page('/', header, asyncLoad, function(ctx, next){
	title("Platzigram");
	var main = document.getElementById('main-container');

	empty(main).appendChild(template(ctx.pictures));
})

function loadPics(ctx, next){
	request
	.get('/api/pictures')
	.end(function(err, res){
		if(err) return console.log(err);

		ctx.pictures = res.body;
		next();

	})
}

// function loadPicsAxios(ctx, next){
// 	axios.get('/api/pictures')
// 	.then(function(res){
// 		ctx.pictures = res.data;
// 		next();
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 	})
// }

// function loadPicsFetch(){
// 	fetch('/api/pictures')
// 	.then(function(res){
// 		return res.json();
// 	})
// 	.then(function(pics){
// 		console.log(pics);
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 	});
// }

async function asyncLoad(ctx, next){
	try {
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());
		next();
	} catch (err){
		return console.log(err);
	}
}
