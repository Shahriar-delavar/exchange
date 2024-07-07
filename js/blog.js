console.log("Blog JS");

blog_js_config = {
    base_url: "https://portal.artaaustralia.com.au",
    Jdate_settings: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
};

$(document).ready(() => {
    // Your jQuery code that interacts with the DOM goes here
    console.log("Document is ready!");
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('post_id')) {
        const post_id = parseInt(urlParams.get('post_id'));
        if (!isNaN(post_id)) {
            $("#blog_post_container").html("");
            fetch(`${blog_js_config.base_url}/api/public/sam/post/${post_id}`)
                .then(r => r.json())
                .then(post => {
                    $("#blog_post_container").html(generatePost(post));
                })
                .catch(e => console.error(e))
        }

    } else {

    }
});


function generatePost(p) {
    let post = {
        published_at: new Date(p.published_at)
            .toLocaleDateString("fa-IR", blog_js_config.Jdate_settings),
        featured_image: `${blog_js_config.base_url}/sam/gallery/${p.featured_image}` || `img/blog/b${Math.floor(Math.random() * 6) + 1}.jpg`,
    };

    return `  <article class="blog-post-wrapper">
                            <div class="blog-banner">
                                <a href="blog-details.html#" class="blog-images">
                                    <img crossorigin="anonymous" src="${post.featured_image}" alt="">
                                </a>
                                <div class="blog-content">
                                    <div class="blog-meta">
                                        <span class="admin-type">
                                            <i class="fa fa-user"></i>
                                            Admin
                                        </span>
                                        <span class="date-type persian">
                                           <i class="fa fa-calendar"></i>
                                           ${post.published_at}                                      
                                        </span>                                       
                                    </div>
                                    <h4>multipol is an firm and general group</h4>
                                    <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself,</p>
                                    <blockquote>
                                        <p>Consultations are slowly gaining immense recognition and are growing phenomenally with more and more people trading with this digital currency. The universal acceptance of Consultation.</p>
                                    </blockquote>							
                                    <p> because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.</p>
                                    <h5>With more and more people trading with this digital </h5>
                                    <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
                                    <div class="img-blog left-blog-img">
                                        <img src="img/blog/b3.jpg" alt="">
                                    </div>
                                    <div class="img-blog right-blog-img">
                                        <img src="img/blog/b4.jpg" alt="">
                                    </div>
                                    <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
                                </div>
                            </div>
                        </article>`
}