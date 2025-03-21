async function fetchData() {
  const url = "https://fedskillstest.coalitiontechnologies.workers.dev";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Basic " + btoa("coalition:skills-test"), // Encode username and password
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json();

  // Find Jessica Taylor's data
  const jessica = data.find((patient) => patient.name === "Jessica Taylor");

  if (jessica) {
    console.log("Jessica's Full Data:", JSON.stringify(jessica, null, 2));
    console.log("Jessica's Data Keys:", Object.keys(jessica));

    document.getElementById("patient-data").innerHTML = `
      <img src="${jessica.profile_picture}" alt="Jessica Taylor" width="100" />
      <h2 class="mt-2 fw-bold">${jessica.name}</h2>
      <div class="flexible mt-3 fw-bold">
        <img src="images/BirthIcon.svg">
        <p>Date Of Birth <br> ${jessica.date_of_birth}</p>
      </div>
      <div class="flexible mt-3 fw-bold">
        <img src="images/FemaleIcon.svg">
        <p>Gender <br> ${jessica.gender}</p>
      </div>
      <div class="flexible mt-3 fw-bold">
        <img src="images/PhoneIcon.svg">
        <p>Contact Info <br> ${jessica.phone_number}</p>
      </div>
      <div class="flexible mt-3 fw-bold">
        <img src="images/PhoneIcon.svg">
        <p>Emergency Contacts <br> ${jessica.emergency_contact}</p>
      </div>
      <div class="flexible mt-3 fw-bold">
        <img src="images/InsuranceIcon.svg">
        <p>Insurance Provider <br> ${jessica.insurance_type}</p>
      </div>
      <button class="p-2 mt-4">Show All Information</button>
    `;

    // Check if blood pressure data exists
    if (
      !jessica.blood_pressure_readings ||
      jessica.blood_pressure_readings.length === 0
    ) {
      console.warn("Jessica has no blood pressure data. Using sample data...");
      jessica.blood_pressure_readings = [
        { date: "2025-03-01", systolic: 120, diastolic: 80 },
        { date: "2025-03-02", systolic: 125, diastolic: 82 },
        { date: "2025-03-03", systolic: 118, diastolic: 79 },
      ]; // Example data
    }

    // Plot blood pressure chart
    plotBloodPressureChart(jessica.blood_pressure_readings);
  } else {
    document.getElementById("patient-data").innerHTML = "<p>No data found.</p>";
  }
}

function plotBloodPressureChart(bloodPressureData) {
  const ctx = document
    .getElementById("plotBloodPressureChart")
    .getContext("2d");

  // Destroy existing chart if present
  if (window.bloodPressureChart) {
    window.bloodPressureChart.destroy();
  }

  // Ensure data is available
  if (!bloodPressureData || bloodPressureData.length === 0) {
    console.warn("No blood pressure data available.");
    return;
  }

  const chartData = {
    labels: bloodPressureData.map((entry) => entry.date),
    datasets: [
      {
        data: bloodPressureData.map((entry) => entry.systolic),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "red",
        tension: 0.3,
      },
      {
        data: bloodPressureData.map((entry) => entry.diastolic),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "blue",
        tension: 0.3,
      },
    ],
  };

  window.bloodPressureChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: "Date" },
          ticks: { autoSkip: true, maxTicksLimit: 6 },
        },
        y: {
          // title: { display: true, text: "Blood Pressure (mmHg)" },
          min: 70,
          max: 140,
          // ticks: { stepSize: 10 },
        },
      },
      // plugins: {
      //   legend: { position: "top" },
      //   tooltip: { mode: "index", intersect: false },
      // },
    },
  });
}

// Load data when the page loads
document.addEventListener("DOMContentLoaded", fetchData);
