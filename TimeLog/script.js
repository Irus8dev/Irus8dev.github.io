document.addEventListener('DOMContentLoaded', function () {
	const projectInput = document.getElementById("project");
	const startButton = document.getElementById("startButton");
	const stopButton = document.getElementById("stopButton");
	const sessionTextList = document.getElementById("sessionList");
	let sessions = [];

	let currentSession = null;
	//-- start button click
	startButton.addEventListener("click", () => {
		const project = projectInput.value;
		const startTime = new Date().toLocaleTimeString();
		currentSession = { project, startTime };
		document.getElementById('startMessage').textContent = 'Start';
	});
	//-- stop button click
	stopButton.addEventListener("click", () => {
		if (currentSession) {
			const endTime = new Date().toLocaleTimeString();
			currentSession.endTime = endTime;

			sessions.push(currentSession);

			const sessionItem = document.createElement("li");
			sessionItem.textContent = `${currentSession.project} - ${currentSession.startTime} to ${currentSession.endTime}`;
			sessionTextList.appendChild(sessionItem);
			currentSession = null;
			updateTotals();
			document.getElementById('startMessage').textContent = '';
		}
	});

	const totalsList = document.getElementById("totalsList");

	function updateTotals() {
		const projectTotals = {};
		let totaltime = 0;
		try {

			sessions.forEach(session => {
				if (session.endTime) {
					const { project, startTime, endTime } = session;
					//-- this is how we make it into a date time format text
					const start = new Date(`2000-01-01 ${startTime}`);
					const end = new Date(`2000-01-01 ${endTime}`);
					
					const duration = (end - start); // Calculate duration in hours
					const ltotalmin = duration / 1000; // in minutes
					const ltotalhr = duration / (1000 * 60 * 60); // Calculate duration in hours

					if (!projectTotals[project]) {
						projectTotals[project] = 0;
					}
					projectTotals[project] += duration;
					
					totaltime += projectTotals[project]; 
				}
			});

			totalsList.innerHTML = "";
			Object.keys(projectTotals).forEach(project => {
				const lmn = projectTotals[project] / (1000 * 60);
				const lhr = projectTotals[project] / (1000 * 60 * 60);
				const totalItem = document.createElement("li");
				totalItem.textContent = `${project}: ${lmn.toFixed(2) } min, ${lhr.toFixed(2)} hr`
				totalsList.appendChild(totalItem);
			});
			//-- display total
			const totalItem = document.createElement("li");
			const lmn = totaltime / (1000 * 60);
			const lhr = totaltime / (1000 * 60 * 60);
			
			totalItem.textContent = `Total: ${lmn.toFixed(2) } min, ${lhr.toFixed(2) } hr`;
			//-- set the total text to bold
			totalItem.style.fontWeight = 'bold';
			totalsList.appendChild(totalItem);

		} catch (error) {

		}

	}

	function displaySessions() {
		sessionTextList.innerHTML = "";
		try {
			sessions.forEach(session => {
				const sessionItem = document.createElement("li");
				const endTime = session.endTime ? `to ${session.endTime}` : "In Progress";

				// Add visual indicator for start and stop status
				const statusIndicator = session.endTime ? "🔴" : "🟢";
				sessionItem.textContent = `${statusIndicator} ${session.project} - ${session.startTime} ${endTime}`;

				sessionTextList.appendChild(sessionItem);
			});
			updateTotals();
		}
		catch {

		}
	}

	// Initial display of sessions and totals when the page loads
	displaySessions();
	updateTotals();
});