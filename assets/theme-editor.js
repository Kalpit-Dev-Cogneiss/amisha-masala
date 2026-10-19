setTimeout(function () {
  fc_change();
}, 500)

function fc_change() {

  const colorSwatches = document.querySelectorAll(".html_color_names");

  colorSwatches.forEach((swatch) => {
    const hoverImage = swatch.getAttribute("data-image-hover");
    if (hoverImage) {
      const img = new Image();
      img.src = hoverImage;
    }
  });

  colorSwatches.forEach((swatch) => {
    const card = swatch.closest(".product-variable");
    if (!card) return;

    const mainImageContainer = card.querySelector(".card-img-top");
    if (!mainImageContainer) return;

    const firstImage = mainImageContainer.querySelector("img");
    if (!firstImage) return;

    const originalSrc = firstImage.getAttribute("src");

    swatch.addEventListener("mouseenter", function () {
      const hoverImage = swatch.getAttribute("data-image-hover");
      if (hoverImage && hoverImage !== originalSrc) {
        firstImage.setAttribute("src", hoverImage);
        firstImage.removeAttribute("srcset");
      }
    });

    swatch.addEventListener("mouseleave", function () {
      firstImage.setAttribute("src", originalSrc);
      firstImage.removeAttribute("srcset");
    });
  });


}
fc_SwiperSlider_CustomData();
function fc_SwiperSlider_CustomData() {
  var sliderSelector = ".swiper-container",
      dataDefault = {};

  var eachSlider = document.querySelectorAll(sliderSelector);

  [].forEach.call(eachSlider, function (slider, index, arr) {
    var data = slider.getAttribute("data-slide") || {};
    if (data) {
      var dataOptions = JSON.parse(data);
      slider.options = Object.assign({}, dataDefault, dataOptions);
      var swiper = new Swiper(slider, slider.options);
    }
  });
}
fc_ThumbSwiper();
function fc_ThumbSwiper(){
  var sliderSelector = ".swiper-container-pd-thumb",
      dataDefault = {};
  var eachSlider = document.querySelectorAll(sliderSelector);

  [].forEach.call(eachSlider, function (slider, index, arr) {
    var data = slider.getAttribute("data-slide") || {};
    var pd_sync_id = slider.getAttribute("data-swiper-v");
    if (data) {
      var dataOptions = JSON.parse(data);
      var thumbsOptions = dataOptions.thumb;
      var thumbsInit;
      if (thumbsOptions) {
        var thumbImages = slider.querySelectorAll("img");
        var slides = "";
        thumbImages.forEach(function (img) {
          slides +=
              "\n<div class='swiper-slide'>\n<img class='img-fluid' src=".concat(
                  img.src + "&width=246",
                  " alt='image' loading='lazy'/>\n</div>\n"
              );
        });
        var thumbs = document.createElement("div");
        thumbs.setAttribute("class", "swiper js-thumb");
        thumbs.innerHTML = "<div class='swiper-wrapper'>".concat(
            slides,
            "</div>"
        );
        thumbs.insertAdjacentHTML(
            "beforeend",
            '<div class="cs-navigation"><div class="cs-swiper-button cs-swiper-button-prev"><span></span></div><div class="cs-swiper-button cs-swiper-button-next"><span></span></div></div>'
        );
        if (thumbsOptions.parent) {
          var parent = document.querySelector(thumbsOptions.parent);
          parent.parentNode.appendChild(thumbs);
        } else {
          slider.parentNode.appendChild(thumbs);
        }
        thumbsOptions.options = Object.assign(
            {
              navigation: {
                nextEl: thumbs.querySelector(".cs-swiper-button-next"),
                prevEl: thumbs.querySelector(".cs-swiper-button-prev"),
              },
            },
            thumbs,
            thumbsOptions
        );
        thumbsInit = new window.Swiper(thumbs, thumbsOptions.options);
        slider.options = Object.assign(
            {
              thumbs: {
                swiper: thumbsInit,
              },
            },
            dataDefault,
            dataOptions
        );
        var swiper = new Swiper(slider, slider.options);
      } else {
        slider.options = Object.assign({}, dataDefault, dataOptions);
        var swiper = new Swiper(slider, slider.options);
      }
      const syncIdIndex = window.localStorage.getItem(
          `pd_sync_${pd_sync_id}`
      );
      if (syncIdIndex != null) {
        swiper.slideTo(syncIdIndex, 0);
      }
      var height = document.querySelector(".style-vertical .swiper-horizontal");
      if (height) {
        thumbs.style.height = height.offsetHeight + "px";
      }

    }
  });
}

fc_Parallax();
function fc_Parallax() {
  jarallax(document.querySelectorAll('.jarallax'),{
    imgSize: 'object-fit'
  });
}

