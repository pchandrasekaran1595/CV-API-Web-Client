main = () => {
    let image_input = document.querySelector("#image_input")

    let preview_canvas = document.querySelector("#preview_canvas")
    let preview_ctx = preview_canvas.getContext("2d")
    let preview_w = preview_canvas.getAttribute("width")
    let preview_h = preview_canvas.getAttribute("height")

    let hidden_canvas = document.querySelector("#hidden_canvas")
    let hidden_ctx = hidden_canvas.getContext("2d")
    let hidden_canvas_data = null

    let preview_image = new Image()
    let hidden_image = new Image()

    let classify = document.querySelector("#classify")
    let detect = document.querySelector("#detect")
    let segment = document.querySelector("#segment")
    let reset = document.querySelector("#reset")

    let output = document.querySelector("#output")

    image_input.addEventListener("change", (e1) => {
        if(e1.target.files){
            let imageFile = e1.target.files[0]
            let reader = new FileReader()
            reader.readAsDataURL(imageFile)
            reader.onload = (e2) => {
                preview_image.src = e2.target.result
                hidden_image.src = e2.target.result

                hidden_image.onload = () => {
                    preview_ctx.drawImage(preview_image, 0, 0, preview_w, preview_h)

                    hidden_canvas.setAttribute("width", hidden_image.width)
                    hidden_canvas.setAttribute("height", hidden_image.height)
                    hidden_ctx.drawImage(hidden_image, 0, 0, hidden_canvas.width, hidden_canvas.height)
                    hidden_canvas_data = hidden_canvas.toDataURL()
                }
            }
        }
    })

    classify.addEventListener("click", () => {
        if (hidden_canvas_data === null){
            alert("Please Upload an Image First")
        }
        else{

            let data = {
                data : JSON.stringify({
                    imageData : hidden_canvas_data,
                }),
            }

            $.ajax({
                type : "POST",
                // url : "http://127.0.0.1:10000/classify/",
                url : "https://pcs-cv-api.herokuapp.com/classify/",
                data : data,
                success : (response) => {
                    console.log(" ---------- ")
                    console.log(`Success, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")

                    output.value = response["label"]
                },
                error : (response) => {
                    console.log(" ---------- ")
                    console.log(`Failure, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")
                },
            })
        }
    })

    detect.addEventListener("click", () => {
        if (hidden_canvas_data === null){
            alert("Please Upload an Image First")
        }
        else{

            let data = {
                data : JSON.stringify({
                    imageData : hidden_canvas_data,
                }),
            }

            $.ajax({
                type : "POST",
                // url : "http://127.0.0.1:10000/detect/",
                url : "https://pcs-cv-api.herokuapp.com/detect/",
                data : data,
                success : (response) => {
                    console.log(" ---------- ")
                    console.log(`Success, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")

                    output.value = response["label"]
                    x1 = Number(response["x1"])
                    y1 = Number(response["y1"])
                    x2 = Number(response["x2"])
                    y2 = Number(response["y2"])
                    
                    preview_x1 = Math.floor(Number(x1 * preview_w / hidden_image.width))
                    preview_y1 = Math.floor(Number(y1 * preview_h / hidden_image.height))
                    preview_x2 = Math.floor(Number(x2 * preview_w / hidden_image.width))
                    preview_y2 = Math.floor(Number(y2 * preview_h / hidden_image.height))

                    preview_ctx.beginPath()
                    preview_ctx.strokeStyle = "green"
                    preview_ctx.lineWidth = "2"
                    preview_ctx.rect(preview_x1, preview_y1, preview_x2 - preview_x1, preview_y2 - preview_y1)
                    preview_ctx.stroke()
                   
                },
                error : (response) => {
                    console.log(" ---------- ")
                    console.log(`Failure, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")
                },
            })
        }
    })

    segment.addEventListener("click", () => {
        if (hidden_canvas_data === null){
            alert("Please Upload an Image First")
        }
        else{

            let data = {
                data : JSON.stringify({
                    imageData : hidden_canvas_data,
                }),
            }

            $.ajax({
                type : "POST",
                // url : "http://127.0.0.1:10000/segment/",
                url : "https://pcs-cv-api.herokuapp.com/segment/",
                data : data,
                success : (response) => {
                    console.log(" ---------- ")
                    console.log(`Success, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")

                    output.value = response["labels"]

                    hidden_image.src = response["imageData"]
                    hidden_image.onload = () => {
                        preview_image.src = response["imageData"]
                        preview_ctx.drawImage(preview_image, 0, 0, preview_w, preview_h)
                        hidden_ctx.drawImage(hidden_image, 0, 0, hidden_canvas.width, hidden_canvas.height)
                    }
                },
                error : (response) => {
                    console.log(" ---------- ")
                    console.log(`Failure, ${response["statusText"]}, ${response["statusCode"]}`)
                    console.log(" ---------- ")
                },
            })
        }
    })

    reset.addEventListener("click", () => {
        hidden_canvas_data = null
        preview_image.src = ""
        hidden_image.src = ""
        preview_ctx.clearRect(0, 0, preview_w, preview_h)
        image_input.value = ""
        output.value = ""
    })
    
}

main()