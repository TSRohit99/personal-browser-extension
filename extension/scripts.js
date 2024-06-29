async function fetchTokenPrice(tokenId) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data[tokenId].usd;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  }
  
  // Usage
  fetchTokenPrice('winr-protocol').then(price => {
    if (price) {
      document.getElementById('winrPrice').textContent = `$${price}`;
    } else {
      document.getElementById('winrPrice').textContent = 'Price unavailable';
    }
  });


  // button for creating new Blogs though my API

  document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateBlog');
    const blogTopic = document.getElementById('blogTopic');
    const generatedContent = document.getElementById('generatedContent');
    const blogTitle = document.getElementById('blogTitle');
    const blogImages = document.getElementById('blogImages');
    const blogContent = document.getElementById('blogContent');

    generateButton.addEventListener('click', async function() {
        const topic = blogTopic.value;
        if (!topic) {
            alert('Please enter a blog topic');
            return;
        }

        const apiPrefix = "https://personal-browser-extension.onrender.com";

        try {
            const response = await fetch(`${apiPrefix}/generate?topic=${encodeURIComponent(topic)}`);
            const data = await response.json();

            blogTitle.textContent = data.title;
            blogContent.textContent = data.content;

            // Clear previous images
            blogImages.innerHTML = '';
            // Add image descriptions (you might want to style this better)
            data.pictureDescriptions.split('\n').forEach(desc => {
                const p = document.createElement('p');
                p.textContent = desc;
                blogImages.appendChild(p);
            });

            generatedContent.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate blog content. Please try again.');
        }
    });
});