import * as PIXI from "./libs/pixi.min.mjs";
import { io } from "./libs/socket.io.esm.min.js";

class Block extends PIXI.Container {
  static SIZE = 20;
  /**
   * @type vi
   */
  #block;
  #x;
  #y;

  constructor(y, x) {
    super();
    this.#x = x;
    this.#y = y;

    this.#create(y, x);
  }

  #create(y, x, color = 0x1099bb) {
    this.#block = new PIXI.Graphics();
    this.#block.beginFill(color);
    this.#block.drawRoundedRect(x, y, Block.SIZE, Block.SIZE, 1);
    this.#block.endFill();

    this.addChild(this.#block);
  }

  updateAsBody() {
    this.removeChildren();
    this.#create(this.#y, this.#x, 0xDA3219);
  }

  updateAsHead() {
    this.removeChildren();
    this.#create(this.#y, this.#x, 0xFF3219);
  }

  updateAsEmpty() {
    this.removeChildren();
    this.#create(this.#y, this.#x);
  }

  updateAsFood() {
    this.removeChildren();
    this.#create(this.#y, this.#x, 0x2d0220);
  }
}

class Grid {

  /**
   * @type {[Block][]}
   */
  #matrix = null;
  #row;
  #col;

  get matrix() {
    return this.#matrix;
  }

  populate(canvas) {
    this.#matrix = Array(this.#row).fill(0).map(() => Array(this.#col).fill(0));
    for (let r = 0; r < this.#row; ++r) {
      for (let c = 0; c < this.#col; ++c) {
        this.#matrix[r][c] = new Block(r * Block.SIZE, c * Block.SIZE);
        canvas.stage.addChild(this.#matrix[r][c]);
      }
    }
  }

  setRow(row) {
    this.#row = row;
  }

  setCol(col) {
    this.#col = col;
  }

  get(y, x) {
    return this.#matrix[y]?.[x];
  }
}


const matrix = new Grid();

const speedValue = document.querySelector("div.status>div.speed>strong");
const pointValue = document.querySelector("div.status>div.point>strong");
const lengthValue = document.querySelector("div.status>div.length>strong");


(async () => {
  const uuidIsValid = (uuid) => fetch("/users/sign-in", {
    method: "POST",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ key: uuid })
  }).then(response => response.ok).catch(() => false);

  const getUUID = async () => {
    const uuid = localStorage.getItem("SNAKE_UID");
    if (uuid && await uuidIsValid(uuid)) return uuid;

    return fetch("/users/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Coffee" })
    }).then(response => response.text()).then(uuid => {
      localStorage.setItem("SNAKE_UID", uuid);
      return uuid;
    });
  };

  const userId = await getUUID();
  const gameIO = io("/game", { auth: { userId } });
  gameIO.on("connect", () => {
    console.log("Connected.", `SocketID: ${gameIO.id}`);
    gameIO.emit("create", { userId, name: "Table 001" }, ({ gameId, error }) => {
      if (error) return console.error("Ups", error);

      console.log({ gameId }, "joining...");
      gameIO.emit("join", { userId, gameId }, () => {
        console.log("Joined.");
      });
    });

    gameIO.on("game:started", ({ rows, cols, food }) => {
      const idx = i => {
        return {
          row: Math.floor(i / cols),
          col: i % cols
        };
      };
      const width = cols * Block.SIZE;
      const height = rows * Block.SIZE;
      const canvas = new PIXI.Application({ width, height, background: "#1099bb" });
      document.body.appendChild(canvas.view);

      matrix.setCol(cols);
      matrix.setRow(rows);
      matrix.populate(canvas);

      const foodPos = idx(food);
      const foodBlock = matrix.get(foodPos.row, foodPos.col);
      foodBlock.updateAsFood();

      const previousBlocks = [];
      gameIO.on("food:spawn", ({ points }) => {
        points.map(idx).map(({ row, col }) => matrix.get(row, col)).map((block) => block.updateAsFood());
      });
      gameIO.on("food:devour", (eaten) => {
        const { row, col } = idx(eaten.point);
        matrix.get(row, col).updateAsEmpty();
      });

      gameIO.on("player:positions", ({ blocks }) => {
        previousBlocks.map((block) => block.updateAsEmpty());
        previousBlocks.length = 0;

        for (const block of blocks) {
          const cell = matrix.get(block.y, block.x);
          previousBlocks.push(cell);
          if (block.type === "body") {
            cell?.updateAsBody();
            if (block.isHead) cell?.updateAsHead();
          }
        }
      });

      gameIO.on("grid:result", (grid) => {
        console.log("Grid", grid);
      });

      const snake = {}, game = {};
      window.onload = () => {
        // game.run();
        // bots.map(bot => bot.run());
      };
      window.onkeydown = (e) => {
        if (["ArrowLeft", "KeyA"].includes(e.code)) gameIO.emit("player:direction", {
          playerId: userId,
          direction: "Left"
        });
        if (["ArrowRight", "KeyD"].includes(e.code)) gameIO.emit("player:direction", {
          playerId: userId,
          direction: "Right"
        });
        if (["ArrowDown", "KeyS"].includes(e.code)) gameIO.emit("player:direction", {
          playerId: userId,
          direction: "Down"
        });
        if (["ArrowUp", "KeyW"].includes(e.code)) gameIO.emit("player:direction", {
          playerId: userId,
          direction: "Up"
        });
        if (["KeyR"].includes(e.code)) {
          game.reset();
          game.run();
        }
        if (["Space"].includes(e.code)) gameIO.emit("player:accelerate", { playerId: userId, accelerate: true });
      };
      window.onkeyup = (e) => {
        if (["Space"].includes(e.code)) gameIO.emit("player:accelerate", { playerId: userId, accelerate: false });
      };
    });
  });

  gameIO.on("player:died", console.warn);
  gameIO.on("error", console.error);

})();
