const apiUrl = "travel_recommendation_api.json";

async function fetchRecommendations() {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

function handleSearchWithInput(inputEl) {
  if (!inputEl) return;

  const query = inputEl.value.trim().toLowerCase();
  fetchRecommendations().then((data) => {
    const matches = data.countries.filter(country => 
      country.name.toLowerCase().includes(query)
    );

    const templeMatches = data.temples.filter(temple => 
      temple.name.toLowerCase().includes(query) || 
      temple.description.toLowerCase().includes(query)
    );

    const beachMatches = data.beaches.filter(beach => 
      beach.name.toLowerCase().includes(query) || 
      beach.description.toLowerCase().includes(query)
    );

    // Combine all matches
    const allMatches = [...matches, ...templeMatches, ...beachMatches];
    renderResults(allMatches);
  }).catch(error => {
    console.error('Error fetching recommendations:', error);
  });
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const inputEl = document.getElementById('searchInput');
  handleSearchWithInput(inputEl);
});

function renderResults(matches) {
  const container = document.getElementById('results');
  if (!container) return console.warn('No #results element found');
  container.innerHTML = '';

  if (!matches || matches.length === 0) {
    container.innerHTML = '<p class="no-results">No recommendations found. Try "beach", "temple" or a country name.</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'results-list';

  matches.forEach(item => {
    const card = document.createElement('article');
    card.className = 'result-card';

    const imgSrc = item.imageUrl || 'placeholder.jpg'; 
    const img = document.createElement('img');
    img.className = 'result-image';
    img.src = imgSrc;
    img.alt = item.name || 'Place';

    const body = document.createElement('div');
    body.className = 'result-body';

    const title = document.createElement('h3');
    title.textContent = item.name || 'Unnamed place';

    const desc = document.createElement('p');
    desc.textContent = item.description || '';

    const visitButton = document.createElement('button');
    visitButton.textContent = 'Visit';
    visitButton.onclick = () => {
      window.open(item.visitUrl || '#', '_blank'); 
    };

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(visitButton); 

    card.appendChild(img);
    card.appendChild(body);
    list.appendChild(card);
  });

  container.appendChild(list);
}