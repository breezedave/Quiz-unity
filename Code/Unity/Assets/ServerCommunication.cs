using System.Collections;
using UnityEngine;
using SimpleJSON;

public class ServerCommunication : MonoBehaviour
{
    [SerializeField]
    private string hostIP;
    [SerializeField]
    public int port = 3100;
    [SerializeField]
    private bool useLocalhost = true;
    private string host => useLocalhost ? "localhost" : hostIP;
    private string server;
    private WsClient client;
    public Room room;

    private void Awake()
    {
        server = "ws://" + host + ":" + port;
        client = new WsClient(server);
    }
    private void Update()
    {
        var cqueue = client.receiveQueue;
        string msg;
        while (cqueue.TryPeek(out msg))
        {
            cqueue.TryDequeue(out msg);
            HandleMessage(msg);
        }
    }
    private void HandleMessage(string msg)
    {
        var message = JsonUtility.FromJson<MessageModel>(msg);
        var countdownMusic = room.countdownMusic;

        switch (message.method)
        {
            case "PlayerList":
                room.LoadPlayers(message.message);
                break;
            case "CountdownLetters":
                room.inputHandler.ShowLetters(message.message);
                break;
            case "CountdownNumbers":
                room.inputHandler.ShowNumbers(message.message);
                break;
            case "CountdownNumbersTarget":
                room.inputHandler.ShowNumbersTarget(message.message);
                break;
            case "ClearCountdownBoard":
                room.inputHandler.ClearBoard(countdownMusic);
                break;
            case "ShowLettersAnswer":
                room.inputHandler.ShowLettersAnswer(message.message);
                break;
            case "ShowLetters":
                room.inputHandler.ShowLettersScreen();
                break;
            case "ShowNumbers":
                room.inputHandler.ShowNumbersScreen();
                break;
            case "LowerScreen":
                room.inputHandler.DropScreen();
                break;
            case "RaiseScreen":
                room.inputHandler.RaiseScreen();
                break;
            case "LowerCountdown":
                room.inputHandler.DropCountdown();
                break;
            case "RaiseCountdown":
                room.inputHandler.RaiseCountdown();
                break;
            case "ToggleClock":
                room.inputHandler.ToggleClock(countdownMusic);
                break;
            case "ShowOnScreen":
                var screen = JSON.Parse(message.message);

                room.videoPlayerScript.Show(
                    screen["type"].Value,
                    screen["fileName"].Value,
                    screen["question"].Value,
                    screen["answer"].Value
                );
                break;
            case "ClearScreen":
                room.videoPlayerScript.Clear();
                break;
            case "UpdateScore":
                room.inputHandler.UpdateScore(message.message);
                break;

        }

    }
    public async void ConnectToServer()
    {
        await client.Connect();
    }
    public void SendRequest(string message)
    {
        client.Send(message);
    }
}
