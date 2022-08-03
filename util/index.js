import readTextFile from "./jsonSale.js"
var app = null;
var allSpriteImg = {};
const createCvs = (w = document.body.clientWidth, h = document.body.clientHeight || document.documentElement.clientHeight, dom = document.body) => {
  app = new PIXI.Application({ width: w, height: h });
  dom.appendChild(app.view)
  app.width = w;
  app.height = h;
  app.renderer.view.style.position = "absolute";
  return app;
}
const gravity = (sprite,V0 = 0) =>{
}

async function analJson(json) {
  let jsons = await new Promise((resolve)=>{
    readTextFile(json, function (text) {
    let date = JSON.parse(text);
    resolve(date)
  });
  }) 
  return Object.keys(jsons.frames) 
}
const animal = (arr,rate)=>{
  let index = 0;
  let stop = false;
  let anima =new PIXI.AnimatedSprite(arr);
  anima.clear = ()=>{
    clearInterval(startRunInter)
  }
  anima.stops = ()=>{
    stop = true;
  }
  anima.starts = ()=>{
    stop = false;
  }
  let startRunInter = setInterval(()=>{
    if(stop){
      return;
    }
      anima.gotoAndStop(index)
      index++;
      if(index>=arr.length){
        index = 0;
      }
  },1000 * rate)
  return anima
  
}
async function loadImage(imgPath, jsonListName) {
  let loader = app.loader;
  let Sprite = PIXI.Sprite;
  let resources = app.loader.resources;
  let resultPic = await new Promise(resolve => {
    loader
      .add(imgPath)
      .load(setup);
    function setup() {
      let pathNameIndex = imgPath.lastIndexOf("/") + 1;
      let pathNameLastIndex = imgPath.lastIndexOf(".");
      let name = imgPath.slice(pathNameIndex, pathNameLastIndex)
      if (imgPath.slice(-4) == "json") {
        jsonListName.forEach(jsonName => {
          allSpriteImg[jsonName.slice(0, -4)] = new Sprite(resources[imgPath].textures[jsonName]);
        })
        console.log(allSpriteImg);
        resolve(allSpriteImg);
        return
      }
      //Create the cat sprite
      allSpriteImg[name] = new Sprite(resources[imgPath].texture);
      allSpriteImg[name].clone = () =>{
       let p = new Sprite(resources[imgPath].texture);
       p.path = imgPath
        return p;
      }
      // console.log(name,imgPath);
      // allSpriteImg[name].texture = PIXI.Texture.from(imgPath);
      allSpriteImg[name].path = imgPath
      allSpriteImg[name].change = (sprit)=>{
        let path = sprit.path;
        let pathNameIndex = path.lastIndexOf("/") + 1;
        let pathNameLastIndex = path.lastIndexOf(".");
        let sortPath = path.slice(pathNameIndex, pathNameLastIndex);
        allSpriteImg[name].texture = PIXI.Texture.from(path);
        // allSpriteImg[sortPath].texture
      }
      //Add the cat to the stage
      // app.stage.addChild(allSpriteImg[name]);
      resolve(allSpriteImg);
    }
  })
  return resultPic
}
const ArStage = (name, remove) => {
  if (remove) {
    app.stage.removeChild(name)
  } else {
    app.stage.addChild(name)
  }
}
export { createCvs, loadImage, ArStage, analJson ,gravity,animal}