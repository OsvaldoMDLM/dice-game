    const btnFiredTarget = document.getElementById('btn-fired')
    const btnPlayGameTarget = document.getElementById('btn-play-game')
    const btnPlayTarget = document.getElementById('btn-play')
    const dicesContainerTarget = document.getElementById('dices-container')
    const resultsTarget = document.getElementById('results')
    const wantContainerTarget = document.getElementById('want-container')

    let point = null
    let profit = 0
    let bet = null
    let moneyLose = 0

    const getNumbersFromDOM = () => {
    const availableTarget = document.getElementById('available-to-bet')
    const wantTarget = document.getElementById('want-to-bet')

    const availableToBet = parseFloat(availableTarget.value)
    const wantToBet = bet !== null ? bet : parseFloat(wantTarget.value)

    const result = {
        available: availableToBet,
        want: wantToBet,
        DOM: {
        availableTarget, wantTarget
        }
    }

    const isCorrect = !isNaN(availableToBet) && !isNaN(wantToBet) && availableToBet >= wantToBet && wantToBet > 0
    
    return {
        ...result, 
        r: isCorrect
    }
    }

    const handlerUI = (numbers) => {
    const { availableTarget, wantTarget } = numbers.DOM

    availableTarget.style.boxShadow = '0 0 0.25rem 0 #ced4da'
    wantTarget.style.boxShadow = '0 0 0.25rem 0 #ced4da'

    resultsTarget.innerHTML = ''

    if (numbers.r) return

    if (isNaN(numbers.available)) availableTarget.style.boxShadow = '0 0 0.25rem 0 red'
    if (isNaN(numbers.want) || numbers.want > numbers.available || numbers.want < 1) wantTarget.style.boxShadow = '0 0 0.25rem 0 red'

    return resultsTarget.innerHTML = '<p>Verifica los datos ingresados</p>'
    }

    const getDices = () => {
    const dice1 = Math.round(Math.random() * 5) + 1
    const dice2 = Math.round(Math.random() * 5) + 1

    dicesContainerTarget.innerHTML = `<img src='./img/dices/cd${dice1}.png' alt='Dado 1' /> <img src='./img/dices/cd${dice2}.png' alt='Dado 2' />`

    return { dice1, dice2 }
    }

    const winBet = (dice1, dice2) => (dice1 + dice2 === 7 || dice1 + dice2 === 11)

    const loseBet = (dice1, dice2) => (dice1 + dice2 === 2 || dice1 + dice2 === 3 || dice1 + dice2 === 12)

    const setPoint = (dice1, dice2) => {
    return (dice1 + dice2 === 4 || dice1 + dice2 === 5 || dice1 + dice2 === 6 || dice1 + dice2 === 8 || dice1 + dice2 === 9 || dice1 + dice2 === 10)
    }

    const wonWithPoint = (dice1, dice2) => {
    const dices = dice1 + dice2
    
    return (point === dices)
    }

    const loseWithPoint = (dice1, dice2) => {
    const dices = dice1 + dice2
    
    return (dices === 7)
    }

    const win = (numbers) => {
    profit = numbers.want * 2
    numbers.available += numbers.want * 2
    numbers.DOM.availableTarget.value = numbers.available
    resultsTarget.innerHTML = `<p>Has ganadoooo <strong>${numbers.want}</strong></p>`
    resultsTarget.innerHTML += `<p>Tu saldo actual es de: <strong>${numbers.available}</strong></p>`
    }

    const lose = (numbers) => {
    profit -= numbers.want
    numbers.available -= numbers.want
    numbers.DOM.availableTarget.value = numbers.available
    resultsTarget.innerHTML = `<p>Has perdido <strong>${numbers.want}</strong></p>`
    resultsTarget.innerHTML += `<p>Tu saldo actual es de: <strong>${numbers.available}</strong></p>`
    }

    btnPlayTarget.addEventListener('click', () => {
    btnFiredTarget.style.display = 'none'
    btnPlayGameTarget.style.display = 'initial'
    wantContainerTarget.style.display = bet === null ? 'flex' : 'none'
    point === null ? resultsTarget.innerHTML = '' : null
    dicesContainerTarget.innerHTML = ''
    btnPlayTarget.style.display = 'none'
    })

    btnPlayGameTarget.addEventListener('click', () => {
    const numbers = getNumbersFromDOM()
    handlerUI(numbers)

    if (numbers.r) {
        const { dice1, dice2 } = getDices()

        console.log(dice1 + dice2);
        if (point === null) {
        if (winBet(dice1, dice2)) {
            win(numbers)
        }
        
        if (loseBet(dice1, dice2)) {
            lose(numbers)
        }
        
        if (setPoint(dice1, dice2)) {
            point = dice1 + dice2
            bet = numbers.want
            resultsTarget.innerHTML = `<p>Punto establecido en: ${point}</p>`
        }
        }
        else if (point !== null) {
        resultsTarget.innerHTML = `<p>Punto establecido en: ${point}</p>`
        if (wonWithPoint(dice1, dice2)) {
            win(numbers)
            resultsTarget.innerHTML = `<p>Ganaste por punto establecidos :)</p><p>Punto establecido eliminado</p>`
            bet = null
            point = null
        } else if (loseWithPoint(dice1, dice2)) {
            lose(numbers)
            resultsTarget.innerHTML = '<p>Perdiste por punto establecido :(</p><p>Punto establecido eliminado</p>'
            bet = null
            point = null
        }
        }

        btnPlayGameTarget.style.display = 'none'
        btnPlayTarget.style.display = 'initial'
        btnFiredTarget.style.display = 'initial'
        numbers.DOM.wantTarget.value = ''
        wantContainerTarget.style = 'none'
    }
    })

    btnFiredTarget.addEventListener('click', () => {
    bet = null
    point = null
    dicesContainerTarget.innerHTML = ''
    resultsTarget.innerHTML = `<p>Tuviste una ganancia de: <span class=${profit > 0 ? "won" : "lose" }>${profit}</span><p>Tu saldo final es: ${document.getElementById('available-to-bet').value}</p>`
    document.getElementById('available-to-bet').value = ''
    profit = 0
    })