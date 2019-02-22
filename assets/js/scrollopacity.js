var $headline = $('.intro-copy'),
    $inner = $('.intro-inner'),
    navHeight = 50;

$(window).scroll(function() {
  var scrollTop = $(this).scrollTop(),
      headlineHeight = $headline.outerHeight() - navHeight;

  $headline.css({
    'opacity': (0.2 + scrollTop / headlineHeight)
  });
  $inner.children().css({
    'transform': 'translateY('+ scrollTop * 0.4 +'px)'
  });
});
