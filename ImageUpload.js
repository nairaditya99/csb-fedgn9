async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image_type", 2);
  formData.append("file", file, "image.jpg");

  console.log("inside uploadImage");
  // Update the headers
  let headers = new Headers();
  let token = sessionStorage.getItem("accessToken");
  headers.append("Authorization", "Bearer " + token);

  console.log("token: " + token);
  console.log("fetching...");
  const response = await fetch("https://api.mumuxiang.cloud/api/upload_image", {
    method: "POST",
    headers: headers,
    body: formData
  });

  console.log("fetching attempted");
  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.message}`);
  }

  const data = await response.json();
  console.log(data);
  console.log(data.data.image_url);
  return data.data.image_url; // replace 'url' with the actual property name in the response that contains the image URL
}

async function trainImages(imageUrls) {
  // Prepare the JSON payload
  const payload = {
    image_url_list: imageUrls
  };

  // Get the token and prepare the headers
  let token = sessionStorage.getItem("accessToken");
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  headers.append("Content-Type", "application/json");

  const response = await fetch("https://api.mumuxiang.cloud/api/train_images", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Image training failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data.message;
}

function displayProgress(message) {
  const progressDiv = document.getElementById("progress-message");
  progressDiv.textContent = message;
}

document
  .getElementById("continue-button")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    // Show the popup

    console.log("before showing popup");
    var popup = document.getElementById("mobius-loader");
    popup.style.display = "block";
    var popup_text = document.getElementById("mobius-info");
    popup_text.textContent = "Uploading your photos...";

    var images = document.querySelectorAll(".img-container img");

    if (images.length < 1) {
      alert("You need to upload 15 images");
      return;
    }

    if (images.length > 15) {
      alert("You have uploaded more than 15 images");
      return;
    }

    var imageUrls = [];

    // upload images
    try {
      console.log("attempting image upload...");
      imageUrls = [];

      for (const img of Array.from(images)) {
        try {
          const url = await uploadImage(img.file);
          imageUrls.push(url);
        } catch (err) {
          console.error(err);
          console.log("Image upload failed");
          popup.style.display = "none";
        }
      }
    } finally {
      console.log("Upload done!");
      popup_text.textContent = "Uploading done!";

      // move on to the next step even if some images failed to upload
      try {
        await trainImages(imageUrls);
        console.log("Training done!");
        popup.style.display = "none";
        window.location.href = "loading.html";
      } catch (error) {
        console.error(error);
      }
    }
  });

document.getElementById("file-upload").addEventListener("change", function (e) {
  if (this.files.length > 15) {
    alert("You can only upload up to 15 files at once");
    this.value = "";
    return;
  }

  document.getElementById("preview").innerHTML = "";
  Array.from(this.files).forEach((file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.file = file; // store the file object for later use
    const container = document.createElement("div");
    container.classList.add("img-container");
    const close = document.createElement("div");
    close.classList.add("close");
    close.textContent = "X";
    close.addEventListener("click", function () {
      container.remove();
    });
    container.appendChild(img);
    container.appendChild(close);
    document.getElementById("preview").appendChild(container);
  });
});
