let datachannels = [];

function connect() {
	// Connect to signalling server.
	let socket = io.connect('http://localhost:8080'),
		id = Math.floor(Math.random()*100000);

    console.log('connected to signalling server');

	// Start WebRTC handshake. (with social distance)
	let pcs = new Map();
	
	socket.on('hello', async data => {
		console.log("got hello", data)
		let pc = createPeerConnection(socket,pcs,data, id);
		await pc.setLocalDescription(await pc.createOffer());
		socket.emit('offer', {from: id, to: data.from, offer: pc.localDescription })
	});

	socket.on('offer', async data => {
		if (data.to == id){
			let pc = createPeerConnection(socket,pcs,data,id);
			console.log("got offer",pc)
			await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
			await pc.setLocalDescription(await pc.createAnswer());
			socket.emit('answer', {from: id, to: data.from, answer: pc.localDescription});
		}
	});

	socket.on('answer', async data => {
		if (data.to == id){
			let pc = pcs.get(data.from);
			console.log("got answer")
			await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
	}})

	socket.on('candidate', data => {
		if (data.to == id){
			let pc = pcs.get(data.from);
			console.log("got candidate")
			pc.addIceCandidate(new RTCIceCandidate(data.candidate));
		}
	})

	socket.emit('hello', {from: id})
}

function onmsg(e) {
	console.log("show",e)
	let msg = JSON.parse(e.data)
	if (msg.kind = 'imageDOM') {
		document.body.style.backgroundImage = `url(${img.src}), url(${msg.path})`;
	} else if (msg.kind = 'image') {
		console.log("apply random")
		var offset = Math.random();
		loadImage(msg.path, imgB => {
			let dx = mouseX - imgB.width / 2 - offset;
			tint(255, 127);
			image(imgB, offset, 0);
		});
	}
}

function broadcast(msg){
	for (let index = 0; index < datachannels.length; index++) {
		datachannels[index].send(msg);	
	}
}

function createPeerConnection(socket,pcs,data,id){
	let pc = new RTCPeerConnection({"iceServers":[{"urls":"stun:stun.l.google.com:19302"}]});

	pc.onicecandidate = e => {
		if (e.candidate) {
			socket.emit('candidate', {to: data.from , from: id ,candidate: e.candidate});
		}
	}
	let datachannel = pc.createDataChannel("data", {negotiated: true, id: 0});
	datachannel.onopen = e => {
		console.log("datachannel open!");
		datachannels.push(datachannel);
	};
	datachannel.onmessage = e => {
		onmsg(e)
	}


	datachannel.binaryType = "arraybuffer"
	datachannel.onclose = e => {
		console.log("datachannel closed!",e);
		datachannels.splice(datachannels.indexOf(datachannel),1);
	};
	datachannel.onerror = e => {
		console.log("datachannel error:", e);
	};
	pcs.set(data.from, pc);
	return pc;
}