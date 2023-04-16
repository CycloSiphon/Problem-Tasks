// Custom API error class for more descriptive error messages
class ApiError extends Error {
  constructor(message, status) {
    super(`${message} (HTTP ${status})`);
    this.status = status;
  }
}

// Cache for storing fetched user data
const userDataCache = new Map();

// Fetch user data from API and cache it
const fetchUserData = async (userId) => {
  // Return cached data if available
  if (userDataCache.has(userId)) {
    return userDataCache.get(userId);
  }

  // Setup an abort controller to cancel fetch requests if they take too long
  const controller = new AbortController();
  const { signal } = controller;
  setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, { signal });

    // Throw ApiError if the response is not OK
    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('User not found', response.status);
      }
      throw new ApiError('Error fetching user data', response.status);
    }

    const data = await response.json();
    userDataCache.set(userId, data);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

// Display user data on the page
const displayUserDataOnPage = async (userId) => {
  try {
    const { name, email } = await fetchUserData(userId);
    document.getElementById('userName')?.textContent = name;
    document.getElementById('userEmail')?.textContent = email;
  } catch (error) {
    console.error(error.message);
  }
};

// Debounce function to delay the execution of a function
const debounce = (func, delay, initialDelay = 0) => {
  let timer;
  return async (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), initialDelay);
    initialDelay = delay;
  };
};

// Validate user ID to ensure it's a number
const isValidUserId = (userId) => /^\d+$/.test(userId);

// Handle button click event with debouncing
const handleFetchButtonClick = debounce(async () => {
  const userId = document.getElementById('userIdInput').value;
  if (isValidUserId(userId)) {
    await displayUserDataOnPage(userId);
  } else {
    console.error('Please enter a valid user ID');
  }
}, 300);

// Add event listener for the fetch button click event
document.getElementById('fetchButton').addEventListener('click', handleFetchButtonClick);
