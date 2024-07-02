console.log("Blog JS");

$(document).ready(() => {
    const base_url = "https://portal.artaaustralia.com.au";


    // Your jQuery code that interacts with the DOM goes here
    console.log("Document is ready!");
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('post_id')) {


        const post_id = parseInt(urlParams.get('post_id'));

        if (!isNaN(post_id)) {
            // fetch single post 

            fetch(`${base_url}/api/public/sam/post/${post_id}`)
                .then(r => r.json())
                .then(post => console.log(post))
                .catch(e => console.error(e))


        }

    } else {

    }


});