fc_Compare();
function fc_Compare() {
  const viewers = document.querySelectorAll(".image-compare");
const options = {
  smoothingAmount: 100,
   hoverStart: true
};
  viewers.forEach((element) => {
    let view = new ImageCompare(element).mount();
  });
}
document.addEventListener('mousemove', fc_ParrallaxImages);
function fc_ParrallaxImages(e) {
  var movedX = (e.clientX * -0.3 / 8);
  var movedY = (e.clientY * -0.3 / 8);
  var elements = document.getElementsByClassName('js-parallaxed');

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.transform = 'translate(' + movedX + 'px,' + movedY + 'px)';
  }
}

function handleClickOnDetails() {
  // close all details
  let detailsOpened = document.querySelectorAll(
    ".details-toggle details[open]"
  );

  for (const item of detailsOpened) {
    // keep open only details clicked
    if (this != item) {
      item.removeAttribute("open");
    }
  }
}

fc_Details_toggle();
function fc_Details_toggle() {
  document.addEventListener('click', function (event) {
    const detailsElement = event.target.closest(".details-toggle details");
    if (detailsElement) {
      handleClickOnDetails.call(detailsElement);
    }
  });
}

function handleClickOnDetails() {
  let detailsOpened = document.querySelectorAll(".details-toggle details[open]");
  detailsOpened.forEach(function (item) {
    if (this !== item) {
      item.removeAttribute("open");
    }
  });
}

fc_Aos();
function fc_Aos() {
  AOS.init({
    easing: 'ease',
    duration: 1000,
    once: true
  });
}
fc_Hotspots();
function fc_Hotspots() {
  document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.item-hotspots');

    items.forEach(item => {
      const btn = item.querySelector('.btn-icon-plus');
      const content = item.querySelector('.content-hotspots');
      const closeModalBtn = content.querySelector('.btn-close-modal');

      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        const isActive = item.classList.toggle('active');
        if (isActive) {
          document.body.classList.add('active-overlay');
        } else {
          const anyItemActive = Array.from(items).some(item => item.classList.contains('active'));
          if (!anyItemActive) {
            document.body.classList.remove('active-overlay');
          }
        }
      });

      content.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          item.classList.remove('active');
          document.body.classList.remove('active-overlay');
        });
      }
    });

    document.addEventListener('click', function() {
      items.forEach(item => {
        item.classList.remove('active');
      });
      document.body.classList.remove('active-overlay');
    });
  });
}
fc_Dropdown();
function fc_Dropdown() {
  document.addEventListener('click', function (event) {
    const allDropdowns = document.querySelectorAll('.custom-dropdown');
    const dropdownButtons = document.querySelectorAll('.dropdown-button');

    // Nếu click vào button dropdown, kiểm tra và mở/đóng dropdown tương ứng
    if (event.target.classList.contains('dropdown-button')) {
      const index = [...dropdownButtons].indexOf(event.target);
      const dropdown = allDropdowns[index];

      // Đóng tất cả dropdowns khác
      allDropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('active');
        }
      });

      // Mở/Đóng dropdown hiện tại
      dropdown.classList.toggle('active');
    }

    // Nếu click vào nút đóng dropdown, tắt dropdown tương ứng
    if (event.target.classList.contains('js-close-custom')) {
      const index = [...document.querySelectorAll('.js-close-custom')].indexOf(event.target);
      const dropdown = allDropdowns[index];
      dropdown.classList.remove('active');
      event.stopPropagation(); // Prevents the click from affecting other elements
    }

    // Nếu click ngoài vùng dropdown, tắt tất cả dropdown đang mở
    else if (!event.target.closest('.custom-dropdown') && !event.target.closest('.dropdown-button')) {
      allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}



if (Shopify.designMode) {
  document.addEventListener("shopify:section:load", () => {
    fc_SwiperSlider_CustomData();
    fc_Details_toggle();
    fc_Aos();
    fc_Dropdown();
    fc_Hotspots();
    fc_Parallax();
    fc_Compare();
  });
  document.addEventListener("shopify:section:select", () => {
    fc_SwiperSlider_CustomData();
  });
  document.addEventListener("shopify:section:deselect", () => {
  });
  document.addEventListener("shopify:block:select", () => {
  });
  document.addEventListener("shopify:block:deselect", () => {
  });
  document.addEventListener("shopify:inspector:activate", () => {
  });
  document.addEventListener("shopify:inspector:deactivate", () => {
  });
}

var closebtns = document.getElementsByClassName("js-close");
var i;

for (i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener("click", function () {
    this.parentElement.style.display = "none";
  });
}