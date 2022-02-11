(() => {
  // Will get the data from JSON file
  getData({time: 'weekly', tab: 'week'});
  function getData(infos) {
    const resquest = new XMLHttpRequest();
    resquest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = resquest.response;
        // If info.timeBox "Truthy", execute setSingleTimeFrame function
        if (infos.timeBox) return setSingleTimeFrame(response, infos);

        // If info.timeBox "Falsy" (undefined), execute setAllTimeFrames function
        setAllTimeFrames(response, infos);
      }
    };
    resquest.open('GET', 'data.json');
    resquest.responseType = 'json';
    resquest.send();
  }

  // Will set the current and previous time data to ALL Cards
  function setAllTimeFrames(data, infos) {
    // Return an array with all current time data
    const currData = data.map(value => value.timeframes[infos.time].current);
    // Return an array with all previous time data
    const prevData = data.map(value => value.timeframes[infos.time].previous);
    const current = document.querySelectorAll('.time__curr');
    const previous = document.querySelectorAll('.time__prev');

    // This for loop will set current and previous time data for all elements
    for (let i = 0; i < current.length; i++) {
      current[i].innerText = `${currData[i]}hr${currData[i] === 1 ? '' : 's'}`;
      previous[i].innerText = `${
        infos.tab !== 'Day' ? `Last ${infos.tab}` : 'Yesterday'
      } - ${prevData[i]}hr${prevData[i] === 1 ? '' : 's'}`;
    }
  }

  // Will set the current and previous time data to a SINGLE Card
  function setSingleTimeFrame(data, infos) {
    // time, tab, element
    const title = infos.timeBox.getAttribute('data-title');
    const current = infos.timeBox.querySelector('.time__curr');
    const previous = infos.timeBox.querySelector('.time__prev');
    // Return a single number with the current time data from a certain "title"
    const currData = data.reduce((res, value) => {
      if (value.title === title) {
        res = value.timeframes[infos.time].current;
      }
      return res;
    }, 0);
    // Return a single number with the previous time data from a certain "title"
    const prevData = data.reduce((res, value) => {
      if (value.title === title) {
        res = value.timeframes[infos.time].previous;
      }
      return res;
    }, 0);

    // Set the current and previous time data only for the "element" children
    current.innerText = `${currData}hr${currData === 1 ? '' : 's'}`;
    previous.innerText = `${
      infos.tab !== 'Day' ? `Last ${infos.tab}` : 'Yesterday'
    } - ${prevData}hr${prevData === 1 ? '' : 's'}`;
  }

  // Adds the "active" class to the element
  function addActive(element, name) {
    element.classList.add(name);
  }

  // Removes the "active" class to the element
  function removeActive(element, name) {
    element.classList.remove(name);
  }

  // Checks if the element contains the "active" class
  function isActive(element, name) {
    return element.classList.contains(name);
  }

  // Declarations of the Main Variables
  const tabBtns = document.querySelectorAll('.tab__btn');
  const hdrBtns = document.querySelectorAll('.track-hdr__btn');
  const menuBtns = document.querySelectorAll('.menu__btn');

  // Tab Buttons Event Listener
  tabBtns.forEach(button => {
    button.addEventListener('click', () => {
      const infos = {};
      infos.time = button.innerText.toLowerCase();
      infos.tab = button.getAttribute('data-tab');
      getData(infos);
      if (isActive(button, 'active')) return;
      tabBtns.forEach(btn => removeActive(btn, 'active'));
      addActive(button, 'active');
    });
  });

  // Track Header Buttons Event Listener
  hdrBtns.forEach(button => {
    button.addEventListener('click', () => {
      if (isActive(button, 'active')) {
        removeActive(button, 'active');
        button.ariaExpanded = 'false';
        button.ariaLabel = 'Open Menu';
        return;
      }
      hdrBtns.forEach(btn => removeActive(btn, 'active'));
      addActive(button, 'active');
      button.ariaExpanded = 'true';
      button.ariaLabel = 'Close Menu';
    });
  });

  // Track Menu Buttons Event Listener
  menuBtns.forEach(button => {
    button.addEventListener('click', () => {
      const infos = {};
      infos.time = button.innerText.toLowerCase();
      infos.tab = button.getAttribute('data-tab');
      infos.timeBox = button.parentElement.parentElement.nextElementSibling;
      getData(infos);
    });
  });
})();
