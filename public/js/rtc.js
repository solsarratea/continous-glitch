let datachannel;

function connect() {
	// Connect to signalling server.
	let socket = io.connect('http://localhost:8080');
    console.log('connected to signalling server');

	// Start WebRTC handshake. (with social distance)
	let pc = new RTCPeerConnection({"iceServers":[{"urls":"stun:stun.l.google.com:19302"}]});
	pc.onicecandidate = e => {
		if (e.candidate) {
			socket.emit('candidate', e.candidate);
		}
	}
	datachannel = pc.createDataChannel("data", {negotiated: true, id: 0});
	datachannel.onopen = e => {
		console.log("datachannel open!");
	};
	datachannel.onmessage = onmsg;
	datachannel.binaryType = "arraybuffer"
	datachannel.onclose = e => {
		console.log("datachannel closed!");
	};
	datachannel.onerror = e => {
		console.log("datachannel error:", e);
	};

	socket.on('hello', async data => {
		console.log("got hello", data)
		await pc.setLocalDescription(await pc.createOffer())
		socket.emit('offer', pc.localDescription)
	});
	socket.on('offer', async data => {
		console.log("got offer")
		await pc.setRemoteDescription(new RTCSessionDescription(data));
		await pc.setLocalDescription(await pc.createAnswer());
		socket.emit('answer', pc.localDescription);
	})
	socket.on('answer', async data => {
		console.log("got answer")
		await pc.setRemoteDescription(new RTCSessionDescription(data));
	})
	socket.on('candidate', data => {
		console.log("got candidate")
		pc.addIceCandidate(new RTCIceCandidate(data));
	})

	socket.emit('hello', {something:"something"})
}

function onmsg(e) {
	let msg = JSON.parse(e.data)
	if (msg.kind = 'imageDOM') {
		document.body.style.backgroundImage = `url(${img.src}), url(${msg.path})`;
	} else if (msg.kind = 'image') {
		var offset = Math.random();
		loadImage(msg.path, imgB => {
			let dx = mouseX - imgB.width / 2 - offset;
			tint(255, 127);
			image(imgB, offset, 0);
		});
	}
}
