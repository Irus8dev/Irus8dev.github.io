/*****************************************************************
Last Updated: 12/24/2024
Copyright (C) 2024 by Chalard LLC. All Rights Reserved.
******************************************************************/
document.addEventListener('DOMContentLoaded', function () {
  
  const contentTextarea = document.getElementById("content");
  const saveButton = document.getElementById("saveButton");
  let autoSaveTimeout;

  //-- save button event
  saveButton.addEventListener('click', function () {
    // Get the content of the textarea
    const lcnt = contentTextarea.value;
    // Create a Blob object with the content
    const lblob = new Blob([lcnt], { type: 'text/plain' });
    // Create a URL for the Blob object
    const lurl = URL.createObjectURL(lblob);
    // Create a temporary anchor element
    const a = document.createElement('a');
    // Set the download attribute with a filename
    a.href = lurl;
    a.download = 'QuikNote.txt';
    // Append the anchor to the document body
    document.body.appendChild(a);
    // Programmatically click the anchor to trigger the download
    a.click();
    // Remove the anchor from the document
    document.body.removeChild(a);
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(lurl);
  });
  
  //-- Insert Date/time button event
  document.getElementById('insert-date-btn').addEventListener('click', function () {
    const textArea = document.getElementById('content');
    const now = new Date();
    const dateString = now.toLocaleString(); // Converts the date and time to a string
    textArea.value = dateString + '\n' + textArea.value; // Inserts the date string at the top

    textArea.focus(); // Sets the focus back to the text area
    // Set the cursor position right after the date/time line
    const cursorPosition = dateString.length + 1; // +1 for the newline character
    textArea.setSelectionRange(cursorPosition, cursorPosition);
    textArea.scrollTop = 0; // Scrolls to the top of the text area
  });

  //--Load saved content from local storage
  //-- contentTextarea.value = localStorage.getItem("savedContent") || "";

  //-- Load saved content from local storage when the page loads
  window.addEventListener("load", () => {
    const savedContent = localStorage.getItem("savedContent");
    if (savedContent) {
      contentTextarea.value = savedContent;
    }
  });

  // Save content to local storage with auto-save delay
  contentTextarea.addEventListener("input", () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const content = contentTextarea.value;
      localStorage.setItem("savedContent", content);
      console.log("Auto-saved content!");
    }, 1000); // Set the delay in milliseconds (e.g., 1000ms = 1 second)
  });

  // Insert a tab character when the tab key is pressed inside the textarea
  contentTextarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent the default tab behavior (focus switching)
      const start = contentTextarea.selectionStart;
      const end = contentTextarea.selectionEnd;
      const value = contentTextarea.value;

      // Insert the tab character at the cursor position
      contentTextarea.value = value.substring(0, start) + "\t" + value.substring(end);

      // Set the cursor position after the inserted tab
      contentTextarea.selectionStart = contentTextarea.selectionEnd = start + 1;
    }
  });


});