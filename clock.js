<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Work 1-3</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
</head>

<body>
  <script src="index.js"></script>
  <div id="root">
    <div id="buttons" style="display: inline-block;">
      <button id="normal" class="btn btn-primary">
        일반시계
      </button>
      <button id="timer" class="btn btn-primary">
        초시계
      </button>
      <button id="start" class="btn btn-secondary">
        시작
      </button>
      <button id="stop" class="btn btn-secondary">
        중지
      </button>
      <button id="lap" class="btn btn-secondary">
        랩타입
      </button>
    </div>
    <div id="watch" class="table-responsive" style="margin: 10; font-size: 2em; font-weight: bold"></div>
    <div id="rank"></div>
  </div>

  <!-- Extending Date.prototype -->
  <script>
    Date.prototype.toHMS = function (time) {
      var hour = Math.floor(time / 60 / 60 / 1000);
      var min = Math.floor(time / 60 / 1000) % 60;
      var sec = Math.floor(time / 1000) % 60;

      hour = hour < 10 ? "0" + hour : hour;
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;

      return hour + ":" + min + ":" + sec;
    }

    Date.prototype.toHMSS = function (time) {
      var ms = time % 1000;
      ms = ms < 10 ? "00" + ms : ms < 100 ? "0" + ms : ms;

      return this.toHMS(time) + ":" + ms;
    }

    Date.prototype.createTimer = function () {
      this.timerValue = 0;
      this.pausePointValue = 0;
      this.timerFlag = true;
      this.pointValue = new Date().getTime();
    }

    Date.prototype.destroyTimer = function () {
      this.timerFlag = false;
      clearInterval(this.timerInterval);
      clearInterval(this.pauseTimerInterval);

      this.timerInterval = null;
      this.pauseTimerInterval = null;
    }

    Date.prototype.startTimer = function () {
      // loop
      this.timerInterval = setInterval(function (date) {
        if (!date.timerFlag) return;

        date.timerValue = new Date().getTime() - date.pointValue;
      }, 1, this);
    }

    Date.prototype.resumeTimer = function () {
      if (this.timerFlag) return;

      this.timerFlag = true;

      clearInterval(this.pauseTimerInterval);
      this.pointValue += this.pausePointValue;
    }

    Date.prototype.pauseTimer = function () {
      if (!this.timerFlag) return;

      this.timerFlag = false;
      var pointValue = new Date().getTime();

      // loop
      this.pauseTimerInterval = setInterval(function (date, pointValue) {
        date.pausePointValue = new Date().getTime() - pointValue;
      }, 1, this, pointValue);
    }

    Date.prototype.getTimerValue = function () {
      return this.timerValue;
    }

    Date.prototype.setTimerValue = function (value) {
      this.timerValue = value;
    }
  </script>

  <!-- Scripting Page DOM -->
  <script>
    var watch = document.getElementById("watch");
    var rank = document.getElementById("rank");
    var normalButton = document.getElementById("normal");
    var timerButton = document.getElementById("timer");
    var startButton = document.getElementById("start");
    var stopButton = document.getElementById("stop");
    var lapButton = document.getElementById("lap");

    var normalInterval = null;
    var timerInterval = null;
    var date = new Date();
    var point = null;

    // event handlers & start
    document.addEventListener("DOMContentLoaded", function () {
      normalButton.onclick = function (e) {
        setMode(1);
      }

      timerButton.onclick = function (e) {
        setMode(2);
      }

      startButton.onclick = function (e) {
        start();
      }

      stopButton.onclick = function (e) {
        stop();
      }

      lapButton.onclick = function (e) {
        lap();
      }

      // start
      setMode(1);
    });

    // change clock mode
    function setMode(mode) {
      // clear
      clearInterval(normalInterval);
      clearInterval(timerInterval);
      normalInterval = null;
      timerInterval = null;

      // buttons
      startButton.hidden = mode !== 2;
      stopButton.hidden = mode !== 2;
      lapButton.hidden = mode !== 2;

      // clear timer
      date.destroyTimer();
      clearRank();

      // mode
      if (mode === 1) {
        normal();
      } else {
        date.createTimer();
        timer();
      }
    }

    // normal clock
    function normal() {
      if (!normalInterval) {
        normalInterval = setInterval(normal, 1000);
      }

      var date = new Date();
      watch.innerText = date.toLocaleTimeString();
    }

    // timer clock
    function timer() {
      if (!timerInterval) {
        timerInterval = setInterval(timer, 1);
        date.startTimer();
        date.pauseTimer();
      }

      watch.innerText = date.toHMSS(date.getTimerValue());
    }

    // start timer
    function start() {
      date.resumeTimer();
    }

    // stop timer
    function stop() {
      date.pauseTimer();
    }

    // record lap-time
    function lap() {
      var text = rank.children.length + 1 + ") " + date.toHMSS(date.getTimerValue());
      var node = document.createElement("div");
      rank.append(text, node);
    }

    // clear lap-times
    function clearRank() {
      while (rank.firstChild) {
        rank.removeChild(rank.firstChild);
      }
    }
  </script>
</body>

</html>
