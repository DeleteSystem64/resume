    var currentTitle = -1;
    var recentTitle = -1;
    var titles = ["Coda","Intro", "First Theme","Transition","Second Theme","Codetta","Development","Recapitulation"];
    var titleStarts = [319,4,12,36,53,93,197,233];
    var titleEnds = [347,12,36,53,93,101,233,319];
    var audio = document.getElementById("mozart");
    var recording = false;

    var start = 0;
    var end = 0;

    audio.load();
    
    audio.addEventListener('loadedmetadata', function () {
        // Set the total time once the audio has loaded
        document.getElementById("totalTime").textContent = Math.floor(audio.duration) + " seconds";
    });
    
    audio.controls = true;
    
    //updates current time & pauses audio when title is done
    function checkTime()
    {
        //alert("testing 123")

        //stops audio when current title's end is reached
        //will not do anything if there is no title currently selected (i.e. current title = -1)
        if(currentTitle > -1 && audio.currentTime >= titleEnds[currentTitle])
        {
            pauseAudio();
            recentTitle = currentTitle;
            currentTitle = -1;
        }

        //updates current time
        updateTime();
    }
    

    

    //skips to a time in the audio file. Will seek currentTime + secs. Secs can be negative
    function skip(secs)
    {
        audio.currentTime = audio.currentTime + secs;
    }

    //either plays or pauses the audio, depending on whether the audio is playing or not
    function togglePause()
    {
        if(recording)
        {
            alert("Can't pause while recording!");
        }
        //if audio is paused, then play
        else if(audio.paused)
        {
            playAudio();
           //change text on pause/play button
           
        }
        //if audio is playing, then pause it
        else
        {
            pauseAudio();
            //change text on pause/play button
            
        }
        //update whether audio is paused or not
        
    }

    //sets audio to playing
    function playAudio()
    {
        document.getElementById("pauseButton").innerText = "Pause";
        audio.play();
    }

    //sets audio to paused
    function pauseAudio()
    {
        document.getElementById("pauseButton").innerText = "Play";
        
        audio.pause();
    }

    //Update the HTML div that shows the current time of the song
    //in format minutes : seconds (e.g. 1:23)
    function updateTime()
    {
        let timeInSecs = mozart.currentTime;
        let mins = Math.floor(timeInSecs / 60);
        let secs = Math.floor(timeInSecs-(mins*60));
        let secsStr = "" + secs;
        if(secs < 10 ) secsStr = "0" + secs;
        document.getElementById('currentTime').textContent = mins+ ":"+secsStr;
    }

    //updates the titles div in html
    function updateTitles()
    {
        
        //sort the titles by when they start (selection sort)
        let titlesBuffer = [];
        let startsBuffer = [];
        let endsBuffer = [];
        while(titles.length > 0)
        {
            let min = 99999;
            let minIndex = -1;
            //find the minimum start value of the titles
            for(let i = 0; i < titles.length; i++)
            {
                if(titleStarts[i] < min)
                {
                    min = titleStarts[i];
                    minIndex = i;
                }
            } 
            //whatever has the minimum start time, remove its value from the 3 arrays and add it to the buffer
            titlesBuffer.push(titles[minIndex]);
            startsBuffer.push(titleStarts[minIndex]);
            endsBuffer.push(titleEnds[minIndex]);

            titles.splice(minIndex,1);
            titleStarts.splice(minIndex,1);
            titleEnds.splice(minIndex,1);
        }
        //to finish the sorting process, assign the buffers to the actual global arrays
        titles = titlesBuffer;
        titleStarts = startsBuffer;
        titleEnds = endsBuffer;
        //add the buttons to the titles div
        document.getElementById("titles").innerHTML = '';
        for(let i = 0; i < titles.length; i++)
        {
            const button = document.createElement("button");
            button.id = i;
            button.textContent = titles[i];
            button.addEventListener('click', playTitle);
            document.getElementById("titles").appendChild(button);
        }
    }

    //plays the title of the button pressed
    function playTitle(event)
    {
        
        seek(titleStarts[event.target.id]);
        currentTitle = event.target.id;
        playAudio();
    }
    
    //sets the currentTime of the audio to time (in secs)
    function seek(time)
    {
        audio.currentTime = time;
    }

    //adds a new title to the page.
    function record()
    {
        //dont allow user to make a title without a title
        if(document.getElementById("titleTextBox").value === '') 
        {
            alert("Type something into the box first!");
        }
        //if there are no available recordings to pick from, print error message and halt
        else
        {
            //if already recording, end the recording and add the title
            if(recording)
            {
                stopRecording();
                addTitle(document.getElementById("titleTextBox").value,start,end);
                document.getElementById("titleTextBox").value = "";
            }
            //if not recording, start recording
            else
            {
                startRecording();
            }
        }
    }

    //disables the ability to pause/play, and uses the current time to set the starting time for this title
    function startRecording()
    {
        //change text on recording button
        document.getElementById("recordButton").innerText = "Stop Recording";
        //disable ability to pause/play
        audio.controls = false;
        recording = true;
        //start playing the audio file
        playAudio();
        //the start time is the current time
        start = audio.currentTime;
       
    }

    //stops the audio file, and sets the end variable to the current time
    function stopRecording()
    {
        //change text on record button
        document.getElementById("recordButton").innerText = "Record";
        //enable ability to pause/play
        audio.controls = true;
        recording = false;
        //pause the audio
        pauseAudio();
        //set the end time as the current time
        end = audio.currentTime;
        
    }

    //adds a title with a name, and start and end times
    function addTitle(titleName, titleStart, titleEnd)
    {
        titles.push(titleName);
        titleStarts.push(titleStart);
        titleEnds.push(titleEnd);
        updateTitles();
    }

    //removes the currently selected title (or the most recently selected title)
    function removeTitle()
    {
        //remove the currently selected title if that's valid
        if(currentTitle > -1)
        {
            titles.splice(currentTitle,1);
            titleEnds.splice(currentTitle,1);
            titleStarts.splice(currentTitle,1);
            updateTitles();
        }
        //otherwise, remove the most recently selected title
        else if(recentTitle > -1)
        {
            titles.splice(recentTitle,1);
            titleEnds.splice(recentTitle,1);
            titleStarts.splice(recentTitle,1);
            updateTitles();
        }
        //in the case no title has been played at all, alert an error message
        else
        {
            alert("No title selected!");
        }
    }

    function myFunction() 
    {
        var x = document.getElementById("mozart");
        var string = "";
        var ranges = x.played;
        for(let i = 0; i < ranges.length; i++)
        {
            string += Math.floor(x.played.start(i)) + "-" + Math.floor(x.played.end(i)) + "<br>";
        }
        document.getElementById("demo").innerHTML = string;
      }

    function isPaused()
    {
        if(audio.paused) document.getElementById("pausedStatement").textContent = "Audio is paused.";
        else document.getElementById("pausedStatement").textContent = "Audio is not paused.";
    }
    function getVolume()
    {
        document.getElementById("volumeStatement").textContent = "Current volume: " + Math.floor(audio.volume*100) + "%";
    }
    function mute() {audio.volume = 0;}
    function incrementVolume()
    {
        audio.volume += .1;
    }
    function decrementVolume()
    {
        audio.volume -= .1;
    }

    //timer interval each second: updates current time and will stop the audio from playing after a title has finished
    setInterval(checkTime, 100);
    updateTitles();