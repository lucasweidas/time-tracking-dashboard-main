(() => {
  // Will get the data from JSON file
  getData('weekly', 'week');
  function getData(time, tab, element = null) {
    const resquest = new XMLHttpRequest();
    resquest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = resquest.response;
        if (element === null) return setAllTimeFrames(response, time, tab);
        setSingleTimeFrame(response, time, tab, element);
      }
    };
    resquest.open('GET', 'data.json');
    resquest.responseType = 'json';
    resquest.send();
  }

  // Will set the current and previous time data to ALL Cards
  function setAllTimeFrames(data, time, tab) {
    // Return an array with all current time data
    const currData = data.map(value => value.timeframes[time].current);
    // Return an array with all previous time data
    const prevData = data.map(value => value.timeframes[time].previous);
    const current = document.querySelectorAll('.time__curr');
    const previous = document.querySelectorAll('.time__prev');

    // This for loop will set current and previous time data for all elements
    for (let i = 0; i < current.length; i++) {
      current[i].innerText = `${currData[i]}hr${currData[i] === 1 ? '' : 's'}`;
      previous[i].innerText = `Last ${tab} - ${prevData[i]}hr${
        prevData[i] === 1 ? '' : 's'
      }`;
    }
  }

  // Will set the current and previous time data to a SINGLE Card
  function setSingleTimeFrame(data, time, tab, element) {
    const title = element.getAttribute('data-title');
    const current = element.querySelector('.time__curr');
    const previous = element.querySelector('.time__prev');
    // Return a single number with the current time data from a certain "title"
    const currData = data.reduce((res, value) => {
      if (value.title === title) {
        res = value.timeframes[time].current;
      }
      return res;
    }, 0);
    // Return a single number with the previous time data from a certain "title"
    const prevData = data.reduce((res, value) => {
      if (value.title === title) {
        res = value.timeframes[time].previous;
      }
      return res;
    }, 0);

    // Set the current and previous time data only for the "element" children
    current.innerText = `${currData}hr${currData === 1 ? '' : 's'}`;
    previous.innerText = `Last ${tab} - ${prevData}hr${
      prevData === 1 ? '' : 's'
    }`;
  }

  function addClass(element, name) {
    element.classList.add(name);
  }

  function removeClass(element, name) {
    element.classList.remove(name);
  }

  // Variables
  const tabBtns = document.querySelectorAll('.tab__btn');
  const hdrBtns = document.querySelectorAll('.track-hdr__btn');
  const menuBtns = document.querySelectorAll('.menu__btn');

  // Tab Buttons Event Listener
  tabBtns.forEach(button => {
    button.addEventListener('click', () => {
      const time = button.innerText.toLowerCase();
      const tab = button.getAttribute('data-tab');
      getData(time, tab);
      if (button.classList.contains('active')) return;
      tabBtns.forEach(btn => removeClass(btn, 'active'));
      addClass(button, 'active');
    });
  });

  // Track Header Buttons Event Listener
  hdrBtns.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('active'))
        return removeClass(button, 'active');
      hdrBtns.forEach(btn => btn.classList.remove('active'));
      addClass(button, 'active');
    });
  });

  // Track Menu Buttons Event Listener
  menuBtns.forEach(button => {
    button.addEventListener('click', () => {
      const time = button.innerText.toLowerCase();
      const tab = button.getAttribute('data-tab');
      const timeDiv = button.parentElement.parentElement.nextElementSibling;
      getData(time, tab, timeDiv);
    });
  });
})();
