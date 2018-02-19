function ImageResize() {
    var img = document.createElement('img');
    var string = "" +document.getElementById("myURL");
    img.src = string;
    document.body.appendChild(img);

    myimg = document.getElementById('mmg');
    myimg.style.height = "50px";
    myimg.style.width = "50px";
    return myimg;
}
