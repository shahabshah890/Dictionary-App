const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = form.elements[0].value.trim(); // Get the input value
    if (word) {
        getWordInfo(word); // Fetch word info
    } else {
        resultDiv.innerHTML = `<p>Please enter a word.</p>`;
    }
});

// Function to fetch word information
const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML= 'Fetching Data....'
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Sorry word could not be found');
        }

        const data = await response.json();

        // Extract word information
        const definitions = data[0].meanings[0].definitions[0];

        // Update the resultDiv with word information
        resultDiv.innerHTML = `
            <h2>${data[0].word}</h2>
            <p class='partOf'><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>
            <p><strong>Definition:</strong> ${definitions.definition || 'Not Found'}</p>
            <p><strong>Example:</strong> ${definitions.example || 'Not Found'}</p>
        `;

        // Handle antonyms
        if (definitions.antonyms && definitions.antonyms.length > 0) {
            resultDiv.innerHTML += `<p><strong>Antonyms:</strong></p><ul>`;
            definitions.antonyms.forEach((antonym) => {
                resultDiv.innerHTML += `<li>${antonym}</li>`;
            });
            resultDiv.innerHTML += `</ul>`;
        } else {
            resultDiv.innerHTML += `<p><strong>Antonyms:</strong> Not Found</p>`;
        }

        // Add a "Read More" button
        if (data[0].sourceUrls && data[0].sourceUrls.length > 0) {
            resultDiv.innerHTML += `<p><a href="${data[0].sourceUrls[0]}" target="_blank" rel="noopener noreferrer">Read More</a></p>`;
        }

        console.log(data);
    } catch (error) {
        // Handle errors (e.g., word not found)
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error(error);
    }
};
