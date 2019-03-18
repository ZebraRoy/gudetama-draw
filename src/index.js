const app = new PIXI.Application({
  width: innerWidth,
  height: innerHeight,
  resolution: 2
});

const texturesPath = [
  "Bad_Egg.png",
  "Brik_Egg.PNG.png",
  "Burnt_Egg.png",
  "Caesar_Salad.png",
  "Cream_Puff.png",
  "Datemaki_Egg.PNG.png",
  "Egg_Burger.PNG.webp",
  "Egg_Sushi.png",
  "Egg.png",
  "Egglasses.png",
  "Eggs_Benedict.png",
  "Eggs_n_Rice.png",
  "Eggs_n_Toast.PNG.png",
  "Gossip_Egg.png",
  "Hard_Boiled.png",
  "Homebody_Egg.png",
  "Horseback_Egg.PNG.webp",
  "Kozuyu_Egg.png",
  "Masked_Egg.png",
  "Over_Easy_Egg.png",
  "Raw_Egg.png",
  "Sakura_Mochi.png",
  "Sliced_Egg.png",
  "Slumber_Egg1.png",
  "Sponge_Cake.png",
  "Sticky_Yam_Rice.png",
  "Sunny_Side_Up.PNG.png",
  "rectangle-black.png",
  "rectangle-blue.png",
  "rectangle-green.png",
  "rectangle-purple.png",
  "rectangle-white.png",
  "Troublegg.png"
];

function loadAsset () {
  texturesPath.forEach(
    (name) => {
      PIXI.loader.add(name, `img/${name}`);
    }
  )
  PIXI.loader.load(onAssetsLoaded);
}

document.body.appendChild(app.view);

const UI = new PIXI.Container();
const mainStage = new PIXI.Container();
const scaleDot = new PIXI.Graphics();
mainStage.y = 100;
mainStage.addChild(scaleDot);
app.stage.scale.set(0.5);
let clickedSprite;
let lastClickedSprite;

function updateScaleDotPoint () {
  const lastClickedSpriteDistance = Math.max(clickedSprite.width, clickedSprite.height) / 2;
  scaleDot.x = clickedSprite.x + lastClickedSpriteDistance * Math.cos(clickedSprite.rotation);
  scaleDot.y = clickedSprite.y + lastClickedSpriteDistance * Math.sin(clickedSprite.rotation);
}


scaleDot.beginFill(0xff0000, 0.5);
scaleDot.drawCircle(25, 25, 25);
scaleDot.endFill();
scaleDot.visible = false;
scaleDot.interactive = true;
{
  // let startPoint;
  // let startWidth;
  // scaleDot.pointerdown = (e) => {
  //   lastClickedSprite = scaleDot;
  //   startWidth = clickedSprite.width;
  //   startPoint = {
  //     x: e.data.global.x,
  //     y: e.data.global.y
  //   };
  // }
  // scaleDot.pointermove = (e) => {
  //   if (lastClickedSprite === scaleDot) {
  //     const lastResult = startPoint;
  //     const currentResult = {
  //       x: e.data.global.x,
  //       y: e.data.global.y
  //     }
  //     const diffX = (currentResult.x - lastResult.x) * 2;
  //     const diffY = (currentResult.y - lastResult.y) * 2;
  //     const newWidth = startWidth + diffX;
  //     clickedSprite.width = newWidth;
  //     clickedSprite.scale.y = clickedSprite.scale.x;
  //     scaleDot.x = clickedSprite.x + clickedSprite.width / 2 - 25;
  //     scaleDot.y = clickedSprite.y + clickedSprite.height / 2 - 25;
  //   }
  // }
  let lastPoint;
  let lastSize;
  scaleDot.pointerdown = (e) => {
    lastClickedSprite = scaleDot;
    lastSize = Math.max(clickedSprite.width, clickedSprite.height);
    lastPoint = {
      x: e.data.global.x,
      y: e.data.global.y
    };
  }
  scaleDot.pointermove = (e) => {
    if (lastClickedSprite === scaleDot) {
      const lastResult = lastPoint;
      const currentResult = {
        x: e.data.global.x,
        y: e.data.global.y
      }
      scaleDot.x += (currentResult.x - lastResult.x) * 2;
      scaleDot.y += (currentResult.y - lastResult.y) * 2;
      lastPoint = currentResult;
      const diffX = scaleDot.x - clickedSprite.x;
      const diffY = scaleDot.y - clickedSprite.y;
      const rotation = Math.atan2(diffY, diffX);
      clickedSprite.rotation = rotation;
      const lastClickedSpriteDistance = Math.sqrt(diffX*diffX + diffY*diffY);
      const size = Math.max(clickedSprite.texture.baseTexture.width, clickedSprite.texture.baseTexture.height);
      const scale = lastClickedSpriteDistance * 2 / size;
      clickedSprite.scale.set(scale);
    }
  }
  scaleDot.pointerup = (e) => {
    lastClickedSprite = null;
  }
  scaleDot.pointerupoutside = (e) => {
    lastClickedSprite = null;
  }
}

