console.log("Blog JS");
blog_js_config = {
    base_url: "https://portal.artaaustralia.com.au",
    Jdate_settings: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    no_of_recent_posts: 3,
    blog_link: 'blog-fa.html?post_id=',
    img_src_base: 'https://portal.artaaustralia.com.au/sam/gallery/'
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

    // fetch recent posts 

    function generateRecentPostDisplay(p) {
        return `   <div class="recent-single-post">
                                            <div class="post-img">
                                                <a href="${blog_js_config.blog_link}${p.id}">
                                                    <img crossorigin="anonymous" 
                                                    src="${blog_js_config.img_src_base}${p.featured_image}" alt="">
                                                </a>
                                            </div>
                                            <div class="pst-content">
                                                <p>
                                                <a href="${blog_js_config.blog_link}${p.id}">${p.title}</a>
                                                </p>
                                                <span class="date-type">
                                                   ${new Date(p.published_at).toLocaleDateString("fa-IR", blog_js_config.Jdate_settings)}</span>
                                            </div>
                                        </div>`;
    }


    fetch(`${blog_js_config.base_url}/api/sam/posts/`)
        .then(r => r.json())
        .then(j => j.slice(0, blog_js_config.no_of_recent_posts))
        .then(posts => {
            console.log(posts[0]);
            posts.forEach(post => {
                $("#recent_posts_container").append(generateRecentPostDisplay(post))
            })
        })
        .catch()


});

function parseHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.innerHTML; // Access parsed HTML content
}

function parseEscapedHtml(text) {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = text;
    return tempEl.textContent;
}
function generatePost(p) {
    let post = {
        published_at: new Date(p.published_at)
            .toLocaleDateString("fa-IR", blog_js_config.Jdate_settings),
        featured_image: `${blog_js_config.base_url}/sam/gallery/${p.featured_image}` || `img/blog/b${Math.floor(Math.random() * 6) + 1}.jpg`,
        content: parseHTML(parseEscapedHtml(p.content)),
        title: p.title

    };

    return `<article class="blog-post-wrapper">
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
                                    <h4>${post.title}</h4>
                                    <div class="post-text">${post.content}</div>
                                </div>
                            </div>
                        </article>`
}