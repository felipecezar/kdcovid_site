$('.ui.checkbox').checkbox();

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;

let perguntas = [];
let bairros = {};
let perguntaAtual = 1;
let pulo = false;
let questionario_respostas = [];

let cadAnt  = localStorage.getItem('cadAnt') ? JSON.parse(localStorage.getItem('cadAnt')) : [];

let api_json = {
  "age16to30Years":false,
  "age1to15Years":false,
  "age31to45Years":false,
  "age46to60Years":false,
  "age60PlusYears":false,
  "android_id":"site",
  "cityName":"",
  "neighborhoodName":"",
  "otherCity":false,
  "dontHavePriorDisease":false,
  "duration11to14Days":false,
  "duration14PlusDays":false,
  "duration1to3Days":false,
  "duration4to7Days":false,
  "duration8to10Days":false,
  "email":"",
  "phone":"",
  "female":false,
  "male":false,
  "otherGender":false,
  "fullName":"",
  "fullNameDWA":false,
  "hadContactWithInfected":false,
  "hadContactWithOutsider":false,
  "hadLast14DaysNOA":false,
  "hasBreathProblem":false,
  "hasCancer":false,
  "hasChestPressure":false,
  "hasChronicKidney":false,
  "hasChronicRespiratory":false,
  "hasCough":false,
  "hasDiabetes":false,
  "hasDiarrhea":false,
  "hasFever":false,
  "hasHeartProblem":false,
  "hasHighPressure":false,
  "hasNOASymptom":false,
  "hasPurpleMouth":false,
  "hasRunningNose":false,
  "hasSmellTasteLoss":false,
  "hasSoreThroat":false,
  "hasSymptom":false,
  "hasTiredness":false,
  "priorDiseasesDWA":false,
  "resultCode":0,
  "visitedPoints":"",
  "wentOutOfCity":false,
  "zipCode":null
}

window.onload = function() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(geoSucesso,geoErro)
  }
  comecar_questionario();
  //enviarQuestionario();
}

const geoSucesso = (posicao) => {
  api_json['visitedPoints'] = `${posicao.coords.latitude} ${posicao.coords.longitude}`;
}
const geoErro = (erro) => {
  api_json['visitedPoints'] = "";
}

////////////////////////////////////////////////////////////////////////////////
const enviarQuestionario = () => {
  
  console.log(api_json);

  var dados = `{"android_id": "${api_json['android_id']}","phone":"${api_json['phone']}","age16to30Years":${api_json['age16to30Years']},"age1to15Years":${api_json['age1to15Years']},"age31to45Years":${api_json['age31to45Years']},"age46to60Years":${api_json['age46to60Years']},"age60PlusYears":${api_json['age60PlusYears']}, "cityName":"${api_json['cityName']}","dontHavePriorDisease":${api_json['dontHavePriorDisease']},"duration11to14Days":${api_json['duration11to14Days']},"duration14PlusDays":${api_json['duration14PlusDays']},"duration1to3Days":${api_json['duration1to3Days']},"duration4to7Days":${api_json['duration4to7Days']},"duration8to10Days":${api_json['duration8to10Days']},"email":"${api_json['email']}","female":${api_json['female']},"fullName":"${api_json['fullName']}","fullNameDWA":${api_json['fullNameDWA']}, "hadContactWithInfected":${api_json['hadContactWithInfected']},"hadContactWithOutsider":${api_json['hadContactWithOutsider']},"hadLast14DaysNOA":${api_json['hadLast14DaysNOA']},"hasBreathProblem":${api_json['hasBreathProblem']},"hasCancer":${api_json['hasCancer']},"hasChestPressure":${api_json['hasChestPressure']},"hasChronicKidney":${api_json['hasChronicKidney']},"hasChronicRespiratory":${api_json['hasChronicRespiratory']},"hasCough":${api_json['hasCough']},"hasDiabetes":${api_json['hasDiabetes']},"hasDiarrhea":${api_json['hasDiarrhea']},"hasFever":${api_json['hasFever']},"hasHeartProblem":${api_json['hasHeartProblem']},"hasHighPressure":${api_json['hasHighPressure']},"hasNOASymptom":${api_json['hasNOASymptom']},"hasPurpleMouth":${api_json['hasPurpleMouth']},"hasRunningNose":${api_json['hasRunningNose']},"hasSmellTasteLoss":${api_json['hasSmellTasteLoss']},"hasSoreThroat":${api_json['hasSoreThroat']},"hasSymptom":${api_json['hasSymptom']},"hasTiredness":${api_json['hasTiredness']},"male":${api_json['male']},"neighborhoodName":"${api_json['neighborhoodName']}","otherCity":${api_json['otherCity']},"otherGender":${api_json['otherGender']},"priorDiseasesDWA":${api_json['priorDiseasesDWA']},"resultCode":${api_json['resultCode']},"visitedPoints":"${api_json['visitedPoints']}","wentOutOfCity":${api_json['wentOutOfCity']},"zipCode":${api_json['zipCode']}}`;

  
  const cadastro = {'telefone':  api_json['phone'], 
                    'email':  api_json['email'], 
                    'date': new Date().getTime()};          
  cadAnt.push(cadastro);

  localStorage.setItem("cadAnt", JSON.stringify(cadAnt));

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const urlencoded = new URLSearchParams();
  urlencoded.append("patient_json",dados);
  const requestOptions = {
    mode: 'no-cors',
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  
  const url_api = "http://kd-covid.com.br/api/v1/Api.php?apicall=createpatient";
  fetch(url_api, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      console.log('Enviado')
      return window.location.assign("/result.html");
    })
    .catch(error => console.log('Erro:', error));
}

