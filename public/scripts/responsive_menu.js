const dropDownButton = document.getElementById('drop-down-button')
dropDownButton.addEventListener('click', function() {
    if(document.getElementById('left-menu').style.display == "flex"){
      document.getElementById('left-menu').style.display="none";
    }else{
      document.getElementById('left-menu').style.display="flex";
    }
      
});

window.addEventListener('load', function() {
  var scrollPosition = localStorage.getItem('scrollPosition');
  if (scrollPosition) {
    showcaseCounter();
    this.setTimeout(function(){
      smoothScrollTo(0, scrollPosition);
      localStorage.removeItem('scrollPosition');
    },500);
    
  }
});


window.addEventListener('beforeunload', function() {
  localStorage.setItem('scrollPosition', window.pageYOffset);
});


window.addEventListener('unload', function() {
  fetch('/cart/save-scroll', {
    method: 'POST',
    body: JSON.stringify({ scrollPosition: window.pageYOffset }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
});


function smoothScrollTo(x, y) {
  window.scrollTo({
    top: y,
    left: x,
    behavior: 'smooth'
  });
}

function showcaseCounter() {
  var cartCount = document.getElementById('cart-count');
  cartCount.classList.toggle('blinking');
  setTimeout(function() {
    cartCount.classList.remove('blinking');
  }, 200);
}
