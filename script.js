/* TODO: inserite il codice JavaScript necessario a completare il MHW! */
const reply = {"ferrari": 0, "redbull": 0, "astonmartin":0, "renault":0,"brawn":0,
    "williams":0, "mclaren":0, "racingpoint":0, "mercedes":0};

let taken = {};

//Funzione che aggiunge un listener a tutti gli elementi della griglia delle risposte
const blocchi = document.querySelectorAll(".choice-grid div");
for (const blocco of blocchi) {
    blocco.addEventListener("click", BoxClick);
}

//Funzione che gestisce l'evento Click in uno dei blocchi rendendolo Checked o Unchecked, 
//I due eventi Check e Unchecked con i cambi di style associati sono implementate subito dopo
function BoxClick(event){
    event.stopPropagation();
    const blocco = event.currentTarget;
    const blocchi = blocco.parentNode.querySelectorAll(".choice-grid div");
    for (const div of blocchi) {
        if(div !== blocco) uncheck(div);
        else check(div);
    }
    taken[blocco.dataset.questionId] = blocco.dataset.choiceId;

	//Se l'evento di Click è il terzo, e pertanto vi sono 3 checked replies, fa partire la funzione che ci mostra il risultato
    if(test_end()){
        DeleteListenersAndShowResult();
    }
}

//Funzioni che modificano lo style se l'elemento è selezionato o no, sottofunzioni di BoxClick
function uncheck(div){
    div.classList.add("uncheckedbackground");
    div.classList.remove("checkedbackground")
    const unchecked = div.querySelector(".checkbox");
    unchecked.src = 'images/unchecked.png';
}
function check(div){
    div.classList.remove("uncheckedbackground")
    div.classList.add("checkedbackground");
    const checked = div.querySelector(".checkbox");
    checked.src = 'images/checked.png';
}


// Funzione che una volta selezionate tre risposte alle tre domande (Vedi test_end) 
// elimina i listeners ai blocchi e ci mostra il risultato
function DeleteListenersAndShowResult(){
    const blocchi = document.querySelectorAll(".choice-grid div");
        for (const blocco of blocchi) {
            blocco.removeEventListener("click", BoxClick);
        }
    const result = document.querySelector("#result");
    result.classList.remove("hidden");

    const winner = alg_result()
    const titolo = document.querySelector("#result h1");
    titolo.textContent = RESULTS_MAP[winner].title;
    const testo = document.querySelector("#result p");
    testo.textContent = RESULTS_MAP[winner].contents;
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
}

//Mini-Funzione che restituisce vero quando le risposte selezionate sono 3
//Serve come condizione necessaria a far partire la funzione DeleteListenersAndShowResult
function test_end(){
    return Object.keys(taken).length === 3;
}

//Funzione che integra l'algoritmo che, secondo specifiche dell'esercizio, elabora le risposte e mostra il risultato
function alg_result(){
    for (const key in taken) {
        if (Object.hasOwnProperty.call(taken, key)) {
            const scelta = taken[key];
            reply[scelta] = reply[scelta] + 1;
        }
    }
	
    let maxKey = null;
    let maxValue = -1; 
    for (const key in reply) {
            if(reply[key] > maxValue){
                maxKey = key;
                maxValue = reply[key];
            }
    }
	//Se le risposte sono tutte diverse, prendi il risultato corrispondente alla risposta della domanda 1
    if(maxValue ===1) return taken["one"];
    else return maxKey;
}

//Funzione che svolge le azioni richieste quando premiamo "Ricomincia"
function clear(event){
    event.stopPropagation();
    
    //Ripristiniamo lo stato delle risposte del test
    taken = {};
    for (const key in reply) {
        if (Object.hasOwnProperty.call(reply, key)) {
            reply[key] = 0; 
        }
    }
    
	//Ripristiniamo lo stato grafico della pagina
    const blocchi = document.querySelectorAll(".choice-grid div");
    for (const blocco of blocchi) {
        blocco.addEventListener("click", BoxClick);
        blocco.classList.remove("uncheckedbackground");
        blocco.classList.remove("checkedbackground");
    }
   
    //Impostiamo lo stato di tutte le risposte come deselezionate
    const unchecked = document.querySelectorAll(".checkbox");
    for (const unc of unchecked) {
        unc.src = 'images/unchecked.png';
    }

    //Ripristiniamo il risultato del test non visibile
    const result = event.currentTarget.parentNode;
    result.classList.add("hidden");

	//Ritorniamo in cima alla pagina in modo che sembri esattamente come se l'avessimo aggiornata
    window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
}

const reset = document.querySelector("#result button");
reset.addEventListener("click", clear);



