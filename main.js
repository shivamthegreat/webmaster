var model = {
    answer: "",
    answerToggle: false,
    needsReset: false,
    petitionText: "Peter, please answer the following question:",
    funMode: false // New feature: Fun mode toggle
};

var controller = {
    init: () => {
        view.init();
    },
    keyDown: (e) => {
        let len = view.getPetitionLength();

        if (e.key === '.') { // Period toggles answer mode
            model.answerToggle = !model.answerToggle;
            document.getElementById('petition').value += model.petitionText[len];
            return false;
        } else if (e.key.length === 1 && model.answerToggle) { // In answer mode
            model.answer += e.key;
            document.getElementById('petition').value += model.petitionText[len];
            console.log(`Answer so far: ${model.answer}`);
            return false;
        } else if (e.key === "Backspace" && model.answerToggle) { // Handle backspace
            model.answer = model.answer.slice(0, -1);
        }
    },
    toggleFunMode: () => {
        model.funMode = !model.funMode;
        view.updateFunModeIndicator();
    },
    getResetStatus: () => model.needsReset,

    getPetitionChar: () => model.petitionText[view.getPetitionLength() - 1],

    getAnswer: () => {
        const invalidResponse = [
            "That's not how you petition to Peter.",
            "Invalid petition. Please try again.",
            "You're not asking correctly.",
            "Why should I answer that?",
            "Please try again tomorrow. Or never...",
            "I'm tired... Try again another time.",
            "Not now, I'm busy. Maybe later.",
            "Fix your petition, please.",
        ];
        const funResponses = [
            "Peter says: Keep calm and carry on!",
            "Peter chuckles and says: Absolutely not!",
            "Peter replies: Why not?",
            "Peter ponders... then nods wisely.",
        ];
        const invalidQuestion = "Please ask Peter a valid question.";
        model.needsReset = true;

        if (!view.getQuestion()) { // Valid Question check
            return invalidQuestion;
        } else if (model.answer) { // Valid Petition check
            return model.funMode
                ? funResponses[Math.floor(Math.random() * funResponses.length)]
                : `Peter says: ${model.answer}`;
        } else { // Invalid Response
            let randomNum = Math.floor(Math.random() * invalidResponse.length);
            return invalidResponse[randomNum];
        }
    },

    reset: () => {
        model.answer = '';
        model.answerToggle = false;
        model.needsReset = false;
        view.resetUi();
    }
};

var view = {
    init: () => {
        document.getElementById('answerButton').addEventListener('click', view.renderAnswer);
        document.getElementById('resetButton').addEventListener('click', controller.reset);
        document.getElementById('funModeButton').addEventListener('click', controller.toggleFunMode);
        document.getElementById('petition').onkeydown = (event) => {
            if (document.getElementById('petition').value === '') {
                controller.reset();
            }
            return controller.keyDown(event);
        };
        document.getElementById('question').onkeydown = (event) => {
            switch (event.key) {
                case "?":
                case "Enter":
                    if (!document.getElementById('question').value.includes('?')) {
                        document.getElementById('question').value += "?";
                    }
                    view.renderAnswer();
                    break;
            }
        };
        document.getElementById('petition').onfocus = () => {
            if (controller.getResetStatus()) {
                controller.reset();
            }
        };
        view.updateFunModeIndicator();
    },

    getInputText: () => document.getElementById('petition').value,

    getPetitionLength: () => document.getElementById('petition').value.length,

    getQuestion: () => document.getElementById('question').value,

    renderAnswer: () => {
        view.loadingBar(() => {
            document.getElementById('answer').innerHTML = controller.getAnswer();
            view.showAnswer();
        });
        view.disableQuestion();
        view.clearPetition();
    },

    showAnswer: () => {
        document.getElementById('answer').style.display = "block";
    },

    hideAnswer: () => {
        document.getElementById('answer').style.display = "none";
    },

    resetUi: () => {
        view.clearPetition();
        view.clearQuestion();
        view.clearAnswer();
        view.enableQuestion();
        view.hideAnswer();
    },

    clearPetition: () => {
        document.getElementById('petition').value = '';
    },

    clearQuestion: () => {
        document.getElementById('question').value = '';
    },

    clearAnswer: () => {
        document.getElementById('answer').innerHTML = '';
    },

    disableQuestion: () => {
        document.getElementById('question').disabled = true;
    },

    enableQuestion: () => {
        document.getElementById('question').disabled = false;
    },

    updateFunModeIndicator: () => {
        document.getElementById('funModeStatus').innerText = model.funMode ? "Fun Mode: ON" : "Fun Mode: OFF";
    },

    loadingBar: (callback) => {
        var bar = document.getElementById('loading');
        var barInside = document.getElementById('loading-inside');
        var progress = 0;
        var interval = setInterval(() => {
            if (progress >= 100) {
                bar.style.display = "none";
                clearInterval(interval);
                callback();
            } else {
                progress += 1;
                barInside.style.width = progress + '%';
            }
        }, 10);
        bar.style.display = "block";
    }
};

controller.init();
