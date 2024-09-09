let blogId = decodeURI(location.pathname.split("/").pop());

// Reference to the specific blog document in Firestore
let docRef = db.collection("blogs").doc(blogId);

// Fetch the blog document and set up the editing functionality
docRef.get().then((doc) => {
    if (doc.exists) {
        setupBlog(doc.data());
        setupEditButton(doc.id); 
    } else {
        location.replace("/"); 
    }
});

// Function to populate the blog content in the blog.html page
const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;
    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML += `   --${data.author}`;

    try{
        if(data.author == auth.currentUser.email.split('@')[0]){
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = "inline";
            editBtn.href = `${blogId}/editor`;
        }
    } catch{

    }

    const article = document.querySelector('.article');
    addArticle(article, data.article);
}

// Function to add article content
const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        if (item[0] == '#') {
            let hCount = 0;
            let i = 0;
            while (item[i] == '#') {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } else if (item[0] == "!" && item[1] == "[") {
            let separator;

            for (let i = 0; i <= item.length; i++) {
                if (item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")") {
                    separator = i;
                }
            }

            let alt = item.slice(2, separator);
            let src = item.slice(separator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        } else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}

// Function to setup the edit button
const setupEditButton = (blogId) => {
    const editBtn = document.getElementById('edit-blog-btn');
    editBtn.href = `/editor.html?id=${blogId}`; // Setting the href to editor.html with the blog ID
}