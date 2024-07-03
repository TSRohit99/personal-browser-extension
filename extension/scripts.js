document.getElementById('generateBlogButton').addEventListener('click', () => {
  document.getElementById('blogContainer').style.display = 'block';
  document.getElementById('cryptoContainer').style.display = 'none';
  document.getElementById('generatedContent').style.display = 'none';
});

document.getElementById('fetchCryptoButton').addEventListener('click', () => {
  document.getElementById('blogContainer').style.display = 'none';
  document.getElementById('cryptoContainer').style.display = 'block';
  document.getElementById('generatedContent').style.display = 'none';
});

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

  const fetchCryptoDetailsButton = document.getElementById('fetchCryptoDetails');
  const cryptoContainer = document.getElementById('cryptoContainer');
  const fetchCryptoDetailsWINRButton = document.getElementById('fetchCryptoDetailsWINR');

  fetchCryptoDetailsWINRButton.addEventListener('click', ()=> {
    document.getElementById('cryptoAddress').value = "0xd77b108d4f6cefaa0cae9506a934e825becca46e"
  })

  fetchCryptoDetailsButton.addEventListener('click', async function() {
      const cryptoAddress = document.getElementById('cryptoAddress').value;
      if (!cryptoAddress) {
          alert('Please enter a crypto address');
          return;
      }

      const url = `https://personal-browser-extension.onrender.com/token/${cryptoAddress}`;



      try {
          const response = await fetch(url);
          const obj = await response.json();

          if (!obj.error) {
              document.getElementById('sym').textContent = `${obj.symbol}`;
              document.getElementById('price').textContent = `$${obj.price}`;
              document.getElementById('cs').textContent = `${obj.circ_supply}`;
              document.getElementById('ts').textContent = `${obj.totalSupply}`;
              document.getElementById('ms').textContent = `${obj.MAX_SUPPLY}`;
              cryptoContainer.style.display = 'block';
          } else {
            document.getElementById('sym').textContent = "Data not found";
            document.getElementById('price').textContent = "Data not found";
            document.getElementById('cs').textContent = "Data not found";
            document.getElementById('ts').textContent = "Data not found";
            document.getElementById('ms').textContent = "Data not found";
    alert("Data not found");
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  });
});
