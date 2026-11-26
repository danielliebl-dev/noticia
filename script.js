
const catalog = {
    "Hatch": {
        "Gol": {
            "2020": {
                "1.0 MPI": ["1.0 MPI 3 cilindros"],
                "1.6 MSI": ["1.6 MSI"]
            },
            "2022": {
                "1.0 MPI": ["1.0 MPI 3 cilindros"]
            }
        },
        "Polo": {
            "2022": {
                "1.0 MPI": ["1.0 MPI"],
                "1.0 TSI": ["1.0 TSI"]
            },
            "2023": {
                "Track": ["1.0 MPI"],
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.0 TSI"]
            },
            "2024": {
                "Track": ["1.0 MPI"],
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.0 TSI"]
            }
        },
        "Fox": {
            "2018": {
                "1.6 MSI": ["1.6 MSI"]
            },
            "2021": {
                "Connect": ["1.6 MSI"]
            }
        }
    },

    "Sedã": {
        "Virtus": {
            "2022": {
                "1.6 MSI": ["1.6 MSI"],
                "Comfortline": ["1.0 TSI"]
            },
            "2024": {
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.0 TSI"]
            }
        },
        "Jetta": {
            "2020": {
                "Comfortline": ["1.4 TSI"],
                "GLI": ["2.0 TSI"]
            }
        }
    },

    "SUV": {
        "T-Cross": {
            "2022": {
                "200 TSI": ["1.0 TSI"],
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.4 TSI"]
            },
            "2024": {
                "Sense": ["1.0 TSI"],
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.4 TSI"]
            }
        },
        "Nivus": {
            "2022": {
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.0 TSI"]
            },
            "2024": {
                "Comfortline": ["1.0 TSI"],
                "Highline": ["1.0 TSI"]
            }
        },
        "Taos": {
            "2023": {
                "Comfortline": ["1.4 TSI"],
                "Highline": ["1.4 TSI"]
            }
        }
    },

    "Picape": {
        "Saveiro": {
            "2022": {
                "Robust": ["1.6 MSI"],
                "Cross": ["1.6 MSI"]
            }
        },
        "Amarok": {
            "2023": {
                "Comfortline": ["3.0 V6 TDI"],
                "Highline": ["3.0 V6 TDI"]
            }
        }
    }
};

const brand = document.getElementById("brand");
const bodyType = document.getElementById("bodyType");
const model = document.getElementById("model");
const year = document.getElementById("year");
const version = document.getElementById("version");
const engine = document.getElementById("engine");

const vehiclePanel = document.getElementById("vehiclePanel");
const problemPanel = document.getElementById("problemPanel");
const chatPanel = document.getElementById("chatPanel");

const nextButton = document.getElementById("nextButton");
const vehicleSummary = document.getElementById("vehicleSummary");

const problem = document.getElementById("problem");
const selectedCar = document.getElementById("selectedCar");
const chatVehicle = document.getElementById("chatVehicle");
const chatMessages = document.getElementById("chatMessages");

let conversationStep = 0;
let selectedVehicle = {};

function fillSelect(element, options, placeholder) {
    element.innerHTML = `<option value="">${placeholder}</option>`;

    options.forEach(option => {
        const item = document.createElement("option");
        item.value = option;
        item.textContent = option;
        element.appendChild(item);
    });

    element.disabled = options.length === 0;
}

function resetAfter(element) {
    if (element === bodyType) {
        fillSelect(model, [], "Selecione a carroceria primeiro");
    }

    if (element === bodyType || element === model) {
        fillSelect(year, [], "Selecione o modelo primeiro");
    }

    if (element === bodyType || element === model || element === year) {
        fillSelect(version, [], "Selecione o ano primeiro");
    }

    fillSelect(engine, [], "Selecione a versão primeiro");

    nextButton.disabled = true;
    updateSummary();
}

function updateSummary() {
    const complete = brand.value && bodyType.value &&
        model.value && year.value && version.value && engine.value;

    if (complete) {
        vehicleSummary.innerHTML =
            `<span class="summary-icon">✓</span>
            <span>${brand.value} ${model.value} · ${year.value} · ${version.value} · ${engine.value}</span>`;
    } else {
        vehicleSummary.innerHTML =
            `<span class="summary-icon">ⓘ</span>
            <span>Preencha todos os campos para identificar seu veículo.</span>`;
    }

    nextButton.disabled = !complete;
}