/////////////////////////////////////////////////////////////////////////////////
var comecar_questionario = () => {
  fetch("./perguntas.json")
  .then(res => res.json())
  .then(json => {
    perguntas = json;
    carregarBairros();
    mostrar(perguntaAtual);
  });
}

/////////////////////////////////////////////////////////////////////////////////
var pegarRespostasCheckbox = (resps) => {
    let values = [];
    resps.forEach(r => values.push(r.value));
    return values;
}

/////////////////////////////////////////////////////////////////////////////////
var proximaPergunta = () => {

  let pergunta =  document.querySelector('.enunciado').textContent;
  let respostas = [];

  let selecionadas = document.querySelectorAll('.opcao:checked');
  respostas = pegarRespostasCheckbox(selecionadas);
  selecionadas.forEach(r => api_json[r.dataset.json] = true);


  if (perguntas[perguntaAtual-1].tipo == "select"){
    let cidade = document.querySelector("#caixa_selecao_cidade");
    let bairro = document.querySelector("#caixa_selecao_bairro");
    respostas = [cidade.options[cidade.selectedIndex].value, bairro.options[bairro.selectedIndex].value ];
    api_json['cityName'] = cidade.options[cidade.selectedIndex].value;
    api_json['neighborhoodName'] = bairro.options[bairro.selectedIndex].value;
  }

  if (perguntas[perguntaAtual-1].tipo == "text"){

    if (perguntas[perguntaAtual-1].mascara == "nome"){
      api_json["fullName"] = document.querySelector("input[type=text]").value;
      api_json["fullNameDWA"] = document.querySelector('#inputNaoPreencher').checked;
      respostas = [document.querySelector("input[type=text]").value];
    }
    else if (perguntas[perguntaAtual-1].mascara == "contato"){
      let fone =  document.querySelector("input[type=tel]").value;
      let email = document.querySelector("input[type=email]").value;
      api_json["phone"] = fone;
      api_json["email"] = email;
      respostas = [fone,email];

    }

  }

///////////////////////// TRATANDO ERROS ///////////////////////////////////////

  const antTelefones = cadAnt.filter(c => c.telefone ===  api_json["phone"] && api_json["phone"] !== '').map(c => c.date);
  let horasFone;

  antTelefones.forEach( x => {
    const intervalo = Math.abs(new Date().getTime() - x); 
    horasFone = Math.ceil(intervalo / (1000 * 60 * 60));
  });

  const antEmails = cadAnt.filter(c => c.email ===  api_json["email"] && api_json["email"] !== '').map(c => c.date);
  let horasEmail;

  antEmails.forEach( x => {
    const intervalo = Math.abs(new Date().getTime() - x); 
    horasEmail = Math.ceil(intervalo / (1000 * 60 * 60));
  });


  let listaErros =  document.querySelector('#listaErros');
  listaErros.textContent = '';
  let msg =  document.querySelector('.message');
  let camposInvalido = document.querySelectorAll('input:invalid');

  if (respostas.length == 0){
    let errolist1 = document.createElement("li");
    errolist1.textContent = 'Favor selecionar pelo menos uma resposta.';
    listaErros.appendChild(errolist1);
    msg.classList.remove('hidden');
  }
  else if ( perguntas[perguntaAtual-1].mascara == "nome"
            && document.querySelector('#inputPreencher').checked
            && document.querySelector("input[type=text]").value == ''){
    let errolist2 = document.createElement("li");
    errolist2.textContent = 'Favor informe o nome ou selecione não preencher';
    listaErros.appendChild(errolist2);
    msg.classList.remove('hidden');
  }
  else if (camposInvalido.length > 0){
    camposInvalido.forEach(item => {
      if (item.type == 'email'){
        let errolist3 = document.createElement("li");
        errolist3.textContent = 'Email inválido.';
        listaErros.appendChild(errolist3);
      }
      if (item.type == 'tel'){
        let errolist4 = document.createElement("li");
        errolist4.textContent= 'Telefone inválido.';
        listaErros.appendChild(errolist4);
      }
    });
    msg.classList.remove('hidden');
  }
  else if ( perguntas[perguntaAtual-1].mascara == "contato"
            && document.querySelector("input[type=tel]").value === ""
            && document.querySelector("input[type=email]").value === ""){
    let errolist5 = document.createElement("li");
    errolist5.textContent = 'Favor preecher email e/ou telefone.';
    listaErros.appendChild(errolist5);
    msg.classList.remove('hidden');
  }
  else if (perguntas[perguntaAtual-1].mascara == "contato" && horasFone < 48) {
    let errolist6 = document.createElement("li");
    errolist6.textContent = 'Houve um teste com esse telefone nas ultimas 48 horas.';
    listaErros.appendChild(errolist6);
    msg.classList.remove('hidden');
  }
  else if (perguntas[perguntaAtual-1].mascara == "contato" && horasEmail < 48) {
    let errolist7 = document.createElement("li");
    errolist7.textContent = 'Houve um teste com esse e-mail nas ultimas 48 horas.';
    listaErros.appendChild(errolist7);
    msg.classList.remove('hidden');
  }

  else {
    perguntaAtual += 1;
    msg.classList.add('hidden');
  }

  let dado = {
    pergunta: pergunta,
    respostas: respostas
  }
  questionario_respostas.push(dado);

  if ( perguntaAtual > perguntas.length) {
    calcularRisco();
    localStorage.setItem("resultado", api_json['resultCode']);
    enviarQuestionario();  
  }

  if(pergunta == "Como você está se sentindo?" && respostas.includes('Bem, sem nenhum tipo de sintoma')){
    perguntaAtual = 5;
    pulo = true;
  }

  mostrar(perguntaAtual);
}

