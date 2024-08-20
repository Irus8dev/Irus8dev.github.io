document.addEventListener('DOMContentLoaded', function () {
  let flashcards = [];
  let originalOrder = [];
  let currentFlashcardIndex = 0;

  // Initialize an object to track performance
  let performanceTracker = {};

  const flashcardContainer = document.getElementById('flashcard-container');
  const customFileButton = document.getElementById('custom-file-button');
  const csvImport = document.getElementById('csv-import');
  const nextFlashcardButton = document.getElementById('next-flashcard');
  const csvFile = document.getElementById('csv-file-selector');
  const gflashHeader = document.getElementById('flash-header');
  const orderSelector = document.getElementById('order-selector');
  const downloadButton = document.getElementById('download-button');


  // Get the sample file list from the URL parameter
  const params = new URLSearchParams(window.location.search);
  var sampleFileList = params.get('samples') || 'samplefiles.txt';

  //-- append the csv path "csv/samplefiles.txt"
  sampleFileList = "csv/" + sampleFileList;

  // Load sample files names
  loadCSVFileNames(sampleFileList);

  //-- When user selects the sample
  csvFile.addEventListener('change', function (event) {
    const selectedFile = event.target.value;

    //-- ignore and empty value selection
    if (!selectedFile) {
      gflashHeader.textContent = "Flashcard App";
      //-- clear the array
      flashcards = [];
      performanceTracker = {};
      flashcardContainer.innerHTML = '<div class="flashcard-question"></div>';
      //-- Disable download button
      downloadButton.disabled = true;
      return;
    }

    gflashHeader.textContent = getFileName(selectedFile);

    fetch(selectedFile)
      .then(response => response.blob())
      .then(blob => {
        readCsvFile(blob);
      })
      .catch(error => console.error('Error fetching CSV:', error));
    
    //-- enable download button
    downloadButton.disabled = false;
    csvImport.value = '';
  });

  //-- Custom button to trigger file input
  customFileButton.addEventListener('click', function () {
    csvImport.click();
  });

  //-- When user uploads the file.
  csvImport.addEventListener('change', function (e) {
    const lfile = e.target.files[0];
    gflashHeader.textContent = getFileName(lfile.name);

    readCsvFile(lfile);
    csvFile.value = '';
    csvImport.value = '';
  });

  //-- Download button
  downloadButton.addEventListener('click', function () {
    const selectedFile = csvFile.value;

    if (!selectedFile) {
      alert('Please select a sample file to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = selectedFile;
    link.download = getFileName(selectedFile) + '.csv';
    link.click();
  });

  //-- read the file
  function readCsvFile(mfile) {
    const lreader = new FileReader();
    //-- reader event
    lreader.onload = function (e) {
      //-- clear the array
      flashcards = [];
      performanceTracker = {};

      const ltext = e.target.result.trim();
      const llines = ltext.split('\n');

      llines.forEach((line) => {
        // ignore any line that begins with "#"
        if (!line.startsWith("#")) {
          // Remove quotes and trim each field
          const lfields = line.split(',').map(field => field.replace(/['"]+/g, '').trim());
          var [question, selections, correctAnswer] = lfields;

          flashcards.push({ question, selections: selections.split(';'), correctAnswer });
        }
      });

      // Store the original order
      originalOrder = [...flashcards];

      // Shuffle flashcards if random order is selected
      if (orderSelector.value === 'random') {
        shuffleArray(flashcards);
      }

      currentFlashcardIndex = 0; // Reset index
      displayFlashcard();
    };
    lreader.readAsText(mfile);
  }

  //-- extract just the file name
  function getFileName(mname) {
    // Split the path by both backslash and forward slash
    var parts = mname.split(/[/\\]/);
    // Get the last part of the array (the file name with extension)
    var fileNameWithExtension = parts[parts.length - 1];
    // Remove the extension if needed
    var fileName = fileNameWithExtension.split('.')[0];
    return fileName;
  }

  //-- next button press
  nextFlashcardButton.addEventListener('click', function () {
    currentFlashcardIndex = getNextFlashcardIndex();
    displayFlashcard();
  });

  //-- when user click on a selection
  function checkAnswer(e) {
    const lselectedAnswer = e.target.textContent.trim();
    const lflashcard = flashcards[currentFlashcardIndex];
    const lanswerMessage = document.getElementById('answer-message');
    const autoAdvance = document.getElementById('auto-advance').checked;

    //-- Answer Correctly
    if (lselectedAnswer === replaceAndC(lflashcard.correctAnswer)) {

      updatePerformance(lflashcard.question, true);

      lanswerMessage.textContent = 'Correct!';
      lanswerMessage.style.color = 'green';
      lanswerMessage.style.visibility = 'visible';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
        lanswerMessage.style.visibility = 'hidden';
      }, 500);

      // Advance to the next flashcard
      currentFlashcardIndex = getNextFlashcardIndex();
      displayFlashcard();

      //-- Incorrect answer
    } else {

      updatePerformance(lflashcard.question, false);

      lanswerMessage.textContent = 'The correct answer is: ' + replaceAndC(lflashcard.correctAnswer);
      lanswerMessage.style.color = 'red';
      lanswerMessage.style.visibility = 'visible';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
        lanswerMessage.style.visibility = 'hidden';
        if (autoAdvance) {
          // Advance to the next flashcard
          currentFlashcardIndex = getNextFlashcardIndex();
          displayFlashcard();
        }

      }, 2000);

    }
  }

  function replaceAndC(mstr) {
    //-- replace "&c" -> "," and "&s"
    return mstr.replace(/&c/g, ',').replace(/&s/g, ';');
  }

  function shuffleArray(marray) {
    for (let i = marray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements
      [marray[i], marray[j]] = [marray[j], marray[i]];
    }
  }

  function displayFlashcard() {
    const lflashcard = flashcards[currentFlashcardIndex];
    flashcardContainer.innerHTML = '<div class="flashcard-question">' + replaceAndC(lflashcard.question) + '</div>';
    lflashcard.selections.forEach((selection) => {
      const selectionContainer = document.createElement('div');
      selectionContainer.classList.add('flashcard-selection');

      const lbutton = document.createElement('button');
      if (!lflashcard.correctAnswer) {
        lbutton.className = 'buttton-selection-readonly';
      } else {
        lbutton.className = 'button-selection';
      }
      lbutton.textContent = replaceAndC(selection);
      lbutton.addEventListener('click', checkAnswer);

      selectionContainer.appendChild(lbutton);
      flashcardContainer.appendChild(selectionContainer);
    });
  }

  // Function to update performance after each answer
  function updatePerformance(question, isCorrect) {
    if (!performanceTracker[question]) {
      //-- create and initialize the object
      performanceTracker[question] = { correct: 0, incorrect: 0 };
    }

    if (isCorrect) {
      performanceTracker[question].correct++;
    } else {
      performanceTracker[question].incorrect++;
    }
  }

  // Function to get the next flashcard index based on performance
  function getNextFlashcardIndex() {
    if (orderSelector.value === 'random') {
      // Random order: get a random index
      return Math.floor(Math.random() * flashcards.length);
    } else {
      // Sequential order: get the next index in sequence
      return (currentFlashcardIndex + 1) % flashcards.length;
    }
  }

  // Function to load .csv file names into the dropdown ('path/to/files_list.txt')
  function loadCSVFileNames(mfilelist) {
    fetch(mfilelist)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        const lines = text.split('\n');
        const selectElement = document.getElementById('csv-file-selector');
        selectElement.innerHTML = '<option value="">Sample...</option>'; // Reset the options
        lines.forEach(line => {
          if (line.trim().length > 0) {
            const option = document.createElement('option');
            option.value = line.trim();
            option.textContent = getFileName(line.trim());
            selectElement.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error('Error loading file list:', error);
        // Clear the dropdown list
        const selectElement = document.getElementById('csv-file-selector');
        selectElement.innerHTML = '<option value="">Sample...</option>';
      });
  }
  // Add event listener to shuffle flashcards when the order is changed
  orderSelector.addEventListener('change', function () {
    if (orderSelector.value === 'random') {
      shuffleArray(flashcards);
    } else {
      // Reset to sequential order by restoring the original order
      flashcards = [...originalOrder];
      currentFlashcardIndex = 0;
    }
    displayFlashcard();
  });

});
