using UnityEngine;
using UnityEngine.Video;
using System.IO;
using System.Collections.Generic;
using UnityEngine.XR;
using TMPro;

public class VideoPlayerScript : MonoBehaviour
{
    VideoPlayer videoPlayer;
    Renderer rend;
    Texture2D imgTexture;
    TextMeshPro questionText;

    void Start()
    {
        videoPlayer = GetComponentInChildren<VideoPlayer>();
        videoPlayer.audioOutputMode = VideoAudioOutputMode.Direct;

        rend = videoPlayer.GetComponent<Renderer>();
        rend.material.mainTexture = Texture2D.blackTexture;
        imgTexture = new Texture2D(1920, 1080);

        questionText = GameObject.Find("QuestionText").GetComponent<TextMeshPro>();
        questionText.enabled = false;
    }

    public void Clear()
    {
        videoPlayer.Stop();
        rend = videoPlayer.GetComponent<Renderer>();
        rend.material.mainTexture = Texture2D.blackTexture;
        imgTexture = new Texture2D(1920, 1080);
    }

    public void Show(string type, string fileName, string question, string answer)
    {
        switch(type)
        {
            case "intro":
                ShowIntro(fileName);
                break;
            case "img":
                ShowImage(fileName);
                break;
            case "video":
                ShowVideo(fileName);
                break;
            case "question":
                ShowText(question);
                break;
        }
    }

    void ShowIntro(string imgFile)
    {
        questionText.enabled = false;
        videoPlayer.Stop();

        videoPlayer.url = @"C:\Users\breez\Desktop\Quiz\Intros\" + imgFile;

        rend.material.mainTexture = Texture2D.blackTexture;
        videoPlayer.Play();
    }

    void ShowVideo(string imgFile)
    {
        questionText.enabled = false;
        videoPlayer.Stop();

        videoPlayer.url = @"C:\Users\breez\Desktop\Quiz\" + imgFile;
        /*
        for (ushort i = 0; i < videoPlayer.audioTrackCount; i += 1) {
            videoPlayer.SetDirectAudioMute(i, true);
            videoPlayer.SetTargetAudioSource(i, audioSource);
        }
        */

        rend.material.mainTexture = Texture2D.blackTexture;
        videoPlayer.Play();
    }

    void ShowImage(string imgFile)
    {
        questionText.enabled = false;
        var image = File.ReadAllBytes(@"C:\Users\breez\Desktop\Quiz\" + imgFile);
        
        imgTexture.LoadImage(image);
        videoPlayer.Stop();
        rend.material.mainTexture = imgTexture;
    }

    void ShowText(string question)
    {
        questionText.text = question;
        questionText.enabled = true;
        videoPlayer.Stop();
        rend.material.mainTexture = Texture2D.blackTexture;
    }

}
