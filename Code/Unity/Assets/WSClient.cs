using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using UnityEngine;

public class WsClient
{
    private ClientWebSocket ws = new ClientWebSocket();
    private UTF8Encoding encoder;
    private const UInt64 MAXREADSIZE = 1 * 1024 * 1024;
    private Uri serverUri;
    public ConcurrentQueue<String> receiveQueue { get; }
    public BlockingCollection<ArraySegment<byte>> sendQueue { get; }
    private Thread receiveThread { get; set; }
    private Thread sendThread { get; set; }
    public WsClient(string serverURL)
    {
        encoder = new UTF8Encoding();
        ws = new ClientWebSocket();
        serverUri = new Uri(serverURL);
        receiveQueue = new ConcurrentQueue<string>();
        receiveThread = new Thread(RunReceive);
        receiveThread.Start();
        sendQueue = new BlockingCollection<ArraySegment<byte>>();
        sendThread = new Thread(RunSend);
        sendThread.Start();
    }

    public async Task Connect()
    {
        Debug.Log("Connecting to: " + serverUri);
        await ws.ConnectAsync(serverUri, CancellationToken.None);
        while (IsConnecting())
        {
            Debug.Log("Waiting to connect...");
            Task.Delay(50).Wait();
        }
        Debug.Log("Connect status: " + ws.State);
    }
   
    #region [Status]
    public bool IsConnecting()
    {
        return ws.State == WebSocketState.Connecting;
    }
    
    public bool IsConnectionOpen()
    {
        return ws.State == WebSocketState.Open;
    }
    #endregion
    
    #region [Send]
    
    public void Send(string message)
    {
        byte[] buffer = encoder.GetBytes(message);
        //Debug.Log("Message to queue for send: " + buffer.Length + ", message: " + message);
        var sendBuf = new ArraySegment<byte>(buffer);
        sendQueue.Add(sendBuf);
    }
    
    private async void RunSend()
    {
        Debug.Log("WebSocket Message Sender looping.");
        ArraySegment<byte> msg;
        while (true)
        {
            while (!sendQueue.IsCompleted)
            {
                msg = sendQueue.Take();
                //Debug.Log("Dequeued this message to send: " + msg);
                await ws.SendAsync(msg, WebSocketMessageType.Text, true /* is last part of message */, CancellationToken.None);
            }
        }
    }
    #endregion
    
    #region [Receive]
    
    private async Task<string> Receive(UInt64 maxSize = MAXREADSIZE)
    {
        // A read buffer, and a memory stream to stuff unknown number of chunks into:
        byte[] buf = new byte[4 * 1024];
        var ms = new MemoryStream();
        ArraySegment<byte> arrayBuf = new ArraySegment<byte>(buf);
        WebSocketReceiveResult chunkResult = null;
        if (IsConnectionOpen())
        {
            do
            {
                chunkResult = await ws.ReceiveAsync(arrayBuf, CancellationToken.None);
                ms.Write(arrayBuf.Array, arrayBuf.Offset, chunkResult.Count);
                //Debug.Log("Size of Chunk message: " + chunkResult.Count);
                if ((UInt64)(chunkResult.Count) > MAXREADSIZE)
                {
                    Console.Error.WriteLine("Warning: Message is bigger than expected!");
                }
            } while (!chunkResult.EndOfMessage);
            ms.Seek(0, SeekOrigin.Begin);
            // Looking for UTF-8 JSON type messages.
            if (chunkResult.MessageType == WebSocketMessageType.Text)
            {
                return CommunicationUtils.StreamToString(ms, Encoding.UTF8);
            }
        }
        return "";
    }
    
    private async void RunReceive()
    {
        Debug.Log("WebSocket Message Receiver looping.");
        string result;
        while (true)
        {
            //Debug.Log("Awaiting Receive...");
            result = await Receive();
            if (result != null && result.Length > 0)
            {
                receiveQueue.Enqueue(result);
            }
            else
            {
                Task.Delay(50).Wait();
            }
        }
    }
    #endregion
}