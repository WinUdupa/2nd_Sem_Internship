const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
//let db = firebase.firestore();
//let auth = firebase.auth();


let blogId = null;
const urlParams = new URLSearchParams(window.location.search);
blogId = urlParams.get('id');

if (blogId) {
    // We're editing an existing blog
    db.collection("blogs").doc(blogId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            blogTitleField.value = data.title;
            articleField.value = data.article;
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url("${bannerPath}")`;
        }
    });
}


// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;    
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('./upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if (uploadType == "image") {
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        });
    } else {
        alert("Please upload an image file.");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if (articleField.value.length && blogTitleField.value.length) {
        let docName = blogId;
        if (!docName) {
            // Generate an ID for new blog posts
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            docName = '';
            for (let i = 0; i < 4; i++) {
                docName += letters[Math.floor(Math.random() * letters.length)];
            }
            docName = `${blogTitle}-${docName}`;
        }

        let date = new Date();

        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0],
        }).then(() => {
            location.href = `/blog.html?id=${docName}`; // Redirect to the blog page
        }).catch((err) => {
            console.error(err);
        });
    }
});

//checking for user logged in or not
auth.onAuthStateChanged((user) => {
    if (!user) {
        location.replace("/admin"); // Redirect to the login page if not authenticated
    }
});
