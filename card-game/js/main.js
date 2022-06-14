const pickButtons = document.querySelectorAll('button')
const p1CardPick = document.querySelector('#player1CardPick');
const p2CardPick = document.querySelector('#player2CardPick');
const p1CardIMG = document.querySelector('#player1sCard');
const p2CardIMG = document.querySelector('#player2sCard');
const p1Score = document.querySelector('#play1Score');
const p2Score = document.querySelector('#play2Score')
const winnerOutput = document.querySelector('#winner');

// Taking the deck from the API and storing it in a variable:
let deck = null;

function setDeck(deckValue){
    if(deck === null){
        deck = deckValue
        console.log(deck)
    } else {
        return deck;
    }
}

(function fetchDeck(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res=> res.json())
    .then(data=> {
        // console.log(data.deck_id)
        setDeck(data.deck_id)
    })
    .catch(err => {
        console.log(`error: ${err}`)
    });
}())

const drawCards = {
    p1IntialDraw: true,
    p2InitialDraw: true,
    p1cardCount: 2,
    p2cardCount: 2,
    p1Score: 0,
    p2Score: 0,
    p1Bust: false,
    p2Bust: false,

    player1drawCard: function(){
        if(this.p2Bust === true) {
            console.log ('read')
            return
        } else if(this.p1IntialDraw === true) {
            this.p1cardCount = 2;
        } else {
            this.p1cardCount = 1;
        }
        fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=${this.p1cardCount}`)
        .then (res=> res.json())
        .then(data => {
            let values = Array.from(data.cards)
            console.log(values)
            console.log(values.forEach(elem=> this.p1totalScore(elem.value)))
            this.p1IntialDraw = false;
        })
        .catch(err=>{
            console.log(`Error: ${err}`)
        });
    },

    player2drawCard: function (){
        if(this.p2Bust === true) {
            return
        } else if(this.p2InitialDraw === true) {
            this.p2cardCount = 2;
        } else {
            this.p2cardCount = 1;
        }
        fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=${this.p2cardCount}`)
        .then (res=> res.json())
        .then(data => {
            let values = Array.from(data.cards)
            console.log(values)
            console.log(values.forEach(elem=> this.p2totalScore(elem.value)))
            this.p2InitialDraw = false;
            console.log(data);
        })
        .catch(err=>{
            console.log(`Error: ${err}`)
        });
    },

    p1totalScore: function(card){
        switch(card){
            case 'ACE':
                card = Number(14);
                this.p1Score += card;
                break;
            case 'KING':
                card = Number(13);
                this.p1Score += card;
                break
            case 'QUEEN':
                card = Number(12);
                this.p1Score += card;
                break
            case 'JACK':
                card= Number(11);
                this.p1Score += card;
                break
            default:
                card = Number(card);
                this.p1Score += card;
                break
        }
        if(this.p1Score>21){
            p1Score.innerText = 'Bust';
            this.p1Bust = true;
        } else {
            p1Score.innerText = this.p1Score;
        }
    },

    p2totalScore: function(card){
        switch(card){
            case 'ACE':
                card = Number(14);
                this.p2Score += card;
                break;
            case 'KING':
                card = Number(13);
                this.p2Score += card;
                break
            case 'QUEEN':
                card = Number(12);
                this.p2Score += card;
                break
            case 'JACK':
                card= Number(11);
                this.p2Score += card;
                break
            default:
                card = Number(card);
                this.p2Score += card;
                break
        }
        if(this.p2Score>21){
            p2Score.innerText = 'Bust'
            this.p2Bust = true;
        } else {
            p2Score.innerText = this.p2Score;
        }
    }
}


Array.from(pickButtons).forEach(link=> {
    link.addEventListener('click', e=>{
        if(e.target.id === 'player1CardPick'){
            drawCards.player1drawCard();
        } else if(e.target.id === 'player2CardPick'){
            drawCards.player2drawCard();
        }
    })
})


