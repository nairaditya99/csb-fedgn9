async function generateImages(
  imageCount,
  prompt,
  categories,
  promptImageId,
  templateImageId
) {
  // Prepare the JSON payload
  const payload = {
    image_count: imageCount, // 1-4
    prompt: prompt, // Freeflow prompt
    categories: categories, // Category prompt
    prompt_image_id: promptImageId, // Image prompt - from user upload
    template_image_id: templateImageId // Image prompt - from template library
  };

  // Get the token and prepare the headers
  let token = sessionStorage.getItem("accessToken");
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  headers.append("Content-Type", "application/json");

  // Send the POST request
  const response = await fetch(
    "https://api.mumuxiang.cloud/api/generate_images",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    }
  );

  // Check for HTTP errors
  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  // Get the response data
  const data = await response.json();
  console.log(data);
  return data;
}

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
  console.log(data.data.image_id);
  return data.data.image_id; // return image_id instead of url
}

document
  .getElementById("continue-button")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    console.log("continue clicked");

    let categories = {
      clothing: document.getElementById("input-clothing").value,
      hair: document.getElementById("input-hair").value,
      posture: document.getElementById("input-posture").value,
      background: document.getElementById("input-background").value,
      accessories: document.getElementById("input-accessories").value
    };

    let promptImageId = ""; // ID of an uploaded image
    let templateImageId = ""; // ID of a template image
    let prompt = document.getElementById("input-freeflow").value;

    let inputImage = document.getElementById("input-image");
    let uploadedFile = inputImage.files[0];

    if (!uploadedFile) {
      //alert("Please select a file!");
      //return;
    } else {
      // Check if the selected file is an image
      if (!uploadedFile.type.startsWith("image/")) {
        alert("Your reference prompt image must be an image file");
        return;
      }

      // Call the function to upload the image

      uploadImage(uploadedFile)
        .then((imageID) => {
          promptImageId = imageID;
        })
        .catch((error) => {
          console.error(
            `An error occurred while uploading the image: ${error.message}`
          );
        });
    }

    generateImages(4, prompt, categories, promptImageId, templateImageId)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  });
