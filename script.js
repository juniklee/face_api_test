const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
    // canvas를 초기화 함
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
   // 100ms 마다 화면에 video frame이 표시 됨
  setInterval(async () => {
      // video에서 얼굴을 식별
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // video에서 얼굴 좌표에 box를 그림
    resizedDetections.forEach(detection => {

      const box = detection.detection.box; 

      const drawBox = new faceapi.draw.DrawBox(box, {label: 'Face'})
      drawBox.draw(canvas)
      // box의 좌표 값과 너비, 길이를 콘솔창에 출력
      console.log(Math.ceil(box.x));

       // 얼굴 좌표값 인식후 페이지 넘김
      if(box.x < 50 ){
        //console.log("합격");
        location.href="https://yeso.spaceedu.co.kr/html/index_AI.html"
      }
  })
  }, 100)
  
 
})
