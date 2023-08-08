let frames = 0;

const efeitoSomPonto = new Audio();
efeitoSomPonto.src = './efeitos/ponto.wav';

const efeitoSomPulo = new Audio();
efeitoSomPulo.src = './efeitos/pulo.wav';

const efeitoSocoRyu = new Audio();
efeitoSocoRyu.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const placar = {
          
          pontuação: 0,

          desenha(){
            contexto.font = "35px Roboto Slab";
            contexto.fillStyle = "white";
            contexto.align = "right";
            contexto.fillText(`${placar.pontuação}`, canvas.width / 2, canvas.height / 2);
          },

          atualiza(){
      
          if(placar.pontuação >= 0){
            placar.pontuação += 1;
          };
        },
      };


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
}

// [Chao]
function criarChao(){
  const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,

  atualiza(){
    const movimentoChao = 1;
    const repeteEm = chao.largura / 2;
    const movimentacao = chao.x = chao.x - movimentoChao;
    chao.x = movimentacao % repeteEm;

  },

  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

return chao;

};
  
function criarFlappyBird(){
  const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  pula(){
    flappyBird.velocidade = - flappyBird.pulo;
    efeitoSomPulo.play();
  },
  gravidade: 0.25,
  velocidade: 0,
  pulo: 4.6,

  atualiza(){

    if(fazColisao(flappyBird, globais.chao)){
      efeitoSocoRyu.play();
      mudarTela(telas.GAMEOVER);
      
      return;
    }

    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    flappyBird.y = flappyBird.y + flappyBird.velocidade;
  },

  movimentos: [
    {spriteX: 0, spriteY: 0,},
    {spriteX: 0, spriteY: 26,},
    {spriteX: 0, spriteY: 52,}
  ],

  frameAtual: 0,

  atualizarFrame(){
    const intervalo = 10;
    const passouIntervalo = frames % intervalo === 0;

    if(passouIntervalo){
      const baseIncremento = 1;
      const incremento = baseIncremento + flappyBird.frameAtual;
      const baseRepeticao = flappyBird.movimentos.length;
      flappyBird.frameAtual = incremento % baseRepeticao;
    }
  },

  desenha() {
    flappyBird.atualizarFrame();
    const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual]; 
    contexto.drawImage(
      sprites,
      spriteX, spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    );
  },
};

return flappyBird;

}

function criarCanos(){
  const canos = {
    largura: 52,
    altura: 400,
    pontos: 0,
    
    chao: {
      spriteX: 0,
      spriteY: 169
    },

    ceu: {
      spriteX: 52,
      spriteY: 169
    },

    espaco: 80,

    desenha(){
      canos.pares.forEach(function(par){
        const yRandomCanos =  par.y;
        const espacoEntreCanos = 140;

        const canoCeuX = par.x;
        const canoCeuY = yRandomCanos;
         // canos do céu
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura
        );

        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacoEntreCanos + yRandomCanos;
        // canos do chão
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }

        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }

      });

      contexto.font = "35px Roboto Slab";
      contexto.fillStyle = "white";
      contexto.align = "right";
      contexto.fillText(`${canos.pontos}`, 80, 50);
    },

    colisaoCanos(par){

      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x){
        
        if(cabecaDoFlappy <= par.canoCeu.y){
          return true;
        };

        if(peDoFlappy >= par.canoChao.y){
          return true;
        };
      };
      
      return false;
    },

    pares: [],

    atualiza(){
      const passou100Frames = frames % 100 === 0;

      if(passou100Frames){
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        }); 
      };

      canos.pares.forEach(function(par){
         par.x = par.x - 2;

         if(canos.colisaoCanos(par)){
            efeitoSocoRyu.play();
            mudarTela(telas.GAMEOVER);
         }

         if(par.x + canos.largura <= 0){
          canos.pares.shift();
         }

         if(par.x + canos.largura < globais.flappyBird.x){
          
            console.log(canos.pontos++);
        
          
          
          efeitoSomPonto.play();
         }

      }); 
    },
  };

  return canos;
};

//Imagem get ready
const imagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites,
      imagemGetReady.sX, imagemGetReady.sY,
      imagemGetReady.w, imagemGetReady.h,
      imagemGetReady.x, imagemGetReady.y,
      imagemGetReady.w, imagemGetReady.h,
    );
  },
};

const imagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites,
      imagemGameOver.sX, imagemGameOver.sY,
      imagemGameOver.w, imagemGameOver.h,
      imagemGameOver.x, imagemGameOver.y,
      imagemGameOver.w, imagemGameOver.h,
    );
  },
};

const globais = {};
let telaAtiva = {};

function mudarTela(novaTela){
  telaAtiva = novaTela;

  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
};

const telas = {
  INICIO: {

    inicializa(){
      globais.flappyBird = criarFlappyBird();
      globais.chao = criarChao();
    },

    desenha(){
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      imagemGetReady.desenha();
    },

    action(){
      mudarTela(telas.JOGO);
    },

    atualiza(){
     globais.chao.atualiza();
    },
  },
};

telas.GAMEOVER = {
  
  desenha(){
    imagemGameOver.desenha();
  },

  atualiza(){
    console.log("Para mudar a tela, após o gameover!");
  },

  action(){
    mudarTela(telas.INICIO);
  },
};

telas.JOGO = {

  inicializa(){
    globais.canos = criarCanos();
  },

  desenha(){
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },

  action(){
    globais.flappyBird.pula();
  },

  atualiza(){
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames += 1;
  requestAnimationFrame(loop);
}

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY){
    return true;
  }

  return false;
}

window.addEventListener("keypress", function(){
  
  if(telaAtiva.action){
    telaAtiva.action();
  }

});

window.addEventListener("click", function(){
  
  if(telaAtiva.action){
    telaAtiva.action();
  }

});

mudarTela(telas.INICIO);
loop();