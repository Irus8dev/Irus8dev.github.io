/*****************************************************************
Irus - Quizzer App.
Last Updated: 12/24/2024

Copyright (C) 2024 by Chalard LLC. All Rights Reserved.
******************************************************************/
document.addEventListener('DOMContentLoaded', function () {
  let quizzes = [];
  let originalOrder = [];
  let currentQuizIndex = 0;

  // Initialize an object to track performance
  let performanceTracker = {};

  const quizContainer = document.getElementById('quiz-container');
  const customFileButton = document.getElementById('custom-file-button');
  const csvImport = document.getElementById('csv-import');
  const nextQuizButton = document.getElementById('next-quiz');
  const csvFileSampleList = document.getElementById('csv-file-selector');
  const quizTitle = document.getElementById('quiz-title');
  const orderSelector = document.getElementById('order-selector');
  const downloadButton = document.getElementById('download-button');
  const expandButton = document.getElementById('toggle-csv-textarea');

  // Get the textarea and button elements
  const csvTextarea = document.getElementById('csv-textarea');
  const loadCsvTextButton = document.getElementById('load-csv-text');


  // Get the sample file list from the URL parameter
  const params = new URLSearchParams(window.location.search);
  var sampleFileName = params.get('samples') || '../samplelist.txt';

  //-- append the csv path "csv/samplefiles.txt"
  // sampleFileList = "csv/" + samplelist;
  // Load sample files names
  loadCSVFileNames(sampleFileName);

  //=== When user selects the sample ===
  csvFileSampleList.addEventListener('change', function (event) {
    const selectedFile = event.target.value;

    //-- ignore and empty value selection
    if (!selectedFile) {
      quizTitle.textContent = "Quizzer App";
      //-- clear the array
      quizzes = [];
      performanceTracker = {};
      quizContainer.innerHTML = '<div class="quiz-question"></div>';
      //-- Disable download button
      downloadButton.disabled = true;
      return;
    }

    quizTitle.textContent = getFileName(selectedFile);

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

  //=== When user Press "Open a .csv" file ===
  csvImport.addEventListener('change', function (e) {
    //-- We need to fix this
    const lfile = e.target.files[0];
    quizTitle.textContent = getFileName(lfile.name);

    readCsvFile(lfile);
    csvFileSampleList.value = '';
    downloadButton.disabled = true;
    csvImport.value = '';
  });

  //=== Download button ===
  downloadButton.addEventListener('click', function () {
    const selectedFile = csvFileSampleList.value;

    if (!selectedFile) {
      alert('Please select a sample file to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = selectedFile;
    link.download = getFileName(selectedFile) + '.csv';
    link.click();
  });

  //=== Expand button event listener ===
  expandButton.addEventListener('click', function () {
    var container = document.getElementById('csv-textarea-container');
    if (container.style.display === 'none') {
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  });

  //=== Add event listener to "Save Changes" button ===
  const saveCsvTextButton = document.getElementById('save-csv-text');
  saveCsvTextButton.addEventListener('click', function () {
    const csvText = csvTextarea.value.trim();

    if (!csvText) {
      alert('No content to save.');
      return;
    }

    // Create a Blob from the CSV text
    const blob = new Blob([csvText], { type: 'text/csv' });

    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited_quiz.csv';

    // Trigger download
    link.click();

    //-- Clean up
    URL.revokeObjectURL(link.href);
  });

  function parseCsvText(csvText) {
    // Split text by lines
    const lines = csvText.split('\n');
    lines.forEach((line) => {
      // Ignore lines starting with "#"
      if (!line.startsWith('#')) {
        const fields = line.split(',').map(field => field.replace(/['"]+/g, '').trim());
        const [question, selections, correctAnswer] = fields;
        if (question && selections && correctAnswer) {
          quizzes.push({ question, selections: selections.split(';'), correctAnswer });
        }
      }
    });

    // Store the original order
    originalOrder = [...quizzes];

    // Shuffle if needed
    if (orderSelector.value === 'random') {
      shuffleArray(quizzes);
    }
  }

  //=== read the file ===
  function readCsvFile(mfile) {
    const lreader = new FileReader();

    //-- reader event
    lreader.onload = function (e) {
      //-- clear the array
      quizzes = [];
      performanceTracker = {};

      const ltext = e.target.result.trim();

      parseCsvText(ltext);

      currentQuizIndex = 0; // Reset index
      displayQuiz();
    };

    //-- This is where it triggers the reader event
    lreader.readAsText(mfile);
  }

  //=== Handle loading pasted CSV content ===
  loadCsvTextButton.addEventListener('click', function () {
    const csvText = csvTextarea.value.trim();

    if (!csvText) {
      alert('Please paste valid CSV content.');
      return;
    }

    try {
      // Clear existing quizzes and performance tracker
      quizzes = [];
      performanceTracker = {};

      downloadButton.disabled = true;
      csvFileSampleList.value = '';

      parseCsvText(csvText);

      currentQuizIndex = 0; // Reset index
      displayQuiz();
      //alert('Quiz loaded successfully!');
    }
    catch (error) {
      alert('Failed to load quiz. Please check your CSV content.');
      console.error('Error parsing CSV:', error);
    }
  });

  //=== extract just the file name ===
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
  nextQuizButton.addEventListener('click', function () {
    currentQuizIndex = getNextQuizIndex();
    displayQuiz();
  });

  //-- when user click on a selection
  function checkAnswer(e) {
    const lselectedAnswer = e.target.textContent.trim();
    const lquiz = quizzes[currentQuizIndex];
    const lanswerMessage = document.getElementById('answer-message');
    const autoAdvance = document.getElementById('auto-advance').checked;

    //-- Answer Correctly
    if (lselectedAnswer === replaceAndC(lquiz.correctAnswer)) {

      updatePerformance(lquiz.question, true);

      lanswerMessage.textContent = 'Correct!';
      lanswerMessage.style.color = 'green';
      lanswerMessage.style.visibility = 'visible';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
        lanswerMessage.style.visibility = 'hidden';
      }, 500);

      // Advance to the next quiz
      currentQuizIndex = getNextQuizIndex();
      displayQuiz();

      //-- Incorrect answer
    } else {

      updatePerformance(lquiz.question, false);

      lanswerMessage.textContent = 'The correct answer is: ' + replaceAndC(lquiz.correctAnswer);
      lanswerMessage.style.color = 'red';
      lanswerMessage.style.visibility = 'visible';

      // Optionally, set a timeout to clear the message after a few seconds
      setTimeout(() => {
        lanswerMessage.textContent = '';
        lanswerMessage.style.visibility = 'hidden';
        if (autoAdvance) {
          // Advance to the next quiz
          currentQuizIndex = getNextQuizIndex();
          displayQuiz();
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

  //=== Display the quiz ===
  function displayQuiz() {

    const lquiz = quizzes[currentQuizIndex];

    //-- show the question
    quizContainer.innerHTML = '<div class="quiz-question">' + replaceAndC(lquiz.question) + '</div>';

    //-- show the selections
    lquiz.selections.forEach((selection) => {
      const selectionContainer = document.createElement('div');
      selectionContainer.classList.add('quiz-selection');

      const lbutton = document.createElement('button');
      if (!lquiz.correctAnswer) {
        lbutton.className = 'buttton-selection-readonly';
      } else {
        lbutton.className = 'button-selection';
      }
      lbutton.textContent = replaceAndC(selection);
      lbutton.addEventListener('click', checkAnswer);

      selectionContainer.appendChild(lbutton);
      quizContainer.appendChild(selectionContainer);
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

  // Function to get the next quiz index based on performance
  function getNextQuizIndex() {
    if (orderSelector.value === 'random') {
      // Random order: get a random index
      return Math.floor(Math.random() * quizzes.length);
    } else {
      // Sequential order: get the next index in sequence
      return (currentQuizIndex + 1) % quizzes.length;
    }
  }

  // Function to load .csv file names into the dropdown ('path/to/files_list.txt')
  function loadCSVFileNames(mfileName) {
    fetch(mfileName)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        const lines = text.split('\n');

        const selectElement = document.getElementById('csv-file-selector');
        selectElement.innerHTML = '<option value="">Select Sample...</option>'; // Reset the options
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
  // Add event listener to shuffle quizzes when the order is changed
  orderSelector.addEventListener('change', function () {
    if (orderSelector.value === 'random') {
      shuffleArray(quizzes);
    } else {
      // Reset to sequential order by restoring the original order
      quizzes = [...originalOrder];
      currentQuizIndex = 0;
    }
    displayQuiz();
  });

});


