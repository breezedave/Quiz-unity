using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;
using UnityEngine.UIElements;
using SimpleJSON;
using System.Threading;

public class InputHandler : MonoBehaviour
{
    private bool sweepSpotlightRunning = false;
    private bool trophyToPedestalRunning = false;
    private bool viewingScreenMoving = false;
    private bool countdownMoving = false;

    private float clockTime = 0f;
    private bool clockRunning = false;
    private int currPed = -1;

    void Start()
    {

    }

    public void DropCountdown()
    {
        var countdown = GameObject.Find("Countdown");
        var letters = GameObject.Find("letters");
        var numbers = GameObject.Find("numbers");

        if (!countdownMoving)
        {
            letters.GetComponent<Renderer>().enabled = true;
            numbers.GetComponent<Renderer>().enabled = false;

            StartCoroutine(CountdownBoard(3f, countdown, 8f));
        }
    }

    public void RaiseCountdown()
    {
        var countdown = GameObject.Find("Countdown");

        if (!countdownMoving)
        {
            StartCoroutine(CountdownBoard(3f, countdown, 18f));
        }
    }

    public void UpdateScore(string scoresMsg)
    {
        StartCoroutine(ScoreUpdate(scoresMsg));
    }

    public void TrophyToPedestal(int pedestalCount, int targetPed)
    {
        if (!trophyToPedestalRunning)
        {
            StartCoroutine(TrophyPos(2f, pedestalCount, targetPed));
        }
    }

    public void SweepSpotlight()
    {
        var light = GameObject.Find("Spot Light");

        if (!sweepSpotlightRunning)
        {
            StartCoroutine(SpotlightRotation(5f, 1f, light));
        }
    }

    public void RaiseScreen()
    {
        var screen = GameObject.Find("ViewingScreen");

        if (!viewingScreenMoving)
        {
            StartCoroutine(ViewingScreen(2f, screen, 1.6f));
        }
    }

    public void DropScreen()
    {
        var screen = GameObject.Find("ViewingScreen");

        if (!viewingScreenMoving)
        {
            StartCoroutine(ViewingScreen(2f, screen, -6.4f));
        }
    }

    public void ToggleClock(AudioSource countdownMusic)
    {
        StartCoroutine(ClockRunner(countdownMusic));
    }

    public void CountdownLetterReset()
    {
        StartCoroutine(ResetLetters());
    }

    public void ShowLettersScreen()
    {
        var letters = GameObject.Find("letters");
        var numbers = GameObject.Find("numbers");

        letters.GetComponent<Renderer>().enabled = true;
        numbers.GetComponent<Renderer>().enabled = false;
    }

    public void ShowNumbersScreen()
    {
        var letters = GameObject.Find("letters");
        var numbers = GameObject.Find("numbers");

        letters.GetComponent<Renderer>().enabled = false;
        numbers.GetComponent<Renderer>().enabled = true;
    }

    public void ShowLetter(string field, string val)
    {
        var countdown = GameObject.Find("Countdown");

        countdown
            .GetComponentsInChildren<TextMeshPro>()
            .ToList()
            .ForEach(_ =>
            {
                if (_.name == field)
                {
                    _.enabled = true;
                    _.text = val;
                }
            });
    }

    public void ClearBoard(AudioSource countdownMusic)
    {
        countdownMusic.Stop();

        var countdown = GameObject.Find("Countdown");

        countdown
          .GetComponentsInChildren<TextMeshPro>()
          .ToList()
          .ForEach(_ =>
          {
              _.enabled = false;
              _.text = "";
          });

        clockTime = 0f;
        clockRunning = false;

        var clockArrow = GameObject.Find("Countdown Arrow");
        var quat = clockArrow.transform.rotation;
        var euler = new Vector3(180, 0, 180);
        quat.eulerAngles = euler;
        clockArrow.transform.rotation = quat;
    }

    public void ShowLetters(string message)
    {
        var letters = JSON.Parse(message);

        for(int i=0; i < letters.Count; i += 1)
        {
            ShowLetter("Q" + (i+1), letters[i].Value);
        }
    }

    public void ShowNumbers(string message)
    {
        var numbers = JSON.Parse(message);

        for(int i = 0; i < numbers.Count; i += 1)
        {
            ShowLetter("NQ" + (i + 1), numbers[i].Value);
        }
    }

    public void ShowNumbersTarget(string message)
    {
        var numbers = JSON.Parse(message);

        for (int i = 0; i < numbers.Count; i += 1)
        {
            ShowLetter("NA" + (i + 1), numbers[i].Value);
        }
    }

    public void ShowLettersAnswer(string message)
    {
        var letters = JSON.Parse(message);
        
        for(int i=0; i < letters.Count; i += 1)
        {
            ShowLetter("A" + (i + 1), letters[i].Value);
        }
    }


