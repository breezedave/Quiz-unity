using UnityEngine;

public class Webcam : MonoBehaviour
{
    void Start()
    {
        Renderer rend = this.GetComponentInChildren<Renderer>();
        Shader spriteShader = Shader.Find("Sprites/Default");

        Application.RequestUserAuthorization(UserAuthorization.WebCam);
        if (Application.HasUserAuthorization(UserAuthorization.WebCam))
        {
            var cam = findWebCams();
            var texture = new WebCamTexture(cam.name);

            texture.Play();
          
            rend.material.mainTexture = texture;
            rend.material.shader = spriteShader;
            rend.material.mainTextureScale = new Vector2(1f, 1f);
            rend.material.mainTextureOffset = new Vector2(0f, 0f);
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
}