////////////////////////////////////////////////////////////////////////////////
const voltarPergunta = () => {
  if(perguntaAtual== 5 && pulo == true){
    perguntaAtual = 1;
    pulo = false;
  } else{
    perguntaAtual -= 1;
  }

  mostrar(perguntaAtual);
}

////////////////////////////////////////////////////////////////////////////////
var carregarBairros = () =>{
  fetch("./bairros.json")
  .then(res => res.json())
  .then(json => {
    bairros = json;
  });
}

///////////////////////////////////////////////////////////////////////////////////
var cidade_selecionada = (cidade_select) => {
      let bairro_select = document.querySelector('#caixa_selecao_bairro');
      bairro_select.length = 1;
      bairro_select.options[0].text = "Escolha o bairro";
      bs = bairros[cidade_select.options[cidade_select.selectedIndex].value];
      bs.forEach((bairro,i) =>
        bairro_select.options[bairro_select.options.length] = new Option(bairro, bairro))
}

////////////////////////////////////////////////////////////////////////////////
var formatarTelefone = (telefone) => {

  let textoAtual = telefone.value;
  textoAtual = textoAtual.replace(/[\-,\(,\),\ ]/g,'');
  let textoAjustado = "";

  if(textoAtual.length >= 11) {
    const parte1 = textoAtual.slice(0,2);
    const parte2 = textoAtual.slice(2,7);
    const parte3 = textoAtual.slice(7,11);
    textoAjustado = `(${parte1})${parte2}-${parte3}`;
  }

  if(textoAtual.length === 10) {
    const parte1 = textoAtual.slice(0,2);
    const parte2 = textoAtual.slice(2,6);
    const parte3 = textoAtual.slice(6,10);
    textoAjustado = `(${parte1})${parte2}-${parte3}`;
  }
  telefone.value = textoAjustado;
}

