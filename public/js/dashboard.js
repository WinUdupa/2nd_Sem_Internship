// Initialize FirebaseUI Auth
let ui = new firebaseui.auth.AuthUI(auth);

// Target the blog section
const blogSection = document.querySelector('.blogs-section');

// Setup FirebaseUI login button
const setupLoginButton = () => {
    ui.start("#loginUI", {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectURL) {
                login.style.display = "none";
                return false; // Prevents redirect.
            }
        },
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
    });
};

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, hide the login UI and fetch user blogs
        document.querySelector('.login').style.display = "none";
        getUserWrittenBlogs(); // Fetch and display the user's blogs after login
    } else {
        // No user is signed in, show the login UI
        document.querySelector('.login').style.display = "flex";
        setupLoginButton();
    }
});

// Fetch user-written blogs from Firestore
const getUserWrittenBlogs = () => {
    console.log("Fetching blogs for user:", auth.currentUser.email.split('@')[0]);
    db.collection("blogs").where("author", "==", auth.currentUser.email.split('@')[0])
    .get()
    .then((blogs) => {
        if (blogs.empty) {
            blogSection.innerHTML = "<p>No blogs found. Start writing your first blog!</p>";
        } else {
            blogs.forEach((blog) => {
                console.log("Blog found:", blog.data());
                createBlog(blog);
            });
        }
    })
    .catch((error) => {
        console.log("Error getting the blogs:", error);
    });
}

// Create and display a blog card
const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
        <a href="/editor.html?id=${blog.id}" class="btn grey">edit</a>
        <a href="#" onclick="deleteBlog('${blog.id}')" class="btn danger">delete</a>
    </div>
    `;
}

// Delete a blog from Firestore
const deleteBlog = (id) => {
    db.collection("blogs").doc(id).delete().then(() => {
        location.reload();
    })
    .catch((error) => {
        console.log("Error in deleting the blog:", error);
    });
}
