(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupNav() {
    var toggle = document.querySelector(".js-nav-toggle");
    var nav = document.querySelector(".js-site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function setupCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".feature-slide"));
    if (slides.length <= 1) return;
    var prev = root.querySelector(".js-carousel-prev");
    var next = root.querySelector(".js-carousel-next");
    var dots = root.querySelector(".js-carousel-dots");
    var index = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    }));

    function render() {
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      if (dots) {
        Array.prototype.slice.call(dots.children).forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }
    }

    if (dots) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "切换到第 " + (i + 1) + " 张");
        dot.addEventListener("click", function () {
          index = i;
          render();
        });
        dots.appendChild(dot);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        index = (index - 1 + slides.length) % slides.length;
        render();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        index = (index + 1) % slides.length;
        render();
      });
    }

    render();
  }

  function setupImageFallbacks() {
    Array.prototype.slice.call(document.querySelectorAll("img")).forEach(function (img) {
      img.addEventListener("error", function () {
        var fallback = img.getAttribute("data-fallback") || "/assets/images/default-cover.png";
        if (img.src.indexOf(fallback) === -1) {
          img.src = fallback;
        }
      });
    });
  }

  function setupContentGallery(gallery) {
    var configuredImages = [];
    for (var i = 1; i <= 6; i += 1) {
      var configured = gallery.getAttribute("data-screenshot-" + i);
      if (configured) configuredImages.push(configured);
    }
    var targetSelector = gallery.getAttribute("data-content-target");
    var content = targetSelector ? document.querySelector(targetSelector) : null;
    var contentImages = content
      ? Array.prototype.slice.call(content.querySelectorAll("img")).map(function (img) {
          return img.currentSrc || img.src;
        }).filter(Boolean)
      : [];
    var imageUrls = configuredImages.length ? configuredImages : contentImages;
    var cover = gallery.getAttribute("data-cover");
    if (!imageUrls.length && cover) imageUrls = [cover];
    if (!imageUrls.length) {
      gallery.style.display = "none";
      return;
    }

    var stage = gallery.querySelector(".detail-gallery__stage");
    var thumbs = gallery.querySelector(".detail-gallery__thumbs");
    var prev = gallery.querySelector(".gallery-btn--prev");
    var next = gallery.querySelector(".gallery-btn--next");
    var index = 0;

    imageUrls.forEach(function (url, i) {
      var slide = document.createElement("div");
      slide.className = "gallery-slide";
      var img = document.createElement("img");
      img.src = url;
      img.alt = "作品截图 " + (i + 1);
      img.setAttribute("data-fallback", gallery.getAttribute("data-fallback") || "/assets/images/default-cover.png");
      img.addEventListener("error", function () {
        img.src = img.getAttribute("data-fallback");
      });
      slide.appendChild(img);
      stage.appendChild(slide);

      var thumb = document.createElement("button");
      thumb.type = "button";
      thumb.setAttribute("aria-label", "查看第 " + (i + 1) + " 张截图");
      var thumbImg = document.createElement("img");
      thumbImg.src = url;
      thumbImg.alt = "";
      thumbImg.setAttribute("data-fallback", gallery.getAttribute("data-fallback") || "/assets/images/default-cover.png");
      thumbImg.addEventListener("error", function () {
        thumbImg.src = thumbImg.getAttribute("data-fallback");
      });
      thumb.appendChild(thumbImg);
      thumb.addEventListener("click", function () {
        index = i;
        render();
      });
      thumbs.appendChild(thumb);
    });

    function render() {
      Array.prototype.slice.call(stage.children).forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      Array.prototype.slice.call(thumbs.children).forEach(function (thumb, i) {
        thumb.classList.toggle("is-active", i === index);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        index = (index - 1 + imageUrls.length) % imageUrls.length;
        render();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        index = (index + 1) % imageUrls.length;
        render();
      });
    }

    render();
  }

  ready(function () {
    setupNav();
    setupImageFallbacks();
    Array.prototype.slice.call(document.querySelectorAll(".js-carousel")).forEach(setupCarousel);
    Array.prototype.slice.call(document.querySelectorAll(".js-content-gallery")).forEach(setupContentGallery);
  });
})();
