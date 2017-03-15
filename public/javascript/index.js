

$(function(){
	$.ajax({
		method:"GET",
		url:'/getPassword',
		success:setup,
		dataType:'json'
	});
	
	$("#passBox").keypress(function(ev){
		if(ev.which===13){
			console.log($(this).val());
		}
	});
});

const setup = function(data)
{
	$("#service").html("Here is your password for " + data.pw1.service);
	$("#textPass").html(concatPassword(data.pw1.shapes));
}

const concatPassword = function(arr)
{
	let str = "";
	for (var i in arr)
		str+=arr[i];
	console.log(arr);
	return str;
}

/*
this.service = String;
this.allowedAttempts = Number;
this.attempts = Number;
this.givenShapes = Array;
this.receivedShapes = Array;
this.failed = Boolean;
this.loginTime = Number;
*/