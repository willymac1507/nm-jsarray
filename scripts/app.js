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

$('.link--refresh').on('click', async () => {
    const image = $('#main-image');
    image.fadeOut(300);
    setTimeout(() => {
        newImage();
    }, 300);
    
});