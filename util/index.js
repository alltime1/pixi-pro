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
const gravity = (sprite, V0 = 0) => {
}

async function analJson(json) {
  let jsons = await new Promise((resolve) => {
    readTextFile(json, function (text) {
      let date = JSON.parse(text);
      resolve(date)
    });
  })
  return (jsons.frames && Object.keys(jsons.frames)) || jsons.SubTexture
}
const animal = (arr, rate) => {
  let index = 0;
  let stop = false;
  let anima = new PIXI.AnimatedSprite(arr);
  anima.clear = () => {
    clearInterval(startRunInter)
  }
  anima.stops = () => {
    stop = true;
  }
  anima.starts = () => {
    stop = false;
  }
  let startRunInter = setInterval(() => {
    if (stop) {
      return;
    }
    anima.gotoAndStop(index)
    index++;
    if (index >= arr.length) {
      index = 0;
    }
  }, 1000 * rate)
  console.log(anima);
  anima.active = true;
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
          allSpriteImg[jsonName.slice(0, -4)].speed = 0; // 默认初始化向上速度为0
        })
        resolve(allSpriteImg);
        return
      }

      //Create the cat sprite
      allSpriteImg[name] = new Sprite(resources[imgPath].texture);
      allSpriteImg[name].clone = () => {
        let index= 0;
        Object.keys(allSpriteImg).forEach(e=>{
          if(e.indexOf(name)>-1 && name.length!=e.length){
           index = Math.max(index,e.slice(+e.slice(name.length)))
          }else{
            index = 1;
          }
        })
        let p = new Sprite(resources[imgPath].texture);
        p.path = imgPath
        allSpriteImg[name +index] = p;
        return allSpriteImg[name +index];
      }
     
      // console.log(name,imgPath);
      // allSpriteImg[name].texture = PIXI.Texture.from(imgPath);
      allSpriteImg[name].path = imgPath
      allSpriteImg[name].speed = 0; // 默认初始化向上速度为0
      allSpriteImg[name].change = (sprit) => {
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
  console.log(name.active );
  
  if (remove) {
    app.stage.removeChild(name)
  } else {
    app.stage.addChild(name);
  }
  let stratRunTime = 0;

  let isStop = false;
  const downing = t => { // ok
    // 如果 位置到了格挡物就不能下降
    // 获取所有格挡位置 这个现在就写横板格挡就不考虑跳出去其实只要上面那条线就可以
    let gedangPost = [];
    Object.keys(allSpriteImg).forEach(ew => {
      if (allSpriteImg[ew].active != true) { // 都是格挡的
        gedangPost.push({
          x0: allSpriteImg[ew].x,
          y: allSpriteImg[ew].y,
          x1: allSpriteImg[ew].x + allSpriteImg[ew].width
        })
      }
    })
    // 判断是否触底
    // user 应该是个小图片
    let animaPosi = {
      x0: name.x,
      y: name.y + name.height,
      x1: name.x + name.width
    }
    gedangPost.forEach(ew => {
      if(name.speed>0){isStop = false}
      if(isStop){
        return;
      }
      // console.log(((ew.x0 <= animaPosi.x1 || ew.x1 >= animaPosi.x0) &&  ew.y >animaPosi.y));
      // console.log(ew.x1 <= animaPosi.x0);
      // console.log(ew.x0 , animaPosi.x1);
      if ((ew.x0 >= animaPosi.x1) || (ew.x1 <= animaPosi.x0) || ((ew.x0 <= animaPosi.x1 || ew.x1 >= animaPosi.x0) &&  ew.y >animaPosi.y)) {//掉下去
        stratRunTime += t;
        let v = (name.speed||0) - 0.08 * stratRunTime;        
        name.y -= v;
        // name.y = 100
      } else {
        name.speed=0;
        isStop = true;
        stratRunTime=0;
        return
      }
    })
   
  }
  if (name.active == true) { // 激活下落
    app.ticker.add(downing)
  }

}
export { createCvs, loadImage, ArStage, analJson, gravity, animal }