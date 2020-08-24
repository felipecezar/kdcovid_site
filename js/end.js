let resultado = localStorage.getItem("resultado") || '0';
console.log(resultado);
let classificacao = [];

window.onload = function() {
  this.carregarClassficacao();
}

carregarClassficacao = () => {
  fetch("./classificacao.json")
  .then(res => res.json())
  .then(json => {
    classificacao = json;
  })
  .then(() => {
    exibirResposta();
  })
}

exibirResposta = () =>{
  // baixo: 0 e 1 )
  // médio: 2 e 3)
  // alto: 4, 5 e 6)

  let barra_titulo =  document.querySelector('#titulo')
  let texto_classificacao =  document.querySelector('#classificacao')
  let texto_resultado =  document.querySelector('#resultado')
  let texto_acao =  document.querySelector('#acao')

  switch (resultado){
    case '0': //IMPROVÁVEL
    case '1': //POUCO PROVÁVEL
      barra_titulo.classList.add('green');
      texto_resultado.textContent = classificacao[0].resultado;
      texto_acao.textContent = classificacao[0].acao;      
      break;
    case '2'://SUSPEITA – INÍCIO DO CURSO
    case '3'://SUSPEITA – MEIO DO CURSO
      barra_titulo.classList.add('yellow');
      texto_resultado.textContent = classificacao[1].resultado;
      texto_acao.textContent = classificacao[1].acao;      
      break;
    case '4'://FORTE SUSPEITA – INÍCIO DO CURSO
    case '5'://FORTE SUSPEITA – MEIO DO CURSO
    case '6'://FORTE SUSPEITA – RISCO ETÁRIO ou COMORBIDADES
      barra_titulo.classList.add('red');
      texto_resultado.textContent = classificacao[2].resultado;
      texto_acao.textContent = classificacao[2].acao;      
      break;    
  }
}
