// jokeFetcher.js

// Wait for the DOM to load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const jokeButton = document.querySelector('#fetchJoke');
    const categoryFilter = document.querySelector('#categoryFilter');
    const jokeDisplay = document.querySelector('#joke');

    // Store the currently selected joke category
    let selectedCategory = 'all';

    // Handle category filter changes
    const handleCategoryChange = (event) => {
        selectedCategory = event.target.value;
    };

    // Sanitize the selected category
    const sanitizeCategory = (category) => {
        return encodeURIComponent(category);
    };

    // Fetch and display a random joke based on the selected category
    const displayRandomJoke = async () => {
        // Disable the joke button while fetching a joke
        jokeButton.disabled = true;

        const apiUrl = selectedCategory === 'all'
            ? 'https://official-joke-api.appspot.com/jokes/random'
            : `https://official-joke-api.appspot.com/jokes/${sanitizeCategory(selectedCategory)}/random`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error fetching joke: ${response.status} ${response.statusText}`);
            }

            const jokeData = await response.json();

            if (!jokeData || !jokeData.setup || !jokeData.punchline) {
                throw new Error('Joke data is incomplete.');
            }

            jokeDisplay.textContent = `${jokeData.setup} ${jokeData.punchline}`;
        } catch (error) {
            jokeDisplay.textContent = `Error fetching joke: ${error.message}`;
        } finally {
            // Re-enable the joke button after the joke has been fetched
            jokeButton.disabled = false;
        }
    };

    // Handle joke button clicks
    const handleJokeButtonClick = () => {
        displayRandomJoke();
    };

    // Attach event listeners
    categoryFilter.addEventListener('change', handleCategoryChange);
    jokeButton.addEventListener('click', handleJokeButtonClick);

    // Fetch and display an initial joke when the page loads
    displayRandomJoke();
});
