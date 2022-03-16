$(function () {
    newImage();


})

async function getImage() {
    // const randomImage = fetch('https://api.unsplash.com/photos/random',
    //     {
    //         headers: {
    //         'Authorization': 'Client-ID aIc2pY_DyFNB87sgN8IKVDDSd1dRohP8uNFanNcEeIc'
    //     }
    // })
    const randomImage = fetch('https://picsum.photos/1000')
        // .then(response => response.json())
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
        const url = $('#main-image').attr('src');
        console.log(address, url);
        $('#email__input').val('');
        $('.save__slider').slideToggle(250);
        $('.img__container').toggleClass('slid');
        const image = $('#main-image');
        image.fadeOut(300);
        setTimeout(() => {
            newImage();
        }, 300);
    } else {
        console.log('bah!')
    }

}

let emailAddress = '';
let emailValid = false;

$('.link--refresh').on('click', async () => {
    const image = $('#main-image');
    image.fadeOut(300);
    setTimeout(() => {
        newImage();
    }, 300);

});

$('.link--like').on('click', () => {
    $('.save__slider').slideToggle(250);
    $('.img__container').toggleClass('slid');
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