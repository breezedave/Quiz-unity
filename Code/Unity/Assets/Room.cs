using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using System.IO;
using System;

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
            SetPedMat(ped, i);
            SetScoreboard(ped, player);
            SetPicture(ped, player);
        }
    }

    GameObject CreatePedestal(int pedestalCount, int i)
    {
        var pedestal = GameObject.Find("Pedestal");
        var centerPointY = 2f;
        var centerPointZ = -13f;
        var distFromCenter = 10f;

        var theta = 140f / pedestalCount * (i + (pedestalCount % 2 == 1 ? 0 : .5f) - pedestalCount / 2) * Mathf.Deg2Rad;
        var oppositeSide = Mathf.Sin(theta) * distFromCenter;
        var adjacentSide = Mathf.Cos(theta) * distFromCenter;

        var pos = new Vector3(
            oppositeSide,
            centerPointY,
            centerPointZ + adjacentSide
        );

        var rot = new Quaternion();
        rot.eulerAngles = new Vector3(-90f, 180f + ((i + (pedestalCount % 2 == 1 ? 0 : .5f) - pedestalCount / 2) * 20), 0f);

        var ped = Instantiate(pedestal);
        ped.name = "Pedestal_" + i;
        ped.layer = 0;
        ped.transform.SetParent(this.transform);
        ped.transform.rotation = rot;
        ped.transform.position = pos;

        return ped;
    }

    void SetPedMat(GameObject ped, int i)
    {
        var pedestaLRend = ped.GetComponent<Renderer>();
        var pedestalMats = pedestaLRend.materials;
        var pedestalMat = pedestalMats.First(_ => _.name == "PedestalStand (Instance)");
        pedestalMat.color = colors[i % colors.Count];
        pedestalMat.EnableKeyword("_EMISSION");
        pedestalMat.SetColor("_EmissionColor", new Color(pedestalMat.color.r, pedestalMat.color.g, pedestalMat.color.b, 1f));
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
        var picture = ped.GetComponentsInChildren<Component>().First(_ => _.name == "Picture");
        picture.gameObject.layer = 2;

        var playerImg = (Texture)resources.First(_ => _.name.IndexOf(player.img) >= 0);
        var pictureMat = picture.GetComponent<Renderer>().material;
        pictureMat.mainTexture = playerImg;
        pictureMat.mainTextureScale = new Vector2(-1f, -1f);
        pictureMat = new Material(Shader.Find("Standard"));
    }


}
