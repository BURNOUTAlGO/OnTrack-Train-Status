document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const inputpnr = document.getElementById("input-pnr");
  const traindetailcard = document.querySelector(".Train-detail-section");

  // train-details-card
  const trainNumName = document.querySelector(".train-no-name");
  const sourceContainer = document.querySelector(".source-container");
  const destinationcontainer = document.querySelector(".destination-container");
  const box1 = document.querySelector(".box1");
  const durationdis = document.querySelector(".duration-dis-container");

  // passenger-detail-card
  const passengercard = document.querySelector(".passenger-details-sec");
  const passengercontainer = document.querySelector(".values-div");
  // Footer section

  const footersec = document.querySelector(".footer-container");

  // VALIDATE PNR
  function isvalidate(pnr) {
    if (pnr.trim === "") {
      alert("PNR should not be empty");
      return false;
    }
    const regex = /^\d{10}$/;
    const isMaching = regex.test(pnr);
    if (!isMaching) {
      alert("PNR IS NOT VALID");
    }
    return isMaching;
  }

  // FETCH PNR DETAILS
  async function fetchpnrdetails(pnr) {
    const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "e7a3e6137cmsh3d516d542e82780p111821jsn33424173441b",
        "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
      },
    };

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      const response = await fetch(url, options);
      const fetcheddata = await response.json();
      console.log(fetcheddata);
      const displaymessage = fetcheddata.message;

      // displaymessage should be  pnr not generated / flushed pnr / irctc servicetime
      if (displaymessage != null) {
        alert(displaymessage);
        searchButton.textContent = "Search";
      }
      displayFetchedData(fetcheddata);

      // at the end
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      traindetailcard.style.display = "block";
      passengercard.style.display = "block";
      footersec.style.display="block";

      

    } catch (error) {
      console.error(error);
    }
  }

  // DISPLAY THE FETCHED DETAILS

  function displayFetchedData(fetcheddata) {
    const trainNo = fetcheddata.data.trainNumber;
    const trainName = fetcheddata.data.trainName;
    const Boardingpoint = fetcheddata.data.boardingPoint;
    const destination = fetcheddata.data.destinationStation;
    const distance = fetcheddata.data.distance;

    const departureTime = new Date(fetcheddata.data.dateOfJourney);
    const arrivalTime = new Date(fetcheddata.data.arrivalDate);
    const options1 = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    const depTime = departureTime.toLocaleString("en-IN", options1);
    const arrTime = arrivalTime.toLocaleString("en-IN", options1);

    const journeyclass = fetcheddata.data.journeyClass;
    // const quota = fetcheddata.data.quota;
    // const bookingdate = fetcheddata.data.bookingDate;

    const dateOfJourney = new Date(fetcheddata.data.dateOfJourney);
    const arrivalDate = new Date(fetcheddata.data.arrivalDate);
 
    const options2 = { day: "2-digit", month: "short", year: "numeric" };

    // Format as only date (in dd/mm/yyyy format for India)
    const formattedateofjourneyDate = dateOfJourney.toLocaleDateString(
      "en-GB",
      options2
    );
    const formattedArrivalDate = arrivalDate.toLocaleDateString(
      "en-GB",
      options2
    );

    // POPULATING THE DATA ON THE UI

    // PASSENGERS DETAILS
    const passengerinfo = fetcheddata.data.passengerList; // fetching each passenger details from passenger list
    passengercontainer.innerHTML = "";

    //populating passengers details
    passengerinfo.forEach((passenger, index) => {
      const passengerdiv = document.createElement("div");
      passengerdiv.className = "passenger-info-card";
      passengerdiv.innerHTML = `
        <p>P${index + 1}</p>
        <p>${passenger.bookingStatus}</p>
        <p>${passenger.currentStatus}</p>
        <p>${passenger.currentCoachId}/${passenger.currentBerthNo}/${
        passenger.currentBerthCode
      }</p>
      `;
      passengercontainer.appendChild(passengerdiv);
    });

    // TRAIN DETAILS
    // populating the train details

    // populate 1
    trainNumName.innerHTML = `
            <p class="train-no">${trainNo}</p>
            <p class="train-name">${trainName}</p>
            <p class="class-name">CLASS : ${journeyclass}</p>


        `;
    // populate 2
    box1.innerHTML = `
        <p>Boarding Station</p>
        <p class="destini">Destination Station</p>

`;
    // populate 3
    sourceContainer.innerHTML = `
            <h3 class="source">${Boardingpoint}</h3>
            <p class="source-time">${depTime}</p>
            <p class="journey-date">${formattedateofjourneyDate}</p>

          `;

    // populate 4
    destinationcontainer.innerHTML = `
            <h3 class="destination">${destination}</h3>
            <p class="destination-time">${arrTime}</p>
            <p class="arrival-date">${formattedArrivalDate}</p>

          `;
          //duration-dis
          durationdis.innerHTML = `
          <p>-- ${distance} Km --</p>


        `;
  }
    // FOR THE HAMBURGER MENU SECTION
    const menu = document.querySelector(".menu_button");

    menu.addEventListener("click", function () {
      const navbarsection = document.querySelector(".nav-bar");
      navbarsection.classList.toggle("active");
    });




  // SEARCH BUTTON EVENTLISTENER

  searchButton.addEventListener("click", function () {
    const pnr = inputpnr.value;
    console.log("YOUR PNR : ", pnr);
    if (isvalidate(pnr)) {
      fetchpnrdetails(pnr);
    }
  });

  // AUTO CLICK ON THE SEARCH BUTTON WHWN PRESS ENTER KEY ON KEYBOARD

  document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
      searchButton.click(); // Trigger the button click
    }
  });
});