////////////////////////////////////////////////////////////////////////////////
var desmarcarCheckboxs = (item) => {
  document.querySelectorAll("input")
    .forEach(cb => cb.checked = false);
  item.checked = true;
}

////////////////////////////////////////////////////////////////////////////////
var desmarcarDesmarcadores = () => {
  document.querySelectorAll(".desmarcador")
    .forEach(cb => cb.checked = false);
}

////////////////////////////////////////////////////////////////////////////////
var criarEnunciado = (id) =>{
  let enunciado = document.createElement("h3");
  enunciado.classList.add('enunciado','ui', 'dividing','header', 'center', 'aligned');
  enunciado.textContent = perguntas[id-1].pergunta;
  return enunciado;
}

////////////////////////////////////////////////////////////////////////////////
var criarCampoTexto = (id) =>{

  let itemLista = document.createElement("div");

  if (perguntas[id-1].mascara == "nome"){
    let itemLista1 = document.createElement("div");
    itemLista1.classList.add('field');

    let preencherCheckbox  = document.createElement("div");
    preencherCheckbox.classList.add('ui', 'toggle','checkbox','radio');

    let preencherInput  = document.createElement("input");
    preencherInput.classList.add('opcao');
    preencherInput.setAttribute("type", "radio");
    preencherInput.setAttribute("name", "checkbox-"+id);
    preencherInput.setAttribute("value", "preencher");
    preencherInput.setAttribute("id", "inputPreencher");

    preencherInput.setAttribute("data-json", "fullNameDWA");
    preencherCheckbox.appendChild(preencherInput);

    let preencherLabel  = document.createElement("label");
    preencherLabel.textContent = "Preencher";
    preencherLabel.setAttribute("for", "inputPreencher");

    preencherCheckbox.onchange = () => {
      let e = document.querySelector('#nomeInput');
      e.classList.remove("esconder");
    }


    preencherCheckbox.appendChild(preencherLabel);
    itemLista1.appendChild(preencherCheckbox);

    let itemLista2 = document.createElement("div");
    itemLista2.classList.add('field');

    let naoPreencherCheckbox  = document.createElement("div");
    naoPreencherCheckbox.classList.add('ui', 'toggle','checkbox','radio');

    let naoPreencherInput  = document.createElement("input");
    naoPreencherInput.classList.add('opcao');
    naoPreencherInput.setAttribute("type", "radio");
    naoPreencherInput.setAttribute("name", "checkbox-"+id);
    naoPreencherInput.setAttribute("value", "Nao preencher");
    naoPreencherInput.setAttribute("id", "inputNaoPreencher");

    naoPreencherInput.setAttribute("data-json", "fullNameDWA");
    naoPreencherCheckbox.appendChild(naoPreencherInput);

    let naoPreencherLabel  = document.createElement("label");
    naoPreencherLabel.textContent = "Não preencher";
    naoPreencherLabel.setAttribute("for", "inputNaoPreencher");
    naoPreencherCheckbox.appendChild(naoPreencherLabel);
    naoPreencherCheckbox.onchange = () => {
      let e = document.querySelector('#nomeInput');
      e.classList.add("esconder");
    }
    itemLista2.appendChild(naoPreencherCheckbox);

    let itemLista3 = document.createElement("div");
    itemLista3.classList.add('esconder','ui', 'labeled', 'input');
    itemLista3.setAttribute("id", "nomeInput");

    let nomeLabel = document.createElement("div");
    nomeLabel.classList.add('ui','label');
    nomeLabel.textContent = 'Nome';
    itemLista3.appendChild(nomeLabel);

    let nomeInput  = document.createElement("input");
    nomeInput.classList.add('opcao');
    nomeInput.setAttribute("type", "text");
    nomeInput.setAttribute("maxlength", "40");
    nomeInput.setAttribute("placeholder", "Informe aqui seu nome");
    itemLista3.appendChild(nomeInput);

    itemLista.appendChild(itemLista1);
    itemLista.appendChild(itemLista2);
    itemLista.appendChild(itemLista3);
  }

  if (perguntas[id-1].mascara == "contato"){

    let itemLista1 = document.createElement("div");
    itemLista1.classList.add('ui', 'labeled', 'input');

    let telefoneLabel = document.createElement("div");
    telefoneLabel.classList.add('ui','label');
    telefoneLabel.textContent = 'Telefone';
    itemLista1.appendChild(telefoneLabel);

    let telefoneInput  = document.createElement("input");
    telefoneInput.classList.add('opcao');
    telefoneInput.setAttribute("type", "tel");
    telefoneInput.setAttribute("maxlength", "11"); 
    telefoneInput.setAttribute("pattern", "\\([0-9]{2}\\)[0-9]{4,5}-[0-9]{4}$");
    telefoneInput.setAttribute("placeholder", "(38)99999-9999");
    telefoneInput.setAttribute("onblur", "formatarTelefone(this)");
    itemLista1.appendChild(telefoneInput);

    let itemLista2 = document.createElement("div");
    itemLista2.classList.add('ui', 'labeled', 'input');

    let emailLabel = document.createElement("div");
    emailLabel.classList.add('ui','label');
    emailLabel.textContent = 'E-mail';
    itemLista2.appendChild(emailLabel);

    let emailInput  = document.createElement("input");
    emailInput.classList.add('opcao');
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");

    itemLista2.appendChild(emailInput);

    itemLista.appendChild(itemLista1);
    itemLista.appendChild(document.createElement("br"));
    itemLista.appendChild(document.createElement("br"));
    itemLista.appendChild(itemLista2);

  }
  return itemLista;
}