bodyType.addEventListener("change", () => {
    resetAfter(bodyType);

    const models = Object.keys(catalog[bodyType.value] || {});
    fillSelect(model, models, "Selecione o modelo");
});

model.addEventListener("change", () => {
    resetAfter(model);

    const years = Object.keys(
        catalog[bodyType.value]?.[model.value] || {}
    );

    fillSelect(year, years, "Selecione o ano");
});

year.addEventListener("change", () => {
    resetAfter(year);

    const versions = Object.keys(
        catalog[bodyType.value]?.[model.value]?.[year.value] || {}
    );

    fillSelect(version, versions, "Selecione a versão");
});

version.addEventListener("change", () => {
    fillSelect(engine, [], "Selecione a motorização");

    const engines =
        catalog[bodyType.value]?.[model.value]?.[year.value]?.[version.value] || [];

    fillSelect(engine, engines, "Selecione a motorização");
    updateSummary();
});

engine.addEventListener("change", updateSummary);

nextButton.addEventListener("click", () => {
    selectedVehicle = {
        brand: brand.value,
        body: bodyType.value,
        model: model.value,
        year: year.value,
        version: version.value,
        engine: engine.value
    };

    selectedCar.textContent =
        `${selectedVehicle.brand} ${selectedVehicle.model} · ${selectedVehicle.year} · ${selectedVehicle.version} · ${selectedVehicle.engine}`;

    showPanel("problemPanel", 2);
});

document.getElementById("backVehicle").addEventListener("click", () => {
    showPanel("vehiclePanel", 1);
});

document.querySelectorAll(".example-chip").forEach(button => {
    button.addEventListener("click", () => {
        problem.value = button.dataset.problem;
    });
});

document.getElementById("startChat").addEventListener("click", () => {
    const description = problem.value.trim();

    if (!description) {
        alert("Por favor, descreva o problema do veículo.");
        return;
    }

    chatVehicle.textContent =
        `${selectedVehicle.brand} ${selectedVehicle.model} · ${selectedVehicle.year} · ${selectedVehicle.version} · ${selectedVehicle.engine}`;

    chatMessages.innerHTML = "";
    conversationStep = 0;

    showPanel("chatPanel", 3);

    addMessage(
        "ai",
        `Olá! Vamos começar uma investigação sobre seu veículo.\n\nProblema informado: ${description}\n\nPrimeira pergunta: quando você percebeu esse problema pela primeira vez?`
    );
});

function showPanel(panelId, step) {
    vehiclePanel.classList.add("hidden");
    problemPanel.classList.add("hidden");
    chatPanel.classList.add("hidden");

    document.getElementById(panelId).classList.remove("hidden");

    document.querySelectorAll(".progress-step").forEach(item => {
        item.classList.toggle(
            "active",
            Number(item.dataset.step) <= step
        );
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function addMessage(type, text) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const investigationQuestions = [
    "O problema acontece com o motor frio, depois que ele aquece ou em qualquer momento?",
    "Você percebe alguma luz de advertência acesa no painel?",
    "O veículo apresenta algum barulho, cheiro diferente ou vazamento?",
    "O problema aparece constantemente ou somente em determinadas situações?"
];

document.getElementById("chatForm").addEventListener("submit", event => {
    event.preventDefault();

    const input = document.getElementById("chatInput");
    const answer = input.value.trim();

    if (!answer) return;

    addMessage("user", answer);
    input.value = "";

    if (conversationStep < investigationQuestions.length) {
        addMessage("ai", investigationQuestions[conversationStep]);
        conversationStep++;
    } else {
        addMessage(
            "ai",
            "Obrigado pelas informações. Esta demonstração chegou ao final das perguntas iniciais.\n\nAinda não temos uma base técnica conectada para avaliar seu caso. Não é possível afirmar a causa do defeito somente com essas respostas.\n\nRecomendação: procure uma oficina qualificada para uma avaliação. Se o veículo apresentar risco à condução, pare em local seguro e solicite assistência."
        );
    }
});

document.getElementById("restart").addEventListener("click", () => {
    problem.value = "";
    document.getElementById("chatInput").value = "";
    showPanel("vehiclePanel", 1);
});

updateSummary();
