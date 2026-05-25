import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import LinkIcon from '@mui/icons-material/Link';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" },
        { "urls": "stun:stun3.l.google.com:19302" },
        { "urls": "stun:stun4.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])
    let [localStream, setLocalStream] = useState(null);
    let [copySuccess, setCopySuccess] = useState(false);
    let [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const recordingStreamRef = useRef(null);

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    }, [])

    useEffect(() => {
        if (localVideoref.current && localStream) {
            localVideoref.current.srcObject = localStream;
        }
    }, [localStream, askForUsername]);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" },
                audio: true
            });

            recordingStreamRef.current = stream;
            recordedChunksRef.current = [];

            let options = { mimeType: 'video/webm; codecs=vp9' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm; codecs=vp8' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options = { mimeType: 'video/webm' };
                }
            }

            const recorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `meeting-record-${new Date().toISOString().slice(0, 10)}.webm`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);

                if (recordingStreamRef.current) {
                    recordingStreamRef.current.getTracks().forEach(track => track.stop());
                }
                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);

            stream.getVideoTracks()[0].onended = () => {
                if (recorder.state !== "inactive") {
                    recorder.stop();
                }
            };

        } catch (err) {
            console.error("Error starting screen recording: ", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const getPermissions = async () => {
        try {
            if (!navigator.mediaDevices) {
                console.warn("navigator.mediaDevices is undefined. Make sure you are using HTTPS or localhost.");
                setVideoAvailable(false);
                setAudioAvailable(false);
                setScreenAvailable(false);
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setVideoAvailable(true);
            setAudioAvailable(true);
            window.localStream = stream;
            setLocalStream(stream);
            if (localVideoref.current) {
                localVideoref.current.srcObject = stream;
            }
        } catch (error) {
            console.log("Error getting both video and audio, trying video only...", error);
            try {
                if (navigator.mediaDevices) {
                    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setVideoAvailable(true);
                    setAudioAvailable(false);
                    window.localStream = videoStream;
                    setLocalStream(videoStream);
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = videoStream;
                    }
                }
            } catch (err2) {
                console.log("Error getting video, trying audio only...", err2);
                try {
                    if (navigator.mediaDevices) {
                        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        setVideoAvailable(false);
                        setAudioAvailable(true);
                        window.localStream = audioStream;
                        setLocalStream(audioStream);
                        if (localVideoref.current) {
                            localVideoref.current.srcObject = audioStream;
                        }
                    }
                } catch (err3) {
                    console.log("No media permissions granted:", err3);
                    setVideoAvailable(false);
                    setAudioAvailable(false);
                }
            }
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            setScreenAvailable(true);
        } else {
            setScreenAvailable(false);
        }
    };


    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        setLocalStream(stream)
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // Remove existing senders to prevent duplicate tracks
            const senders = connections[id].getSenders();
            senders.forEach(sender => connections[id].removeTrack(sender));

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream);
                });
            }

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            setLocalStream(window.localStream)
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                const senders = connections[id].getSenders();
                senders.forEach(sender => connections[id].removeTrack(sender));

                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => {
                        connections[id].addTrack(track, window.localStream);
                    });
                }

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        setLocalStream(stream)
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            const senders = connections[id].getSenders();
            senders.forEach(sender => connections[id].removeTrack(sender));

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream);
                });
            }

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            setLocalStream(window.localStream)
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => {
                    const updatedVideos = videos.filter((video) => video.socketId !== id);
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });

                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
            })

            const initializePeerConnection = (socketListId) => {
                connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                connections[socketListId].onicecandidate = function (event) {
                    if (event.candidate != null) {
                        socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                    }
                };

                const handleRemoteStream = (stream) => {
                    console.log("BEFORE:", videoRef.current);
                    console.log("FINDING ID: ", socketListId);

                    setVideos(prevVideos => {
                        let videoExists = prevVideos.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");
                            const updatedVideos = prevVideos.map(video =>
                                video.socketId === socketListId ? { ...video, stream: stream } : video
                            );
                            videoRef.current = updatedVideos;
                            return updatedVideos;
                        } else {
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: stream,
                                autoplay: true,
                                playsinline: true
                            };
                            const updatedVideos = [...prevVideos, newVideo];
                            videoRef.current = updatedVideos;
                            return updatedVideos;
                        }
                    });
                };

                connections[socketListId].ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        handleRemoteStream(event.streams[0]);
                    }
                };

                if (window.localStream !== undefined && window.localStream !== null) {
                    window.localStream.getTracks().forEach(track => {
                        connections[socketListId].addTrack(track, window.localStream);
                    });
                } else {
                    let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    window.localStream.getTracks().forEach(track => {
                        connections[socketListId].addTrack(track, window.localStream);
                    });
                }
            };

            socketRef.current.on('user-joined', (id, clients) => {
                if (id === socketIdRef.current) {
                    clients.forEach((socketListId) => {
                        if (socketListId === socketIdRef.current) return;
                        if (connections[socketListId]) return;

                        initializePeerConnection(socketListId);
                    });
                } else {
                    if (!connections[id]) {
                        initializePeerConnection(id);
                    }
                }

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const newVideoState = !video;
        setVideo(newVideoState);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => {
                track.enabled = newVideoState;
            });
        }
    }
    let handleAudio = () => {
        const newAudioState = !audio;
        setAudio(newAudioState);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => {
                track.enabled = newAudioState;
            });
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let copyMeetingLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);
            })
            .catch(err => console.log('Failed to copy: ', err));
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <h2 className={styles.lobbyTitle}>Join Meeting Lobby</h2>
                        <div className={styles.lobbyVideoContainer}>
                            <video ref={localVideoref} autoPlay muted></video>
                        </div>
                        <div className={styles.lobbyInputGroup}>
                            <TextField 
                                id="outlined-basic" 
                                label="Username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                variant="outlined" 
                                fullWidth
                            />
                            <Button variant="contained" onClick={connect}>Connect</Button>
                        </div>
                    </div>
                </div> :


                <div className={styles.meetVideoContainer}>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <h1>Chat</h1>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div className={styles.messageBubble} key={index}>
                                            <span className={styles.messageSender}>{item.sender}</span>
                                            <span className={styles.messageText}>{item.data}</span>
                                        </div>
                                    )
                                }) : <p>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                                <Button variant='contained' onClick={sendMessage}>Send</Button>
                            </div>


                        </div>
                    </div> : <></>}


                    {copySuccess && (
                        <div className={styles.copyNotification}>
                            Link copied! Share it with others to join.
                        </div>
                    )}

                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                        <IconButton onClick={copyMeetingLink} style={{ color: "#FF9839" }} title="Copy Meeting Link">
                            <LinkIcon />
                        </IconButton>

                        <IconButton onClick={handleToggleRecording} style={{ color: isRecording ? "red" : "white" }} title={isRecording ? "Stop Recording" : "Record Meeting"}>
                            {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
                        </IconButton>

                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted playsInline></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}
