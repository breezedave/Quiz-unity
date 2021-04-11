using System.Collections;
using System.Collections.Generic;
using System.Threading;
using UnityEngine;
using UnityEngine.UI;

public class Webcam : MonoBehaviour
{
    void Start()
    {
        Renderer rend = this.GetComponentInChildren<Renderer>();

        Application.RequestUserAuthorization(UserAuthorization.WebCam);
        if (Application.HasUserAuthorization(UserAuthorization.WebCam))
        {
            var cam = findWebCams();
            var texture = new WebCamTexture(cam.name);
            texture.Play();
           

            rend.material.mainTexture = texture;
            rend.material.mainTextureScale = new Vector2(.625f, 1f);
            rend.material.mainTextureOffset = new Vector2(.2f, 0f);


        }

    }

    WebCamDevice findWebCams()
    {
        foreach (var device in WebCamTexture.devices)
        {
            System.Console.WriteLine(device.name);
            if(device.name == "USB Video Device") return device;
        }

        return WebCamTexture.devices[0];
    }

    void findMicrophones()
    {
        foreach (var device in Microphone.devices)
        {
            Debug.Log("Name: " + device);
        }
    }
}