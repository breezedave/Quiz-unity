using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using System.IO;
using System;
using UnityEngine.Networking;

[System.Serializable]
public class Players
{
    public List<Player> players;
}

public class Room : MonoBehaviour
{
    [SerializeField]
    private ServerCommunication communication;

    [SerializeField]
    public InputHandler inputHandler;

    [SerializeField]
    public VideoPlayerScript videoPlayerScript;

    [SerializeField]
    public AudioSource countdownMusic;
    
    private List<GameObject> pedestals = new List<GameObject>();
    private List<Player> players = new List<Player>();
    private UnityEngine.Object[] resources;

    List<Color> colors = new List<Color>{
        Color.green,
        Color.yellow,
        Color.blue,
        Color.cyan,
        Color.magenta,
        Color.red,
        Color.yellow
    };

    // Start is called before the first frame update
    void Start()
    {
        resources = Resources.LoadAll("");
        communication.ConnectToServer();
        inputHandler.CountdownLetterReset();
        countdownMusic.clip = (AudioClip)resources.First(_ => _.name == "Countdown");
    }

    private void Update()
    {
        if(Input.GetKeyDown("x"))
        {
            inputHandler.SweepSpotlight();

        }
    }

    public void LoadPlayers(string playersStr)
    {
        players = JsonUtility.FromJson<Players>(playersStr).players;

        var pedestalCount = players.Count();

        for (int i = 0; i < pedestalCount; i += 1)
        {
            var ped = CreatePedestal(pedestalCount, i);
            var player = players[i];

            pedestals.Add(ped);
            //SetPedMat(ped, i);
            SetScoreboard(ped, player);
            SetPicture(ped, player);
        }
    }

    GameObject CreatePedestal(int pedestalCount, int i)
    {
        var isLarge = pedestalCount <= 6;

        var pedestal = GameObject.Find("Pedestal");
        var centerPointY = isLarge? 4.65f: 3.1f;
        var centerPointZ = -13f;
        var distFromCenter = 10f;

        var theta = 155f / pedestalCount * (i + (pedestalCount % 2 == 1 ? 0 : .5f) - pedestalCount / 2) * Mathf.Deg2Rad;
        var oppositeSide = Mathf.Sin(theta) * distFromCenter;
        var adjacentSide = Mathf.Cos(theta) * distFromCenter;

        var pos = new Vector3(
            oppositeSide,
            centerPointY,
            centerPointZ + adjacentSide
        );

        if(!isLarge) pedestal.transform.localScale = new Vector3(70f, 70f, 70f);

        var rot = new Quaternion();
        rot.eulerAngles = new Vector3(0f, 180f + Math.Min(60, Math.Max(-60, (i + (pedestalCount % 2 == 1 ? 0 : .5f) - pedestalCount / 2) * 20)), 0f);

        var ped = Instantiate(pedestal);
        ped.name = "Pedestal_" + i;
        ped.layer = 0;
        ped.transform.SetParent(this.transform);
        ped.transform.rotation = rot;
        ped.transform.position = pos;

        return ped;
    }

    void SetScoreboard(GameObject ped, Player player)
    {
        var textName = ped.GetComponentsInChildren<TextMeshPro>().First(_ => _.name == "Name");
        textName.text = player.name;

        var textScore = ped.GetComponentsInChildren<TextMeshPro>().First(_ => _.name == "Score");
        textScore.text = player.score.ToString();
    }

    void SetPicture(GameObject ped, Player player)
    {
        Shader spriteShader = Shader.Find("Sprites/Default");

        var picture = ped.GetComponentsInChildren<Component>().First(_ => _.name == "Picture");
        picture.gameObject.layer = 2;

        var pictureMat = picture.GetComponent<Renderer>().material;
        pictureMat.shader = spriteShader;
        pictureMat.mainTextureScale = new Vector2(1f, 1f);
        
        if (resources.Count(_ => _.name.IndexOf(player.img) >= 0) > 0) { 
            pictureMat.mainTexture = (Texture)resources.First(_ => _.name.IndexOf(player.img) >= 0);
        } else {
            if(File.Exists(player.img))
            {
                var fileData = File.ReadAllBytes(player.img);
                var tex = new Texture2D(2, 2);

                tex.LoadImage(fileData);
                pictureMat.mainTexture = tex;
            } else
            {
                StartCoroutine(DownloadImage(player.img, pictureMat));
            }
        }
    }

    IEnumerator DownloadImage(string MediaUrl, Material pictureMat)
    {
        UnityEngine.Networking.UnityWebRequest request = UnityWebRequestTexture.GetTexture(MediaUrl);
        yield return request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
            Debug.Log(request.error);
        else
            pictureMat.mainTexture = ((DownloadHandlerTexture)request.downloadHandler).texture;
    }


}
