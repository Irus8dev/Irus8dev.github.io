document.addEventListener('DOMContentLoaded', function () {
  let flashcards = [];
  let currentFlashcardIndex = 0;

  // Initialize an object to track performance
  let performanceTracker = {};

  const flashcardContainer = document.getElementById('flashcard-container');
  const csvImport = document.getElementById('csv-import');
  const nextFlashcardButton = document.getElementById('next-flashcard');
  const csvFile = document.getElementById('csv-file-selector');

  //loadCSVFileNames('resource/Flashcard Samples/filelist.txt');

  //-- When user select the sample
  csvFile.addEventListener('change', function (event) {
    csvImport.value = '';
    const selectedFile = event.target.value;
    fetch(selectedFile)
      .then(response => response.blob())
      .then(blob => {
        readCsvFile(blob);
      })
      .catch(error => console.error('Error fetching CSV:', error));

  });

  //-- When user uploades the file.
  csvImport.addEventListener('change', function (e) {
    const lfile = e.target.files[0];
    csvFile.value = '';

    readCsvFile(lfile);
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

        // Remove quotes and trim each field
        const lfields = line.split(',').map(field => field.replace(/['"]+/g, '').trim());
        var [question, selections, correctAnswer] = lfields;

        flashcards.push({ question, selections: selections.split(';'), correctAnswer });
      });

      shuffleArray(flashcards); // Shuffle the flashcards
      displayFlashcard();
    };
    lreader.readAsText(mfile);
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
    if (lselectedAnswer === lflashcard.correctAnswer) {

      updatePerformance(lflashcard.question, true);

      lanswerMessage.textContent = 'Correct!';
      lanswerMessage.style.color = 'green';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
      }, 500);

      // Update local storage for tracking

      // Advance to the next flashcard
      currentFlashcardIndex = getNextFlashcardIndex();
      displayFlashcard();

      //-- Incorrect answer
    } else {

      updatePerformance(lflashcard.question, false);

      lanswerMessage.textContent = 'The correct answer is: ' + replaceAndC(lflashcard.correctAnswer);
      lanswerMessage.style.color = 'red';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
      }, 2000);

      if (autoAdvance) {
        // Advance to the next flashcard
        currentFlashcardIndex = getNextFlashcardIndex();
        displayFlashcard();
      }
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
    //lflashcard.question;
    flashcardContainer.innerHTML = '<div class="flashcard-question">' + replaceAndC(lflashcard.question) + '</div>';
    lflashcard.selections.forEach((selection) => {
      const selectionContainer = document.createElement('div');
      selectionContainer.classList.add('flashcard-selection');

      const lbutton = document.createElement('button');
      if (!lflashcard.correctAnswer) {
        lbutton.className = 'buttton-selection-readonly';
      }
      else {
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

    return (currentFlashcardIndex + 1) % flashcards.length;

    let lminFrequency = Infinity;
    let lnextIndex = currentFlashcardIndex;

    //-- loop through each flashcard and see which ones are the weak ones 
    flashcards.forEach((lflashcard, lindex) => {

      //-- Get each matching performance item
      const lperformance = performanceTracker[lflashcard.question];

      //-- calculate the frequency (higher = more incorrect)
      const lfrequency = lperformance ? (lperformance.incorrect - lperformance.correct) : 0;

      //-- Select the flashcard with the highest frequency (most incorrect answers)
      if (lfrequency > lminFrequency) {
        lminFrequency = lfrequency;
        lnextIndex = lindex;
      }
    });

    return lnextIndex;
  }
  
  // Function to load .csv file names into the dropdown ('path/to/files_list.txt')
  function loadCSVFileNames(mfilelist) {
    fetch(mfilelist)
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const selectElement = document.getElementById('csv-file-selector');
        lines.forEach(line => {
          if (line.trim().length > 0) {
            const option = document.createElement('option');
            option.value = line.trim();
            option.textContent = line.trim();
            selectElement.appendChild(option);
          }
        });
      })
      .catch(error => console.error('Error loading file list:', error));
  }


});