////////////////////////////////////////////////////////////////////////////////
var criarCampoCidade = (id) =>{
  let itemLista = document.createElement("div");
  itemLista.classList.add('field');
  let cidade_select = document.createElement("select");
  cidade_select.setAttribute("id", "caixa_selecao_cidade");
  perguntas[id-1].opcoes.forEach((op,i)=>
    {
      let option  = document.createElement("option");
      option.textContent = op.texto;
      option.setAttribute("value", op.texto);
      cidade_select.appendChild(option);
    });
  cidade_select.setAttribute("onchange", "cidade_selecionada(this)");
  itemLista.appendChild(cidade_select);
  return itemLista;
}

////////////////////////////////////////////////////////////////////////////////
var criarCampoBairro = (id) =>{
  let itemLista = document.createElement("div");
  itemLista.classList.add('field');

  let bairro_select = document.createElement("select");
  bairro_select.setAttribute("id", "caixa_selecao_bairro");

  let option  = document.createElement("option");
  option.textContent = "Primeiro escolha a cidade";
  option.setAttribute("value", "");
  bairro_select.appendChild(option);

  itemLista.appendChild(bairro_select);
  return itemLista;
}

////////////////////////////////////////////////////////////////////////////////
var criarCampoCheckBox = (id,op,i) =>{
  let itemLista = document.createElement("div");
  itemLista.classList.add('field');

  let itemCheckbox  = document.createElement("div");
  itemCheckbox.classList.add('ui', 'toggle','checkbox');

  if (perguntas[id-1].tipo == "radio"){
    itemCheckbox.classList.add('radio');
  }

  let itemInput  = document.createElement("input");
  itemInput.classList.add('opcao');
  itemInput.setAttribute("type", perguntas[id-1].tipo);
  itemInput.setAttribute("name", "checkbox-"+id);
  itemInput.setAttribute("id", i);
  itemInput.setAttribute("value", op.texto);

  itemInput.setAttribute("data-json", op.id);

  itemCheckbox.appendChild(itemInput);

  let itemLabel  = document.createElement("label");
  itemLabel.textContent = op.texto;
  itemLabel.setAttribute("for", i);
  itemCheckbox.appendChild(itemLabel);

  itemLista.appendChild(itemCheckbox);

  if (perguntas[id-1].tipo == "checkbox" && ["Nenhum destes","Não possuo","Não quero responder"].includes(op.texto)){
    itemInput.classList.add('desmarcador');
    itemInput.setAttribute("onclick", "desmarcarCheckboxs(this)");
  } else{
    itemInput.setAttribute("onclick", "desmarcarDesmarcadores()");
  }
  return itemLista;
}

