$(function () {
    getImage()
        .then((url) => {
            $('#main-image').attr('src', url)
        })
        .then(() => {
            $('#main-image').load(window.location.href + " #main-image");
        })
        .then(() => {
            $('#main-image').fadeIn()
        });
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
        .then(data => {return data.url} )
        .catch(error => console.log('Something went wrong!', error));
    return randomImage;
}

