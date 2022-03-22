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
            image.fadeIn('slow');
        });
}

function saveEmail(address) {
    if (emailValid) {
        $('.input__validation').removeClass('valid').addClass('invalid');
        const url = $('#main-image').attr('src');
        appendStorage(address, url);
        $('#email__input').val('');
        $('.save__slider').slideToggle(250);
        $('.img__container').toggleClass('slid');
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
    $('.colls__content').empty();
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

let emailAddress = '';
let emailValid = false;

$('.link--refresh').on('click', async () => {
    refreshImage();
});

$('.link--like').on('click', () => {
    $('.save__slider').slideToggle(250);
    $('.img__container').toggleClass('slid');
});

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

$('#email__input').on('keyup', () => {
    const pattern = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i);
    emailAddress = $('#email__input').val();
    if (pattern.test(emailAddress)) {
        $('.input__validation').removeClass('invalid').addClass('valid');
        emailValid = true;
    } else {
        $('.input__validation').removeClass('valid').addClass('invalid');
    }
})

$('.save__button').on('click', () => {
    saveEmail(emailAddress);
})

$('.colls__content').on('click', (e) => {
    const imgSource = e.target.src;
    const modalImage = $('#modal__image');
    const modalContainer = $('.colls__modal');
    const overlay = $('.colls__overlay');
    if (imgSource) {
        modalImage.attr('src', e.target.src).fadeIn(500);
        modalContainer.removeClass('make--hidden').addClass('make--visible');
        overlay.fadeIn(500);
    };
})

$('#modal__image').on('click', () => {
    const modalImage = $('#modal__image');
    const overlay = $('.colls__overlay');
    modalImage.fadeOut(500);
    overlay.fadeOut(500);
    setTimeout(() => {
        $('.colls__modal').removeClass('make--visible').addClass('make--hidden');
        $('#modal__image').removeAttr('src');
    }, 700);    
})