  //sets up Materialize's datepicker 
  // $('.datepicker').pickadate({
  //   selectMonths: true, // Creates a dropdown to control month
  //   selectYears: 15 // Creates a dropdown of 15 years to control year
  // });

  $(function() {
  	$('.ajaxError').hide();
  	$(".ajaxButton").click(function() {
  		$('.ajaxError').hide();
  		var name = $('#showName').val();
  		console.log("no name");
  		if(name == '') {
  			$('ajaxError').show();
  			$('ajaxError').focus();
  			return false;
  		}
  	});
  });