const topBar = new PIXI.Graphics();

const topBarScrollArea = new PIXI.Container();

let UILastPoint = {
  x: 0,
  y: 0
};

let UIIsDown = false;

UI.interactive = true;
UI.pointerdown = (e) => {
  UILastPoint = {
    x: e.data.global.x,
    y: e.data.global.y
  };
  UIIsDown = true;
}
UI.pointermove = (e) => {
  if (UIIsDown) {
    const lastPoint = UILastPoint;
    const newPoint = {
      x: e.data.global.x,
      y: e.data.global.y
    };
    topBarScrollArea.x += (newPoint.x - lastPoint.x) * 2;
    UILastPoint = newPoint;
  }
}

UI.pointerup = UI.pointerupoutside = () => {
  UIIsDown = false;
}

UI.addChild(
  topBar,
  topBarScrollArea
);

function onAssetsLoaded () {
  const icons = texturesPath.map((texturePath) => {
    const texture = PIXI.loader.resources[texturePath].texture;
    const sprite = new PIXI.Sprite(texture);
    const minRatio = Math.min(50 / texture.width, 50 / texture.height);
    sprite.scale.set(minRatio);
    sprite.anchor.set(0.5);
    return sprite;
  })
  const streams = [];
  icons.forEach((sprite, i) => {
    const col = Math.floor(i / 2);
    const row = i % 2;
    sprite.x = col * 50 + 25;
    sprite.y = row * 50 + 25;
    sprite.interactive = true;
    topBarScrollArea.addChild(sprite);
    streams.push(
      rxjs
        .fromEvent(sprite, "pointerup")
        .pipe(
          rxjs.operators.map(e => ({
            name: texturesPath[i],
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
          }))
        )
    );
  });
  const addStream = rxjs.merge(...streams);
  addStream
    .subscribe(({ name, x, y, scale, rotation }) => {
      const texture = PIXI.loader.resources[name].texture;
      const newSprite = new PIXI.Sprite(texture);
      let isClick = false;
      let isScaleMode = false;
      let lastPoint = {
        x: 0,
        y: 0
      };
      newSprite.anchor.set(0.5);
      newSprite.x = x;
      newSprite.y = y;
      newSprite.scale.set(scale);
      newSprite.rotation = rotation;
      newSprite.interactive = true;
      newSprite.pointerdown = (e) => {
        lastClickedSprite = newSprite;
        clickedSprite = newSprite;
        mainStage.removeChild(newSprite);
        mainStage.removeChild(scaleDot);
        mainStage.addChild(newSprite, scaleDot);
        scaleDot.visible = true;
        updateScaleDotPoint();
        lastPoint = {
          x: e.data.global.x,
          y: e.data.global.y
        };
      }
      newSprite.pointermove = (e) => {
        if (lastClickedSprite === newSprite) {
          const lastResult = lastPoint;
          const currentResult = {
            x: e.data.global.x,
            y: e.data.global.y
          }
          newSprite.x += (currentResult.x - lastResult.x) * 2;
          newSprite.y += (currentResult.y - lastResult.y) * 2;
          lastPoint = currentResult;
          updateScaleDotPoint();
        }
      }
      newSprite.pointerup = (e) => {
        lastClickedSprite = null;
      }
      newSprite.pointerupoutside = (e) => {
        lastClickedSprite = null;
      }
      mainStage.addChild(newSprite);
      mainStage.removeChild(scaleDot);
      mainStage.addChild(scaleDot);
      clickedSprite = newSprite;
      scaleDot.visible = true;
      updateScaleDotPoint();
    })
}


topBar.beginFill(0xFFFFFF);
topBar.drawRect(
  0,
  0,
  innerWidth,
  100
);
topBar.endFill();

app.stage.addChild(
  UI,
  mainStage
);

loadAsset();