    public IEnumerator ScoreUpdate(string scoresMsg)
    {
        var countdown = GameObject.Find("Countdown");
        var screen = GameObject.Find("ViewingScreen");    
        var scores = JSON.Parse(scoresMsg);
        var currWinner = -1;
        var currTopScore = -1;

        var time = 0f;
        while( time < 2f)
        {
            time += Time.deltaTime;
            yield return null;
        }

        for (int i = 0; i < scores.Count; i += 1)
        {
            var ped = GameObject.Find("Pedestal_" + i);
            var score = ped.GetComponentsInChildren<TextMeshPro>().First(_ => _.name == "Score");

            score.text = scores[i].Value;



            if (int.Parse(scores[i].Value) > currTopScore)
            {
                currTopScore = int.Parse(scores[i].Value);
                currWinner = i;
            }
        }

        StartCoroutine(TrophyPos(2f, scores.Count, currWinner));
        countdownMoving = false;
        viewingScreenMoving = false;

    }

    IEnumerator TrophyPos(float duration, int pedestalCount, int targetPed)
    {
        trophyToPedestalRunning = true;
        
        if(currPed < 0)
        {
            if (targetPed > pedestalCount / 2) currPed = pedestalCount;
        }
        
        
        float time = 0;

        while(time < duration)
        {
            var centerPointY = 5.5f;
            var centerPointZ = -13f;
            var distFromCenter = 10.5f;

            var posI = ((targetPed - currPed) * (time / duration)) + currPed; 

            var theta = 140f / pedestalCount * (posI + (pedestalCount % 2 == 1 ? 0 : .5f) - pedestalCount / 2) * Mathf.Deg2Rad;
            var oppositeSide = Mathf.Sin(theta) * distFromCenter;
            var adjacentSide = Mathf.Cos(theta) * distFromCenter;

            var pos = new Vector3(
                oppositeSide,
                centerPointY + (Mathf.Sin(time / duration * Mathf.Deg2Rad * 180) ),
                centerPointZ + adjacentSide
            );

            var trophy = GameObject.Find("Trophy");

            trophy.transform.position = pos;

            trophyToPedestalRunning = false;

            time += Time.deltaTime;

            yield return null;

        }

        currPed = targetPed;

    }

    IEnumerator SpotlightRotation(float duration, float duration2, GameObject light)
    {
        sweepSpotlightRunning = true;

        float time = 0;
        float intensity = 5f;
        light.GetComponent<Light>().intensity = intensity;
        float theta = 0;

        while (time < duration || theta <= 0)
        {
            theta = Mathf.Sin(time) * 55f;
            var rot = light.transform.rotation;
            var rotEuler = new Vector3(rot.eulerAngles.x, theta, rot.eulerAngles.z);

            rot.eulerAngles = rotEuler;
            light.transform.rotation = rot;
            time += Time.deltaTime;

            yield return null;
        }

        time = 0;
        while ( time < duration2)
        {
            float fallingIntensity = (duration2 - time) / duration2 * intensity;
            light.GetComponent<Light>().intensity = fallingIntensity;
            time += Time.deltaTime;

            yield return null;
        }

        light.GetComponent<Light>().intensity = 0f;

        sweepSpotlightRunning = false;
    }

    IEnumerator ViewingScreen(float duration, GameObject screen, float targetY)
    {
        viewingScreenMoving = true;

        float time = 0;
        float origY = screen.transform.position.y;

        while (time < duration)
        {
            var pos = new Vector3(
                screen.transform.position.x,
                origY + ((targetY - origY) * time / duration),
                screen.transform.position.z
            );

            screen.transform.position = pos;

            time += Time.deltaTime;

            yield return null;
        }

        viewingScreenMoving = false;
    }

    IEnumerator CountdownBoard(float duration, GameObject countdown, float targetY)
    {
        countdownMoving = true;

        float time = 0;
        float origY = countdown.transform.position.y;

        if (origY != targetY)
        {
            while (time < duration)
            {
                var pos = new Vector3(
                    countdown.transform.position.x,
                    origY + ((targetY - origY) * time / duration),
                    countdown.transform.position.z
                );

                countdown.transform.position = pos;

                time += Time.deltaTime;

                yield return null;

            }

            countdownMoving = false;
        }

        yield return null;

    }

    IEnumerator ClockRunner(AudioSource countdownMusic)
    {
        clockRunning = !clockRunning;

        if (clockRunning)
        {
            countdownMusic.Play();
        } else
        {
            countdownMusic.Pause();
        }
        var room = GameObject.Find("Room");

        var clockArrow = GameObject.Find("Countdown Arrow"); 
        var quat = clockArrow.transform.rotation;

        while (clockTime < 30f && clockRunning)
        {
            clockTime += Time.deltaTime;

            var euler = new Vector3(180, 0, 180 + clockTime / 30f * 180);
            quat.eulerAngles = euler;
            clockArrow.transform.rotation = quat;
            
            yield return null;
        }

        while (clockTime < 35f && clockRunning)
        {
            clockTime += Time.deltaTime;
            yield return null;
        }

        if(clockRunning)
        {
            clockTime = 0;

            var euler = new Vector3(180, 0, 180);
            quat.eulerAngles = euler;
            clockArrow.transform.rotation = quat;

            countdownMusic.Stop();

            yield return null;
        }

        clockRunning = false;
    }

    IEnumerator ResetLetters()
    {
        var countdown = GameObject.Find("Countdown");

        countdown
            .GetComponentsInChildren<TextMeshPro>()
            .ToList()
            .ForEach(_ =>
            {
                _.enabled = false;
            });

        yield return null;
    }
}
