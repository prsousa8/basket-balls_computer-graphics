<h1 align="center">Game	Cesta	de	Bolinhas</h1>

<p align="justify">O projeto é uma simulação física interativa baseada em um sistema de partículas, permitindo a interação do usuário. Esse jogo consiste em uma "cesta" ou "bacia" que pode ser controlada pelo mouse. As bolinhas, geradas como partículas no topo da tela, caem seguindo as leis da física. O desafio do jogador é capturá-las antes que atinjam o solo. A simulação incorpora conceitos de física, como gravidade e colisões, garantindo um comportamento realista tanto na queda das bolinhas quanto na interação com a cesta e o ambiente. 🚀</p>

## Vídeo do Projeto

Link do vídeo mostrando o projeto em funcionamento <br>
<a href="" target="_blank"> Clique aqui!</a>

## Tecnologias e Ferramentas Utilizadas 🔧

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"/>
  <img width="12" />

Para criar um ambiente adequado de desenvolvimento Web, executamos os seguintes passos:


### Editor de código

Escolha um editor de código de sua preferência. Algumas opções populares incluem o Visual Studio Code, Sublime Text, Atom, entre outros. Você pode baixar e instalar o Visual Studio Code em https://code.visualstudio.com/.

### 1. **Usar o CDN**
Você pode incluir o Three.js diretamente em seu projeto HTML através de um link CDN. Este é o método mais simples para quem quer começar rapidamente, sem gerenciar dependências:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Three.js</title>
	<link rel="stylesheet" href="./main.css">
	<script type="importmap">
		{
		  "imports": {
			"three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
			"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/"
		  }
		}
	  </script>
</head>
<body>
	<canvas id="three-canvas"></canvas>
  <script type="module" src="main.js"></script>
</body>
</html>
```

## Executando o Projeto ⏳

Para executar o projeto, realize as seguintes etapas:

### Clone do repositório

- Verifique se o git está instalado na sua máquina
- Digite o comando via terminal

~~~
git clone https://github.com/prsousa8/basket-balls_computer-graphics.git
~~~


### Execução

Utilize a extensão Live Server do VS Code para rodar o projeto localmente.

## Colaboradores

<table align="center">
<tr>
  <td align="center"><a href="https://github.com/caua-braga-de-lima"><img src="assets/equipe/caua.jpeg" width="70%;" alt="Cauã Braga"/><br /><sub><b>Cauã Braga</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Geovanarsouza"><img src="assets/equipe/geo.jpg" width="70%;" alt="Geovana Rodrigues"/><br /><sub><b>Geovana Rodrigues</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/prsousa8"><img src="assets/equipe/paulo.jpeg" width="70%;" alt="Paulo Ricardo"/><br /><sub><b>Paulo Ricardo</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Raquel-Luis-Duarte"><img src="assets/equipe/raquel.jpeg" width="70%;" alt="Raquel Duarte"/><br /><sub><b>Raquel Duarte</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/Samuel-C-C"><img src="assets/equipe/samuel.jpeg" width="70%;" alt="Samuel Camilo"/><br /><sub><b>Samuel Camilo</b></sub></a><br/></td>
  <td align="center"><a href="https://github.com/YasminEmily"><img src="assets/equipe/yasmin.jpeg" width="70%;" alt="Yasmin Emily"/><br /><sub><b>Yasmin Emily</b></sub></a><br/></td>
</tr>
</table>
