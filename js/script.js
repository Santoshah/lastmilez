// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// ctx.fillStyle = "#FF0000";
// ctx.fillRect(0,0,150,75);


/* DOM is ready. */
$(document).ready(function(){                
  // loadGoogleMap(); 


  $('a[href*=#]:not([href=#])').click(function()
  {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
      || location.hostname == this.hostname)
    {
      var target = $(this.hash),
      // headerHeight = $(".primary-header").height() + 5; // Get fixed header height
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length)
      {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, 1500);
        return false;
      }
    }
  });               
});

var navss = $('#navss').offset().top;
$(window).scroll(function(){    
    if ($(this).scrollTop() > navss + 75){ 
        $('#navss').addClass('navbar-fixed-topp'); 
    }
    else{
        $('#navss').removeClass('navbar-fixed-topp');
    }
});