////////////////////////////////////////////////////////////////////////////////
var mostrar = (id) => {

  let btn_voltar = document.querySelector('.btn_voltar');
  btn_voltar.classList.toggle("disabled", id == 1 );

  let pergunta = document.querySelector('#pergunta');
  pergunta.innerHTML = "";

  pergunta.appendChild(criarEnunciado(id));

  switch (perguntas[id-1].tipo) {
    case "select":
      pergunta.appendChild(criarCampoCidade(id));
      pergunta.appendChild(criarCampoBairro(id));
      break;
    case "text":
      pergunta.appendChild(criarCampoTexto(id));
      break;
    case  "checkbox":
    case  "radio":
        perguntas[id-1].opcoes
        .forEach((op,i) => pergunta.appendChild(criarCampoCheckBox(id,op,i)));
        break;
    default:
      console.log('Tipo de pergunta invalido!');
  }

}

////////////////////////////////////////////////////////////////////////////////
const calcularRisco = () => {

  let sente_bem      = null;
  let teve_contato   = null;
  let tem_sintoma    = null;
  let tem_febre      = null;
  let tempo_1a7      = null;
  let tempo_7a14     = null;
  let tempo_plus14   = null;
  let idade60        = null;
  let idadeMenor30   = null;
  let comorbidade    = null;
  let qt_sistomas    = null;


  questionario_respostas.forEach(resp => {
    switch (resp.pergunta) {
      case "Como você está se sentindo?":
        sente_bem = resp.respostas.includes("Bem, sem nenhum tipo de sintoma");
        break;
      case "Nos últimos 14 dias, você:":
        teve_contato = !resp.respostas.includes("Nenhum destes");
        break;
      case "Assinale os sintomas que você tem sentido.":
        if (resp.respostas.includes("Nenhum destes")){
            tem_sintoma = false;
            qt_sistomas = 0;
        }else {
          tem_sintoma = true;
          qt_sistomas = resp.respostas.length;
        }
        tem_febre = resp.respostas.includes("Febre");
        break;
      case "Há quanto tempo você se sente assim?":
        tempo_1a7 = resp.respostas.includes("1 a 3 dias") || resp.respostas.includes("4 a 7 dias");
        tempo_7a14 = resp.respostas.includes("8 a 10 dias") || resp.respostas.includes("11 a 14 dias");
        tempo_plus14 = resp.respostas.includes("Mais de 14 dias");
        break;
      case "Assinale sua faixa etária (idade)":
        idade60 = resp.respostas.includes("Mais de 60 anos");
        idadeMenor30 = resp.respostas.includes("1 a 15 anos") || resp.respostas.includes("16 a 30 anos");
        break;
      case "Possui alguma dessas doenças?":
        if (resp.respostas.length > 0 && !resp.respostas.includes("Não possuo","Não quero responder")){
          comorbidade = true;
        } else{
          comorbidade = false;
        }
        break;
    }
  })

  // console.log('sente_bem ',sente_bem);
  // console.log('teve_contato ',teve_contato);
  // console.log('tem_sintoma ',tem_sintoma);
  // console.log('tem_febre ',tem_febre);
  // console.log('tempo_1a7 ',tempo_1a7);
  // console.log('tempo_7a14 ',tempo_7a14);
  // console.log('tempo_plus14 ',tempo_plus14);
  // console.log('idade60 ',idade60);
  // console.log('idadeMenor30 ',idadeMenor30);
  // console.log('comorbidade ',comorbidade);
  // console.log('qt_sistomas ',qt_sistomas);

  if (sente_bem && !teve_contato){
    //IMPROVÁVEL
    api_json['resultCode'] = 0;
  }
  else if (!sente_bem && !teve_contato && !tem_sintoma){
    //IMPROVÁVEL
    api_json['resultCode'] = 0;
  }
  else if (sente_bem && teve_contato ){
    //POUCO PROVÁVEL
    api_json['resultCode'] = 1;
  }
  else if (!sente_bem && !teve_contato && qt_sistomas == 1){
    //POUCO PROVÁVEL
    api_json['resultCode'] = 1;
  }
  else if (!sente_bem && !teve_contato && qt_sistomas == 2 && !tem_febre){
    //POUCO PROVÁVEL
    api_json['resultCode'] = 1;
  }
  else if (!sente_bem && !teve_contato && qt_sistomas == 2 && tem_febre && tempo_1a7){
    //SUSPEITA – INÍCIO DO CURSO
    api_json['resultCode'] = 2;
  }
  else if (!sente_bem && !teve_contato && qt_sistomas > 1 && !tem_febre && tempo_1a7){
    //SUSPEITA – INÍCIO DO CURSO
    api_json['resultCode'] = 2;
  }
  else if (!sente_bem && qt_sistomas == 2 && tem_febre && !teve_contato && tempo_7a14){
    //SUSPEITA – MEIO DO CURSO
    api_json['resultCode'] = 3;
  }
  else if (!sente_bem && qt_sistomas > 2 && !tem_febre && !teve_contato && tempo_7a14){
    //SUSPEITA – MEIO DO CURSO
    api_json['resultCode'] = 3;
  }
  else if (!sente_bem && qt_sistomas == 2 && tem_febre && teve_contato && tempo_1a7){
    //FORTE SUSPEITA – INÍCIO DO CURSO
    api_json['resultCode'] = 4;
  }
  else if (!sente_bem && qt_sistomas > 2 && !tem_febre && teve_contato && tempo_1a7){
    //FORTE SUSPEITA – INÍCIO DO CURSO
    api_json['resultCode'] = 4;
  }
  else if (!sente_bem && qt_sistomas > 2 && tem_febre && tempo_1a7){
    //FORTE SUSPEITA – INÍCIO DO CURSO
    api_json['resultCode'] = 4;
  }
  else if (!sente_bem && qt_sistomas == 2 && tem_febre && teve_contato && tempo_7a14){
    //FORTE SUSPEITA – MEIO DO CURSO
    api_json['resultCode'] = 5;
  }
  else if (!sente_bem && qt_sistomas > 2 && !tem_febre && teve_contato && tempo_7a14){
    //FORTE SUSPEITA – MEIO DO CURSO
    api_json['resultCode'] = 5;
  }
  else if (!sente_bem && qt_sistomas > 2 && tem_febre && tempo_7a14){
    //FORTE SUSPEITA – MEIO DO CURSO
    api_json['resultCode'] = 5;
  }
  else if (!sente_bem && qt_sistomas == 2 && tem_febre && teve_contato && idade60){
    //FORTE SUSPEITA –  RISCO ETÁRIO
    api_json['resultCode'] = 6;
  }
  else if (!sente_bem && qt_sistomas > 2 && !tem_febre && teve_contato && idade60){
    //FORTE SUSPEITA –  RISCO ETÁRIO
    api_json['resultCode'] = 6;
  }
  else if (!sente_bem && qt_sistomas > 2 && tem_febre && idade60){
    //FORTE SUSPEITA –  RISCO ETÁRIO
    api_json['resultCode'] = 6;
  }
  else if (!sente_bem && qt_sistomas > 2 && tem_febre && teve_contato && comorbidade){
    //FORTE SUSPEITA – COMORBIDADES
    api_json['resultCode'] = 6;
  }
  else if (!sente_bem && qt_sistomas > 2 && !tem_febre && teve_contato && comorbidade){
    //FORTE SUSPEITA – COMORBIDADES
    api_json['resultCode'] = 6;
  }
  else if (!sente_bem && qt_sistomas > 2 && tem_febre && comorbidade){
    //FORTE SUSPEITA – COMORBIDADES
    api_json['resultCode'] = 6;
  }
  else {
    // RESPOSTA PADRÃO
    api_json['resultCode'] = 2;
  }

}
