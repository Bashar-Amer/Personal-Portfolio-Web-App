(function ($) {
  "use strict";

  //Run function When Document Ready
  $(document).ready(function () {
    initTooltip();
    initGetHWindow();
    initParallax();
    initNavbarSrcoll();
    initClickedEvents();
    initTyped();
    initBtnFile();
    initHold();
    initAjaxContactForm();
    initAjaxUploader();
  });

  //Run function When PACE (page loader) hide
  Pace.on('hide', function () {
    $('.wrapper').css('visibility', 'visible').animate({ opacity: 1.0 }, 2000, function () {
      initCheckNav();
    });
    //check if url contain hash(#)
    if (window.location.hash) {
      $('.link-inpage[href="' + window.location.hash + '"]').first().trigger('click');
    }
  });

  //Run function When WIndow Resize
  $(window).resize(function () {
    initParallax();
  });

  // ajax contact form
  function initAjaxContactForm() {
    if ($('#contactForm').length > 0) {

      $('#contactForm').validate();
      $('#contactForm').submit(function (e) {
        e.preventDefault();

        var form = $(this);
        if (typeof form.valid === 'function' && form.valid()) {
          var $btn = $(form).find('button');
          $btn.prop('disabled', true).text('Sending...');

          // Convert FormData to a plain object
          var formDataObj = {};
          $(form).serializeArray().forEach(function (item) {
            formDataObj[item.name] = item.value;
          });

          $.ajax({
            type: 'POST',
            url: 'https://api.web3forms.com/submit',
            contentType: 'application/json',
            dataType: 'json',

            beforeSend: function () {
              form.find('.preload-submit').removeClass('hidden');
              form.find('.message-submit').addClass('hidden');
            },

            data: JSON.stringify(formDataObj),
            success: function (data) {
              console.log(data);

              setTimeout(function () {
                form.find('.preload-submit').addClass('hidden');
                if (data.success) {
                  form.find('.message-submit').html('Thank you! Your message has been sent.').removeClass('hidden');
                  form[0].reset();
                }
                else {
                  form.find('.message-submit').html(data.message || 'Something went wrong.').removeClass('hidden');
                }
              }, 1000)
            },
            error: function () {
              form.find('.message-submit').html("Network error. Please try again.").removeClass('hidden');
            },
            complete: function () {
              $btn.prop('disabled', false).text('Send Message');
            }
          });
        }
        return false;
      });


    }
  }

  // ajax Uploader file
  function initAjaxUploader() {
    if ($('#upload-btn').length > 0) {

      var btn = document.getElementById('upload-btn'),
        wrap = document.getElementById('pic-progress-wrap'),
        picBox = document.getElementById('picbox'),
        errBox = document.getElementById('errormsg');

      var uploader = new ss.SimpleUpload({
        button: btn,
        url: 'php/upload.php',
        progressUrl: 'assets/plugins/Simple-Ajax-Uploader/extras/uploadProgress.php',
        name: 'fileatt',
        multiple: false,
        maxUploads: 2,
        maxSize: 200,
        queue: false,
        allowedExtensions: ['pdf'],
        debug: true, hoverClass: 'btn-hover',
        focusClass: 'active',
        disabledClass: 'disabled',
        responseType: 'json',
        onSubmit: function (filename, ext) {
          var prog = document.createElement('div'),
            outer = document.createElement('div'),
            bar = document.createElement('div'),
            size = document.createElement('div'),
            self = this;
          prog.className = 'prog';
          size.className = 'size';
          outer.className = 'progress';
          bar.className = 'bar';

          outer.appendChild(bar);
          prog.appendChild(size);
          prog.appendChild(outer);
          wrap.appendChild(prog); // 'wrap' is an element on the page

          self.setProgressBar(bar);
          self.setProgressContainer(prog);
          self.setFileSizeBox(size);

          errBox.innerHTML = '';
        },
        onSizeError: function (filename, fileSize) {
          errBox.innerHTML = 'Max size 200K';
        },
        onExtError: function (filename, extension) {
          errBox.innerHTML = "File extension not permitted";
        },
        onError: function (filename, errorType, status, statusText, response, uploadBtn) {
          errBox.innerHTML = statusText;
        },
        onComplete: function (file, response) {
          if (!response) {
            errBox.innerHTML = 'Unable to upload file';
          }
          if (response.success === true) {
            picBox.innerHTML = '<i class="fa fa-file-pdf-o"></i> &nbsp;' + response.file;
            $('#file-att').val(response.file);
          } else {
            if (response.msg) {
              errBox.innerHTML = response.msg;
            } else {
              errBox.innerHTML = 'Unable to upload file';
            }
          }
        }
      });
    }
  }

  //Typed Animation
  function initTyped() {
    $("#typed").typed({
      strings: ["Computer Engineer", "Full Stack Developer", ".NET Developer"],
      // typing speed
      typeSpeed: 70,
      // time before typing starts
      startDelay: 100,
      // backspacing speed
      backSpeed: 30,
      // time before backspacing
      backDelay: 500,
      // loop
      loop: true,
      // false = infinite
      loopCount: false,
      // show cursor
      showCursor: true,
      // character for cursor
      cursorChar: ".",
      // attribute to type (null == text)
      attr: null,
      // either html or text
      contentType: 'html',
      // call when done callback function
      callback: function () {
      },
      // starting callback function before each string
      preStringTyped: function () {
      },
      //callback for every typed string
      onStringTyped: function () {
      },
      // callback for reset
      resetCallback: function () {
      }
    });
  }

  //Click Envents
  function initClickedEvents() {

    $('.back-to-top').click(function () {
      $('html, body').stop().animate({
        'scrollTop': 0
      }, 1500, 'easeInOutExpo', function () {
      });
      return false;
    });

    $('.link-inpage').click(function (e) {
      var target = this.hash, $target = $(target);
      $('html, body').stop().animate({
        'scrollTop': $target.offset().top - ($('.menu-area').outerHeight() - 1)
      }, 1500, 'easeInOutExpo', function () {
        //window.location.hash = target;
      });
      return false;
    });

    $('.copy-email-btn').on('click', async function () {
      const email = $(this).data('email');

      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy email');
      }
    });

  }

  //Navbar Scroll
  function initNavbarSrcoll() {
    if ($('.main-header').length > 0) {
      var mainbottom = $('.main-header').offset().top + $('.main-header').height();
      $(window).on('scroll', function () {
        var stopWindow = Math.round($(window).scrollTop()) + $('.menu-area').outerHeight();
        conditionNavbar(stopWindow, mainbottom);
      });
    }
  }

  //Check Navar Show
  function initCheckNav() {
    if ($('.main-header').length > 0) {
      var mainbottom = $('.main-header').offset().top + $('.main-header').height();
      var stopWindow = Math.round($(window).scrollTop()) + $('.menu-area').outerHeight();
      conditionNavbar(stopWindow, mainbottom);
    }
  }

  //Condition Navbar
  function conditionNavbar(stopWindow, mainbottom) {
    if (stopWindow > mainbottom) {
      $('.menu-area').addClass('nav-fixed');
    } else {
      $('.menu-area').removeClass('nav-fixed nav-white-bg');
    }
    if ((stopWindow) > $('.menu-area').outerHeight()) {
      $('.menu-area').addClass('nav-white-bg');
    }
  }

  //Bg Parallax
  function initParallax() {
    $('.parallax-bg').each(function () {
      $(this).parallax("50%", 0.3);
    });
  }

  //Set header to window
  function initGetHWindow() {
    var wHeight = $(window).height();
    if (wHeight > 600 && !$('.main-header').hasClass('no-window')) {
      $('.main-header, .header-content-fixed').height(wHeight);
    }
  }


  function initHold() {
    $('[data-holdwidth]').each(function (index, el) {
      var width = $(el).data('holdwidth');
      $(el).css('width', width);
    });
    $('[data-holdbg]').each(function (index, el) {
      var bg = $(el).data('holdbg');
      $(el).css('background-image', 'url(' + bg + ')');
    });
  }

  //Tooltip Bootrapt
  function initTooltip() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  //Tigger Custom Btn FIle
  function initBtnFile() {
    $(document).on('change', '.btn-file :file', function () {
      var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
    });

    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
      var input = $(this).parents('.input-group').find(':text'),
        log = numFiles > 1 ? numFiles + ' files selected' : label;
      if (input.length) {
        input.val(log);
      } else {
        if (log) {
          console.log(log);
        }
      }
    });
  }

  function showToast(message) {
    const $toast = $('#toast');
    let toastTimeout;
    if (!$toast.length) return;
    $toast.text(message).addClass('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      $toast.removeClass('show');
    }, 2500);
  }

})(jQuery);
