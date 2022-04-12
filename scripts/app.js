$(function () {
    newImage();
    $('.colls__container').css('display', 'none');
})

async function getImage() {
    const randomImage = fetch('https://picsum.photos/1000')
        .then(data => {
            return data.url
        })
        .catch(error => console.log('Something went wrong!', error));
    return randomImage;
}

async function fadeImage(image) {
    if ($('#main-image:visible')) {
        $('#main-image').fadeOut();
        setTimeout(500);
    }
}

async function newImage() {
    const image = $('#main-image');
    getImage()
        .then((url) => {
            image.attr('src', url);
        })
        .then(() => {
            image.load(window.location.href + " #main-image");
        })
        .then(() => {
            image.fadeIn('slow')
        })
        .then(aspectRatio());
}

function saveEmail(address) {
    if (emailValid) {
        $('.input__validation').removeClass('valid').removeClass('invalid');
        emailValid = false;
        const url = $('#main-image').attr('src');
        appendStorage(address, url);
        $('#email__input').val('');
        showLike();
        refreshImage();
    }
}

function appendStorage(email, url) {
    let colls = getJSON('colls');
    if (colls) {
        let collections = colls.collections;
        // look for email in array
        let existingEmail = collections.find(o => o.email === email);
        // if email exists, append url to urls array
        if (!existingEmail) {
            let newEmail = {
                email: email,
                urls: [{
                    url: url
                }]
            };
            collections.push(newEmail);
        } else {
            let newUrl = {
                url: url
            };
            collections.find(o => o.email === email).urls.push(newUrl);
        }
        colls.collections = collections;
        // if email does not exist, append email and urls array to array
    } else {
        colls = {
            collections: [{
                email: email,
                urls: [{
                    url: url
                }]
            }]
        };
    }
    setJSON('colls', colls);
}

function getJSON(data) {
    return JSON.parse(localStorage.getItem(data));
}

function setJSON(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

async function refreshImage() {
    const image = $('#main-image');
    image.fadeOut(300);
    setTimeout(() => {
        newImage();
    }, 300);
}

function showGallery() {
    $('.colls__content').empty().append('<h3 class="content__title">Click an email to expand</h3>');
    const colls = getJSON('colls');
    if (colls) {
        collections = colls.collections;
        collections.map((element) => {
            urls = element.urls;
            let urlList = '';
            urls.map((url) => {
                urlList += `<img src=${url.url} class='gallery__thumb'>`
            });
            $('.colls__content')
                .append(`<div class='gallery__container'><h2 class='gallery__title'>${element.email}</h2><ul class='gallery__thumbnails'>${urlList}</ul></div>`);
        });
    }
}

function showLike() {
    $('.links__text').not(':nth-child(1)').fadeToggle(300);
    $('.save__slider').slideToggle(250);
    $('.img__container').toggleClass('slid');
}

async function aspectRatio() {
    const mainImage = $('#main-image');
    const imageContainer = $('.img__container')
    if (imageContainer.width() < imageContainer.height()) {
        mainImage.removeClass('narrow');
    } else if (mainImage.height() < imageContainer.width()) {
        mainImage.addClass('narrow');
    }
}

let emailAddress = '';
let emailValid = false;

$('.link--refresh').on('click', async () => {
    refreshImage();
});

$('.link--like').on('click', () => {
    showLike();
});

$('.cancel__button').on('click', () => {
    $('#email__input').val('');
    $('.input__validation, .input__container, .save__text').removeClass('invalid').removeClass('valid');
    showLike();
})

// open collections view
$('.link--view').on('click', () => {
    const colls = getJSON('colls');
    if (colls) {
        $('.links__text').not(':nth-child(3)').fadeToggle(300);
        $('.main__slider').toggle('blind', {
            direction: 'down'
        }, 400);
        $('.colls__container').toggle('blind', {
            direction: 'up'
        }, 400, () => {
            $('.link--view span').toggleClass('view--text').toggleClass('hide--text');

            showGallery();
        });
    } else {
        $('.links__text').not(':nth-child(3)').fadeToggle(300);
        $('.empty__slider').slideToggle(250);
        $('.img__container').toggleClass('slid');
        $('.link--view span').toggleClass('view--text').toggleClass('hide--text');

    }
})

// email validation
$('#email__input').on('keyup', () => {
    const pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    emailAddress = $('#email__input').val();
    if (emailAddress.length === 0) {
        $('.input__validation, .input__container, .save__text').removeClass('invalid').removeClass('valid');
    } else {
        if (pattern.test(emailAddress)) {
            $('.input__validation, .input__container, .save__text').removeClass('invalid').addClass('valid');
            emailValid = true;
        } else {
            $('.input__validation, .input__container, .save__text').removeClass('valid').addClass('invalid');
            emailValid = false;
        }
    }
})

// save button functionality
$('.save__button').on('click', () => {
    saveEmail(emailAddress);
})


$('.colls__content').on('click', (e) => {

    const target = $(e.target);
    if (target.is('img')) {
        // show modal version of image and overlay on click of thumbnail
        const portrait = (window.innerHeight > window.innerWidth) ? true : false;
        const imgSource = e.target.src;
        const modalImage = $('#modal__image');
        let modalShift = '';
        if (portrait) {
            const modalHeight = (($(window).width() / 2) - 10);
            modalShift = `calc(50% - ${modalHeight}px)`;
        } else {
            const modalWidth = (($(window).height() / 2) - 10);
            modalShift = `calc(50% - ${modalWidth}px)`;
        }
        const modalContainer = $('.colls__modal');
        const overlay = $('.colls__overlay');
        if (imgSource) {
            modalImage.attr('src', e.target.src).fadeIn(500);
            modalContainer.removeClass('make--hidden').addClass('make--visible');
            if (portrait) {
                modalContainer.css('top', modalShift)
            } else {
                modalContainer.css('left', modalShift)
            }
            overlay.fadeIn(500);
        };

    } else if (target.is('h2')) {
        // expand collection when email address clicked
        const accord = target.next();
        if (accord.is(':visible')) {
            // close the current gallery
            accord.slideToggle({
                duration: 400,
                start: function () {
                    accord.css('display', 'flex');
                }
            });
        } else {
            //check for already open galleries and close
            const openAccord = ($('.gallery__thumbnails:visible'));
            if (openAccord.length > 0) {
                for (let i = 0; i <= openAccord.length; i++) {
                    $(openAccord[i]).slideToggle(400);
                }
            }
            // open the required gallery
            accord.slideToggle({
                duration: 400,
                start: function () {
                    accord.css('display', 'flex');
                }
            });
        }
    }
})


// close modal image and overlay on click
$('#modal__image').on('click', () => {
    const modalImage = $('#modal__image');
    const overlay = $('.colls__overlay');
    modalImage.fadeOut(500);
    overlay.fadeOut(500);
    setTimeout(() => {
        $('.colls__modal').removeClass('make--visible').addClass('make--hidden').removeAttr('style');
        $('#modal__image').removeAttr('src');
    }, 700);
})



// ensure main image fills image container on screen resize
$(window)
    .on('resize', () => {
        aspectRatio();
    })
    .on('load', () => {
        aspectRatio();
    })